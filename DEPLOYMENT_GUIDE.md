# SmallScale Wholesale Foodstuffs - Deployment Guide

## Quick Deployment Options

### Option 1: Static Hosting (Frontend Only - Quick Start)

The website can be deployed immediately to static hosting platforms. This gives you a working website quickly, but forms and shopping cart won't work until backend is added.

#### A. GitHub Pages (Free)
```bash
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch: main
4. Select folder: / (root)
5. Click Save
6. Website will be live at: https://yourusername.github.io/repository-name
```

#### B. Netlify (Free)
```bash
1. Sign up at netlify.com
2. Click "New site from Git"
3. Connect your GitHub repository
4. Build settings: Leave empty (static site)
5. Click "Deploy site"
6. Website live in 2 minutes
```

#### C. Vercel (Free)
```bash
1. Sign up at vercel.com
2. Click "New Project"
3. Import from GitHub
4. Leave build settings empty
5. Click "Deploy"
6. Live in 2 minutes
```

#### D. Cloudflare Pages (Free)
```bash
1. Sign up at pages.cloudflare.com
2. Connect Git repository
3. Build command: (leave empty)
4. Output directory: (leave empty)
5. Deploy
```

**Note**: With static hosting, you'll need to add backend later for:
- Form submissions
- User authentication
- Shopping cart
- Payment processing
- Admin dashboard

---

### Option 2: Nigerian Web Hosting (Full Website)

For a complete website with backend, use Nigerian hosting providers.

#### Recommended Hosts
1. **Whogohost** - whogohost.com (₦30,000-80,000/year)
2. **Qservers** - qservers.net (₦25,000-70,000/year)
3. **Web4Africa** - web4africa.com (₦20,000-60,000/year)

#### Steps for Nigerian Hosting
```
1. Sign up and purchase hosting plan
   - Choose: VPS or Cloud Server (not shared)
   - Minimum: 2GB RAM, 50GB Storage
   
2. Get domain name
   - Register .com.ng or .ng domain
   - Cost: ₦5,000-10,000/year
   
3. Upload website files
   - Via FTP/SFTP or cPanel File Manager
   - Upload all files to public_html/ folder
   
4. Install SSL certificate
   - Use Let's Encrypt (free)
   - Or purchase from host (₦15,000/year)
   
5. Configure database
   - Create MySQL database
   - Import database structure
   - Update connection strings
   
6. Install backend
   - PHP: Already on most servers
   - Node.js: Request installation
   - Python: May need VPS
   
7. Test website
   - Check all pages load
   - Test forms
   - Verify SSL works
```

---

### Option 3: Cloud Hosting (Scalable)

For professional deployment with full control.

#### A. DigitalOcean (Lagos Datacenter)

**Cost**: $12-24/month (₦15,000-30,000)

```bash
# 1. Create Droplet (Ubuntu 22.04)
# 2. Connect via SSH
ssh root@your_server_ip

# 3. Install LAMP Stack
sudo apt update
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql

# 4. Install Node.js (if using Node backend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Upload website
# Use SFTP or Git
git clone https://github.com/yourusername/your-repo.git
cd your-repo
sudo cp -r * /var/www/html/

# 6. Install SSL
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d yourwebsite.com -d www.yourwebsite.com

# 7. Configure Apache
sudo nano /etc/apache2/sites-available/000-default.conf
# Add your configuration

# 8. Restart Apache
sudo systemctl restart apache2
```

#### B. AWS Lightsail (Simple)

**Cost**: $5-20/month (₦6,000-25,000)

```
1. Create Lightsail instance
2. Choose OS & Apps: Ubuntu with LAMP
3. Choose instance plan: $5 or $10
4. Create instance
5. Upload files via SFTP
6. Configure as above
```

---

## File Upload Methods

### Method 1: FTP/SFTP (Most Common)

```
1. Download FileZilla (filezilla-project.org)
2. Get FTP details from your host:
   - Host: ftp.yourwebsite.com
   - Username: your_username
   - Password: your_password
   - Port: 21 (FTP) or 22 (SFTP)
3. Connect
4. Navigate to public_html/ or www/
5. Upload all files
```

### Method 2: cPanel File Manager

```
1. Login to cPanel
2. Click "File Manager"
3. Navigate to public_html/
4. Click "Upload"
5. Select all files
6. Wait for upload to complete
```

### Method 3: Git (Recommended for developers)

