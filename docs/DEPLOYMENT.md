# Deployment Guide - Rental Property Management System

This guide covers deploying all three components of the rental property management system to production.

> **Security Note**: For comprehensive firewall rules, CORS configuration, and security best practices, see [SECURITY.md](SECURITY.md).

## Overview

- **Backend**: Node.js/Express API
- **Mobile App**: React Native app for iOS and Android
- **Web Dashboard**: React web application

## Prerequisites

- Domain name configured
- SSL certificates
- Cloud accounts (AWS, MongoDB Atlas, etc.)
- App Store and Google Play developer accounts (for mobile)
- Review [SECURITY.md](SECURITY.md) for firewall and network security configuration

---

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
cd backend
heroku create rental-management-api
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-production-secret
heroku config:set NODE_ENV=production
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

4. **Deploy**
```bash
git push heroku main
```

5. **Test Connectivity**
```bash
npm run test:connectivity
```

### Option 2: AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro or larger
   - **Configure security group** - See [SECURITY.md](SECURITY.md#firewall-rules) for detailed rules

2. **Connect and Setup**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

3. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/idebenco/Ebenco.git
cd Ebenco/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add production environment variables

# Start with PM2
pm2 start src/server.js --name rental-api
pm2 startup
pm2 save
```

4. **Configure Nginx**
```bash
sudo apt-get install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/rental-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/rental-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Database Setup (MongoDB Atlas)

1. **Create Cluster**
   - Sign up at mongodb.com/cloud/atlas
   - Create a free cluster
   - Select cloud provider and region

2. **Configure Network Access**
   - Add IP addresses (or 0.0.0.0/0 for all)

3. **Create Database User**
   - Username and password
   - Database admin privileges

4. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with actual password

5. **Update Backend Config**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-management?retryWrites=true&w=majority
```

---

## Mobile App Deployment

### iOS Deployment (App Store)

1. **Prerequisites**
   - Apple Developer account ($99/year)
   - macOS with Xcode

2. **Configure App**
```bash
cd mobile-app
```

Update `app.json`:
```json
{
  "expo": {
    "name": "Rental Management",
    "slug": "rental-management",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.rentalmanagement",
      "buildNumber": "1.0.0"
    }
  }
}
```

3. **Build with EAS**
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
```

4. **Submit to App Store**
```bash
eas submit --platform ios
```

Or manually:
- Download IPA from EAS
- Upload via Xcode or Transporter app
- Fill app information in App Store Connect
- Submit for review

### Android Deployment (Google Play)

1. **Prerequisites**
   - Google Play Developer account ($25 one-time)

2. **Configure App**

Update `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.rentalmanagement",
      "versionCode": 1
    }
  }
}
```

3. **Build APK/AAB**
```bash
eas build --platform android
```

4. **Submit to Google Play**
```bash
eas submit --platform android
```

Or manually:
- Download AAB from EAS
- Upload to Google Play Console
- Fill store listing information
- Submit for review

### Update Production API URL

Update `.env` before building:
```
API_URL=https://api.yourdomain.com/api
```

---

## Web Dashboard Deployment

### Option 1: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build and Deploy**
```bash
cd web-dashboard
npm run build
netlify deploy --prod
```

3. **Configure Environment Variables**
In Netlify dashboard:
- Site settings → Build & deploy → Environment
- Add `REACT_APP_API_URL=https://api.yourdomain.com/api`

4. **Custom Domain**
- Domain settings → Add custom domain
- Configure DNS records

### Option 2: AWS S3 + CloudFront

1. **Build Application**
```bash
cd web-dashboard
REACT_APP_API_URL=https://api.yourdomain.com/api npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://rental-dashboard
aws s3 sync build/ s3://rental-dashboard
```

3. **Configure Bucket for Static Hosting**
- Enable static website hosting
- Set index.html as index document
- Make bucket public or use CloudFront

4. **Create CloudFront Distribution**
- Origin: S3 bucket
- Viewer protocol: Redirect HTTP to HTTPS
- Custom SSL certificate
- Default root object: index.html

5. **Configure Custom Domain**
- Add CNAME record pointing to CloudFront
- Request SSL certificate in ACM

### Option 3: Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd web-dashboard
vercel
```

3. **Set Environment Variables**
```bash
vercel env add REACT_APP_API_URL production
```

---

## Post-Deployment Checklist

### Backend
- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] CORS origins updated for production domains
- [ ] API rate limiting configured
- [ ] Error monitoring setup (Sentry, etc.)
- [ ] Database backups scheduled
- [ ] Health check endpoint responding

### Mobile App
- [ ] Production API URL configured
- [ ] App icons and splash screens set
- [ ] Privacy policy and terms of service linked
- [ ] App store listings complete
- [ ] Screenshot and preview videos uploaded
- [ ] Test builds verified
- [ ] Push notification setup (if applicable)

### Web Dashboard
- [ ] Production build created
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Asset optimization verified
- [ ] SEO meta tags configured
- [ ] Analytics tracking added (Google Analytics, etc.)

### Security
- [ ] All secrets rotated for production
- [ ] API keys secured
- [ ] Database access restricted
- [ ] Firewall rules configured
- [ ] Regular security audits scheduled

### Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring setup
- [ ] Log aggregation configured
- [ ] Alerting rules defined

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "rental-management-api"
          heroku_email: "your-email@example.com"
          appdir: "backend"
```

---

## Maintenance

### Backup Strategy
- Database: Daily automated backups
- Files: S3 versioning enabled
- Configuration: Version controlled

### Update Process
1. Test changes in staging environment
2. Create database backup
3. Deploy during low-traffic hours
4. Monitor error rates
5. Rollback if issues detected

### Monitoring
- Set up alerts for:
  - Server downtime
  - High error rates
  - Database issues
  - API response time
  - Storage usage

---

## Support and Troubleshooting

### Common Issues

**Backend not starting**
- Check environment variables
- Verify database connection
- Check port availability
- Review logs

**Mobile app can't connect**
- Verify API URL is correct
- Check CORS settings
- Confirm SSL certificate valid
- Test API with curl/Postman

**Web dashboard blank page**
- Check browser console for errors
- Verify build process completed
- Check API URL configuration
- Clear browser cache

---

## Scaling Considerations

### Backend Scaling
- Use load balancer (AWS ALB, Nginx)
- Enable horizontal scaling
- Implement caching (Redis)
- Database read replicas
- CDN for static assets

### Database Scaling
- Connection pooling
- Database indexing
- Query optimization
- Sharding for large datasets

### Cost Optimization
- Right-size server instances
- Use reserved instances
- Implement auto-scaling
- Optimize database queries
- Compress assets
- Use CDN effectively

---

## Documentation Resources

- [Backend API Documentation](../backend/README.md)
- [Mobile App Documentation](../mobile-app/README.md)
- [Web Dashboard Documentation](../web-dashboard/README.md)
- [Architecture Overview](ARCHITECTURE.md)
