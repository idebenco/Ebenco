# Security Configuration Guide

This document covers firewall rules, network security, and CORS configuration for the Rental Property Management System.

## Firewall Rules

### Backend API Server (AWS EC2 Security Groups)

#### Inbound Rules

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP/VPN | SSH access for administration |
| HTTP | TCP | 80 | 0.0.0.0/0 | HTTP traffic (redirect to HTTPS) |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS traffic from web/mobile |
| Custom TCP | TCP | 5000 | Security Group ID | Backend API (internal only) |
| MongoDB | TCP | 27017 | MongoDB Atlas IPs | Database access |

#### Outbound Rules

| Type | Protocol | Port Range | Destination | Description |
|------|----------|------------|-------------|-------------|
| All Traffic | All | All | 0.0.0.0/0 | Allow all outbound |

### UFW (Ubuntu Firewall) Configuration

```bash
# Enable UFW
sudo ufw enable

# SSH (adjust IP to your admin IP)
sudo ufw allow from YOUR_IP to any port 22 proto tcp

# HTTP/HTTPS (public access)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Backend API (localhost only - Nginx will proxy)
sudo ufw allow from 127.0.0.1 to any port 5000 proto tcp

# Check status
sudo ufw status verbose
```

### AWS Security Group Template (CloudFormation)

```yaml
SecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: Security group for Rental Management API
    VpcId: !Ref VPC
    SecurityGroupIngress:
      # SSH - Restricted to admin IP
      - IpProtocol: tcp
        FromPort: 22
        ToPort: 22
        CidrIp: YOUR_ADMIN_IP/32
        Description: SSH access
      
      # HTTP - Public
      - IpProtocol: tcp
        FromPort: 80
        ToPort: 80
        CidrIp: 0.0.0.0/0
        Description: HTTP traffic
      
      # HTTPS - Public
      - IpProtocol: tcp
        FromPort: 443
        ToPort: 443
        CidrIp: 0.0.0.0/0
        Description: HTTPS traffic
      
      # Application Port (internal only)
      - IpProtocol: tcp
        FromPort: 5000
        ToPort: 5000
        SourceSecurityGroupId: !Ref LoadBalancerSecurityGroup
        Description: Backend API from load balancer
    
    SecurityGroupEgress:
      # Allow all outbound
      - IpProtocol: -1
        CidrIp: 0.0.0.0/0
        Description: All outbound traffic
```

## CORS Configuration

### Current Implementation

The backend uses a basic CORS configuration:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
```

### Production CORS Configuration

For production, **never use wildcard (`*`)**. Set explicit allowed origins:

**.env (Production)**
```bash
# Allowed origins (comma-separated, no spaces)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com,https://admin.yourdomain.com
```

### Advanced CORS Configuration

For more control, use a whitelist function:

```javascript
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in whitelist
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

## MongoDB Atlas Network Access

### Whitelist IP Addresses

1. **Development**: Your development machine IP
2. **Production Server**: EC2 instance public IP or NAT gateway IP
3. **CI/CD**: GitHub Actions IPs or build server IPs

### MongoDB Atlas IP Whitelist (Example)

```
# Development
192.168.1.100/32

# Production Servers
54.123.45.67/32
54.123.45.68/32

# Allow from anywhere (NOT RECOMMENDED for production)
0.0.0.0/0
```

### Best Practice

Use **Private Endpoints** or **VPC Peering** for production:
- AWS PrivateLink to MongoDB Atlas
- No public IP exposure
- Traffic stays within AWS network

## Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply to all routes
app.use('/api/', limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per 15 minutes
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

## SSL/TLS Configuration

### Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Testing Network Connectivity

### Test Backend Connectivity

```bash
# Test health endpoint
curl -I https://api.yourdomain.com/health

# Test API endpoint
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Test CORS
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://api.yourdomain.com/api/properties
```

### Test MongoDB Connectivity

```bash
# From backend server
mongo "mongodb+srv://cluster.mongodb.net/rental-management" --username your-user

# Or use mongosh
mongosh "mongodb+srv://cluster.mongodb.net/rental-management" --username your-user
```

### Test Firewall Rules

```bash
# Check if port is open
telnet api.yourdomain.com 443

# Or use nc
nc -zv api.yourdomain.com 443

# Check UFW status
sudo ufw status numbered

# Test from specific IP
curl --interface YOUR_IP https://api.yourdomain.com/health
```

## Security Checklist

### Before Production Deployment

- [ ] Remove wildcard CORS (`*`)
- [ ] Set explicit CORS_ORIGIN in .env
- [ ] Configure UFW firewall rules
- [ ] Set up AWS Security Groups properly
- [ ] Whitelist MongoDB Atlas IPs
- [ ] Enable SSL/TLS (HTTPS only)
- [ ] Implement rate limiting
- [ ] Add security headers (Nginx)
- [ ] Restrict SSH access to admin IPs only
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable MongoDB authentication
- [ ] Set up VPC peering (optional but recommended)
- [ ] Configure DDoS protection (CloudFlare, AWS Shield)
- [ ] Set up monitoring and alerts
- [ ] Enable audit logging
- [ ] Regular security updates (`apt-get update`)

## Monitoring and Alerts

### CloudWatch Alarms (AWS)

```yaml
HighCPUAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: Alert when CPU exceeds 80%
    MetricName: CPUUtilization
    Namespace: AWS/EC2
    Statistic: Average
    Period: 300
    EvaluationPeriods: 2
    Threshold: 80
    ComparisonOperator: GreaterThanThreshold

SecurityGroupChangeAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: Alert on security group changes
    MetricName: SecurityGroupChange
    Namespace: AWS/CloudTrail
```

### Log Monitoring

```bash
# Monitor access logs
sudo tail -f /var/log/nginx/access.log

# Monitor error logs
sudo tail -f /var/log/nginx/error.log

# Monitor application logs
pm2 logs rental-api

# Check for failed login attempts
grep "Invalid email or password" /var/log/rental-api/error.log
```

## Incident Response

### Blocked IP Detection

```bash
# Check UFW logs
sudo grep -i "blocked" /var/log/ufw.log

# Check Nginx logs for 403/401
sudo grep "403\|401" /var/log/nginx/access.log
```

### Unblock IP (Emergency)

```bash
# UFW
sudo ufw delete deny from BLOCKED_IP

# AWS Security Group
aws ec2 revoke-security-group-ingress \
  --group-id sg-xxxxx \
  --ip-permissions IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=BLOCKED_IP/32}]
```

## Additional Resources

- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