```bash
# On server
cd /var/www/html
git clone https://github.com/yourusername/smallscale.git .
git pull  # To update later
```

---

## Backend Setup

### PHP + Laravel Backend

```bash
# 1. Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# 2. Install Laravel
composer create-project laravel/laravel backend
cd backend

# 3. Configure .env
cp .env.example .env
nano .env
# Set database credentials

# 4. Generate key
php artisan key:generate

# 5. Run migrations
php artisan migrate

# 6. Start server
php artisan serve --host=0.0.0.0 --port=8000
```

### Node.js + Express Backend

```bash
# 1. Install dependencies
npm install express mysql2 bcrypt jsonwebtoken cors dotenv

# 2. Create server.js
nano server.js
# Add your Express code

# 3. Install PM2 (process manager)
npm install -g pm2

# 4. Start server
pm2 start server.js --name "smallscale-api"
pm2 startup
pm2 save

# 5. Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default
# Add proxy configuration
```

---

## Database Setup

### MySQL Database

```sql
-- 1. Login to MySQL
mysql -u root -p

-- 2. Create database
CREATE DATABASE smallscale_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Create user
CREATE USER 'smallscale_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- 4. Grant privileges
GRANT ALL PRIVILEGES ON smallscale_db.* TO 'smallscale_user'@'localhost';
FLUSH PRIVILEGES;

-- 5. Exit
EXIT;

-- 6. Import structure (if you have SQL file)
mysql -u smallscale_user -p smallscale_db < database.sql
```

---

## SSL Certificate Setup

### Free SSL (Let's Encrypt)

```bash
# 1. Install Certbot
sudo apt install certbot python3-certbot-apache

# 2. Get certificate
sudo certbot --apache -d yourwebsite.com -d www.yourwebsite.com

# 3. Test renewal
sudo certbot renew --dry-run

# 4. Auto-renewal (already set up by Certbot)
# Certificate will auto-renew every 90 days
```

### Paid SSL (Optional)

```
1. Purchase from your hosting provider
2. Generate CSR (Certificate Signing Request)
3. Submit to SSL provider
4. Download certificate files
5. Install via cPanel or manually
```

---

## Domain Configuration

### DNS Settings

Point your domain to your server:

```
A Record:
- Name: @ (or leave empty)
- Type: A
- Value: Your_Server_IP
- TTL: 3600

A Record:
- Name: www
- Type: A
- Value: Your_Server_IP
- TTL: 3600

Optional (for email):
MX Record:
- Priority: 10
- Value: mail.yourwebsite.com
```

### Nameservers

If using Cloudflare or other CDN:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

---

## Payment Gateway Setup

### Paystack Integration

```javascript
// 1. Sign up at paystack.com
// 2. Get API keys (Test & Live)
// 3. Add to your backend

// Example integration
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

app.post('/api/payment/initialize', async (req, res) => {
    try {
        const { email, amount } = req.body;
        const response = await paystack.transaction.initialize({
            email,
            amount: amount * 100, // Convert to kobo
            callback_url: 'https://yourwebsite.com/payment/callback'
        });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Flutterwave Integration

```javascript
// 1. Sign up at flutterwave.com
// 2. Get API keys
// 3. Install SDK

npm install flutterwave-node-v3

// Example
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(PUBLIC_KEY, SECRET_KEY);
```

---

## Email & SMS Setup

### Email (SendGrid)

```javascript
// 1. Sign up at sendgrid.com
// 2. Get API key
// 3. Install SDK

npm install @sendgrid/mail

// Example
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'customer@email.com',
    from: 'no-reply@smallscale.com.ng',
    subject: 'Order Confirmation',
    html: '<strong>Thank you for your order!</strong>'
};

await sgMail.send(msg);
```

### SMS (Termii - Nigeria)

```javascript
// 1. Sign up at termii.com
// 2. Get API key
// 3. Send SMS

const axios = require('axios');

async function sendSMS(phone, message) {
    await axios.post('https://api.ng.termii.com/api/sms/send', {
        to: phone,
        from: "SmallScale",
        sms: message,
        type: "plain",
        api_key: process.env.TERMII_API_KEY,
        channel: "generic"
    });
}
```

---

## Performance Optimization

### Apache Configuration

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Enable caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Nginx Configuration

```nginx
# Gzip compression
gzip on;
gzip_types text/css application/javascript image/svg+xml;
gzip_min_length 256;

# Caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Security Hardening

### 1. File Permissions

```bash
# Set correct permissions
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

# Protect sensitive files
chmod 600 .env
chmod 600 config/database.php
```

### 2. Firewall (UFW)

```bash
# Enable firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# Check status
sudo ufw status
```

### 3. Fail2Ban (Prevent brute force)

```bash
# Install
sudo apt install fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Start
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

---

## Backup Strategy

### Automated Backups

```bash
#!/bin/bash
# backup.sh

# Variables
BACKUP_DIR="/backup"
WEBSITE_DIR="/var/www/html"
DB_NAME="smallscale_db"
DB_USER="smallscale_user"
DB_PASS="your_password"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz $WEBSITE_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/database_$DATE.sql

# Delete old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# Upload to cloud (optional)
# rclone copy $BACKUP_DIR remote:backups/
```

### Cron Job (Run daily at 2 AM)

```bash
# Edit crontab
crontab -e

# Add line:
0 2 * * * /path/to/backup.sh
```

---

## Monitoring

### Uptime Monitoring

Use **UptimeRobot** (free):
1. Sign up at uptimerobot.com
2. Add monitor
3. Enter website URL
4. Set check interval: 5 minutes
5. Add alert contacts (email/SMS)

### Error Logging

```bash
# Apache logs
tail -f /var/log/apache2/error.log

# Application logs
tail -f /var/www/html/storage/logs/laravel.log
```

---

## Testing After Deployment

### Checklist

```
✓ Homepage loads correctly
✓ All pages accessible
✓ SSL certificate working (HTTPS)
✓ Contact form submits
✓ Quote form submits
✓ Login works
✓ Shopping cart works
✓ Payment gateway works
✓ Mobile responsive
✓ Images load properly
✓ Email notifications send
✓ SMS notifications send
✓ Admin dashboard accessible
✓ WhatsApp links work
✓ Phone links work
✓ Google Analytics tracking
```

### Tools

- **GTmetrix**: gtmetrix.com (Performance)
- **PageSpeed Insights**: pagespeed.web.dev (Google)
- **SSL Test**: ssllabs.com/ssltest/ (Security)
- **Mobile Test**: search.google.com/test/mobile-friendly

---

## Troubleshooting

### Common Issues

**1. 500 Internal Server Error**
```bash
# Check error logs
tail -f /var/log/apache2/error.log

# Check file permissions
ls -la /var/www/html

# Check .htaccess file
nano /var/www/html/.htaccess
```

**2. Database Connection Failed**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
nano .env

# Test connection
mysql -u smallscale_user -p smallscale_db
```

**3. SSL Not Working**
```bash
# Renew certificate
sudo certbot renew

# Restart Apache
sudo systemctl restart apache2

# Check certificate
sudo certbot certificates
```

**4. Forms Not Submitting**
```bash
# Check backend logs
tail -f /var/log/apache2/error.log

# Check JavaScript console
# Open browser DevTools → Console tab

# Verify CORS settings
# Add to backend: Access-Control-Allow-Origin: *
```

---

## Support Contacts

### Hosting
- Whogohost: support@whogohost.com, +234 700 WHOGOHOST
- Qservers: support@qservers.net, +234 1 270 1323

### Payment Gateways
- Paystack: hello@paystack.com, support.paystack.com
- Flutterwave: hi@flutterwavego.com, +234 1 888 9890

### SMS
- Termii: hello@termii.com, support.termii.com

### Email
- SendGrid: support@sendgrid.com, support.sendgrid.com

---

## Quick Commands Reference

```bash
# Restart web server
sudo systemctl restart apache2
sudo systemctl restart nginx

# Check server status
sudo systemctl status apache2
top
df -h

# View logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log

# Database backup
mysqldump -u user -p database > backup.sql

# Database restore
mysql -u user -p database < backup.sql

# Update website from Git
cd /var/www/html
git pull

# Clear cache (Laravel)
php artisan cache:clear
php artisan config:clear

# PM2 commands (Node.js)
pm2 list
pm2 restart app
pm2 logs
```

---

## Final Notes

1. **Test everything** before announcing launch
2. **Have backup plan** ready
3. **Monitor closely** first few days
4. **Keep backups** always
5. **Update regularly** for security
6. **Document changes** you make
7. **Get SSL certificate** immediately
8. **Set up monitoring** from day one

## Need Help?

- Check documentation files in repository
- Review PRODUCTION_CHECKLIST.md
- Contact your hosting provider support
- Hire a developer if needed

---

**Last Updated**: January 2026
**Version**: 1.0
