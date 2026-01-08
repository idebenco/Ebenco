# SmallScale Wholesale Website - Complete Deployment & Administration Guide

**For Business Owners | Step-by-Step Production Deployment**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Domain Setup](#domain-setup)
4. [Hosting Setup](#hosting-setup)
5. [Backend Deployment](#backend-deployment)
6. [Database Setup](#database-setup)
7. [SSL/HTTPS Configuration](#ssl-https-configuration)
8. [Admin Dashboard Setup](#admin-dashboard-setup)
9. [First Admin Account](#first-admin-account)
10. [Customer Access Flow](#customer-access-flow)
11. [Admin Access Flow](#admin-access-flow)
12. [Post-Launch Management](#post-launch-management)
13. [Updating Website](#updating-website)
14. [Security Best Practices](#security-best-practices)
15. [Troubleshooting](#troubleshooting)

---

## Overview

This guide will help you deploy your SmallScale wholesale website so that:

✅ **Customers** can access it at **www.SmallScalePS.com**  
✅ **You** can manage it securely via admin dashboard  
✅ Website runs **24/7** with SSL security  
✅ **Scalable** to handle growth  
✅ **Easy** for you to manage products, customers, and content

**Deployment Architecture:**
```
Customer Flow:
www.SmallScalePS.com → Cloudflare (CDN/SSL) → Web Server → Website

Admin Flow:
www.SmallScalePS.com/admin → 2FA Login → Admin Dashboard → Backend API → Database
```

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

**Required Items:**
- [ ] Domain name decided (e.g., SmallScalePS.com)
- [ ] Hosting provider selected (recommendations below)
- [ ] 12 product images ready
- [ ] Logo and favicon ready
- [ ] Business documents (CAC certificate for verification)
- [ ] Bank account details for payments
- [ ] Email account for notifications

**Technical Requirements:**
- [ ] Backend code developed (Laravel/Node.js/Django)
- [ ] Database schema ready
- [ ] API endpoints tested
- [ ] Payment gateway account (Paystack)
- [ ] Email service account (SendGrid)
- [ ] SMS service account (Termii)

**Budget Required:**
- Domain registration: ₦5,000-10,000/year
- Hosting: ₦30,000-100,000/year (depending on option)
- SSL certificate: FREE (Let's Encrypt)
- Developer (if needed): ₦500,000-1,500,000

---

## Domain Setup

### Step 1: Register Domain Name

**Recommended Registrars for Nigeria:**
1. **Whogohost** (whogohost.ng) - Nigerian company
2. **Web4Africa** (web4africa.com) - African focus
3. **Namecheap** (namecheap.com) - International
4. **GoDaddy** (godaddy.com) - Popular globally

**Domain Options:**
- **Primary:** SmallScalePS.com (₦5,000-8,000/year)
- **Alternative:** SmallScalePS.com.ng (₦3,000-5,000/year)
- **Alternative:** SmallScaleWholesale.com (₦5,000-8,000/year)

**How to Register (Example: Whogohost):**

1. **Visit Whogohost:** Go to whogohost.ng
2. **Search Domain:** Enter "SmallScalePS.com" in search
3. **Check Availability:** 
   - ✅ Available → Add to cart
   - ❌ Taken → Try alternative names
4. **Add to Cart:** Select 1 year or 2 years
5. **Create Account:** Register with your email
6. **Make Payment:** Bank transfer or card (₦5,000-10,000)
7. **Confirmation:** You'll receive domain login details via email

**Important:** Keep your domain login credentials safe. You'll need them for DNS configuration.

### Step 2: DNS Configuration

**What is DNS?**
DNS (Domain Name System) connects your domain name (SmallScalePS.com) to your hosting server's IP address.

**How to Configure DNS:**

**Option A: Using Cloudflare (Recommended - FREE + Fast)**

1. **Create Cloudflare Account:**
   - Go to cloudflare.com
   - Sign up with your email (FREE forever)

2. **Add Your Domain:**
   - Click "Add a site"
   - Enter "SmallScalePS.com"
   - Select FREE plan

3. **Get Cloudflare Nameservers:**
   - Cloudflare will show you 2 nameservers:
     ```
     abel.ns.cloudflare.com
     lisa.ns.cloudflare.com
     ```

4. **Update Domain Nameservers:**
   - Login to Whogohost (or your registrar)
   - Find "Domain Management" or "DNS Settings"
   - Replace existing nameservers with Cloudflare's
   - Save changes

5. **Wait for Propagation:**
   - Takes 4-24 hours
   - Check status in Cloudflare dashboard

6. **Add DNS Records in Cloudflare:**
   ```
   A Record:
   Name: @
   Content: YOUR_SERVER_IP (e.g., 159.89.123.456)
   TTL: Auto
   Proxy: Enabled (orange cloud)

   A Record:
   Name: www
   Content: YOUR_SERVER_IP
   TTL: Auto
   Proxy: Enabled

   CNAME Record:
   Name: admin
   Content: SmallScalePS.com
   TTL: Auto
   Proxy: Enabled
   ```

**Option B: Direct DNS (Without Cloudflare)**

If using your registrar's DNS:
1. Login to domain registrar
2. Find "DNS Management"
3. Add A Records:
   - Type: A
   - Host: @ (for SmallScalePS.com)
   - Points to: YOUR_SERVER_IP
   - TTL: 3600

   - Type: A
   - Host: www
   - Points to: YOUR_SERVER_IP
   - TTL: 3600

**How to Get Your Server IP:**
- You'll get this from your hosting provider after server setup
- Example: 159.89.123.456

---

## Hosting Setup

### Recommended Hosting Options for Nigeria

**Option 1: Whogohost (Best for Nigerian Business)**

**Pros:**
- Nigerian company (fast support)
- Naira payment
- Good uptime
- cPanel included
- Free SSL
- 24/7 support

**Plans:**
- **Basic:** ₦35,000/year (1 website, 10GB storage)
- **Business:** ₦50,000/year (5 websites, 50GB storage) ✅ Recommended
- **Pro:** ₦80,000/year (unlimited websites, 100GB storage)

**How to Setup:**

1. **Visit Whogohost:** Go to whogohost.ng
2. **Choose Plan:** Select "Business Hosting" (₦50,000/year)
3. **Enter Domain:** Input SmallScalePS.com
4. **Create Account:** Register with your details
5. **Make Payment:** Bank transfer or card
6. **Access cPanel:**
   - You'll receive cPanel login via email
   - URL: https://cpanel.whogohost.ng
   - Username: (provided in email)
   - Password: (set during registration)

**Option 2: DigitalOcean (Best for Scalability)**

**Pros:**
- Fast servers
- Full control
- Scalable
- Global data centers
- Professional

**Cons:**
- Requires technical knowledge
- Dollar pricing
- Self-managed

**Plans:**
- **Basic Droplet:** $12/month (~₦20,000) - 1GB RAM, 25GB SSD
- **Standard:** $24/month (~₦40,000) - 2GB RAM, 50GB SSD ✅ Recommended
- **Performance:** $48/month (~₦80,000) - 4GB RAM, 80GB SSD

**How to Setup:**

1. **Create Account:** Go to digitalocean.com
2. **Add Payment:** Credit card or PayPal
3. **Create Droplet:**
   - Click "Create" → "Droplets"
   - Choose: Ubuntu 22.04 LTS
   - Plan: $24/month (2GB RAM)
   - Data center: Frankfurt or Amsterdam (closest to Nigeria)
   - Authentication: SSH Key (more secure) or Password
   - Hostname: smallscale-production
4. **Get Server IP:** Note the IP address (e.g., 159.89.123.456)
5. **Initial Server Setup:** See below

**Option 3: VPS (Virtual Private Server) Comparison**

| Provider | Price/Month | RAM | Storage | Best For |
|----------|-------------|-----|---------|----------|
| Whogohost VPS | ₦20,000 | 2GB | 50GB | Nigerian businesses |
| Qservers | ₦25,000 | 2GB | 60GB | Local support |
| DigitalOcean | ₦40,000 | 2GB | 50GB | Scalability |
| Linode | ₦40,000 | 2GB | 50GB | Performance |

---

## Backend Deployment

### Step 1: Server Initial Setup (DigitalOcean Example)

**Connect to Server via SSH:**

```bash
# From your computer (Mac/Linux) or use PuTTY (Windows)
ssh root@YOUR_SERVER_IP

# Example:
ssh root@159.89.123.456

# Enter password when prompted
```

**Update Server:**

```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essentials
sudo apt install -y curl wget git unzip
```

**Create Non-Root User:**

```bash
# Create user
adduser smallscale

# Add to sudo group
usermod -aG sudo smallscale

# Switch to new user
su - smallscale
```

### Step 2: Install Web Server Stack

**Option A: Install LAMP Stack (Linux + Apache + MySQL + PHP)**

**For Laravel Backend:**

```bash
# Install Apache
sudo apt install apache2 -y

# Enable Apache
sudo systemctl start apache2
sudo systemctl enable apache2

# Install MySQL
sudo apt install mysql-server -y

# Secure MySQL
sudo mysql_secure_installation
# Answer: Y to all questions
# Set root password: STRONG_PASSWORD_HERE

# Install PHP 8.2
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-cli php8.2-common php8.2-curl php8.2-mbstring php8.2-xml php8.2-zip php8.2-gd -y

# Install Composer (PHP package manager)
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Verify installation
php -v
composer -V
mysql --version
```

**Option B: Install LEMP Stack (Linux + Nginx + MySQL + PHP)**

```bash
# Install Nginx
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install MySQL (same as above)
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PHP-FPM
sudo apt install php8.2-fpm php8.2-mysql php8.2-cli php8.2-common php8.2-curl php8.2-mbstring php8.2-xml php8.2-zip php8.2-gd -y
```

### Step 3: Deploy Laravel Backend

**Clone Your Backend Code:**

```bash
# Create web directory
sudo mkdir -p /var/www/smallscale

# Set ownership
sudo chown -R $USER:$USER /var/www/smallscale

# Clone from Git (if using Git)
cd /var/www
git clone YOUR_GIT_REPOSITORY smallscale

# Or upload via SFTP
# Use FileZilla or WinSCP to upload files to /var/www/smallscale
```

**Install Dependencies:**

```bash
# Navigate to project
cd /var/www/smallscale

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
sudo chown -R www-data:www-data /var/www/smallscale
sudo chmod -R 755 /var/www/smallscale
sudo chmod -R 775 /var/www/smallscale/storage
sudo chmod -R 775 /var/www/smallscale/bootstrap/cache
```

**Configure Environment:**

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Environment Variables (.env):**

```env
APP_NAME="SmallScale Wholesale"
APP_ENV=production
APP_KEY=base64:GENERATE_THIS_WITH_php_artisan_key:generate
APP_DEBUG=false
APP_URL=https://www.SmallScalePS.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smallscale_db
DB_USERNAME=smallscale_user
DB_PASSWORD=STRONG_DATABASE_PASSWORD_HERE

MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=YOUR_SENDGRID_API_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@SmallScalePS.com
MAIL_FROM_NAME="SmallScale Wholesale"

PAYSTACK_PUBLIC_KEY=pk_live_YOUR_PAYSTACK_PUBLIC_KEY
PAYSTACK_SECRET_KEY=sk_live_YOUR_PAYSTACK_SECRET_KEY

TERMII_API_KEY=YOUR_TERMII_API_KEY
TERMII_SENDER_ID=SmallScale

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_DRIVER=file
QUEUE_CONNECTION=database
```

**Generate Application Key:**

```bash
php artisan key:generate
```

**Configure Apache VirtualHost:**

```bash
# Create VirtualHost file
sudo nano /etc/apache2/sites-available/smallscale.conf
```

**VirtualHost Configuration:**

```apache
<VirtualHost *:80>
    ServerName SmallScalePS.com
    ServerAlias www.SmallScalePS.com
    ServerAdmin admin@SmallScalePS.com
    
    DocumentRoot /var/www/smallscale/public
    
    <Directory /var/www/smallscale/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/smallscale-error.log
    CustomLog ${APACHE_LOG_DIR}/smallscale-access.log combined
</VirtualHost>
```

**Enable Site:**

```bash
# Enable rewrite module
sudo a2enmod rewrite

# Enable site
sudo a2ensite smallscale.conf

# Disable default site
sudo a2dissite 000-default.conf

# Test configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

---

## Database Setup

### Step 1: Create Database

**Login to MySQL:**

```bash
sudo mysql -u root -p
# Enter the root password you set during installation
```

**Create Database and User:**

```sql
-- Create database
CREATE DATABASE smallscale_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create database user
CREATE USER 'smallscale_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

-- Grant privileges
GRANT ALL PRIVILEGES ON smallscale_db.* TO 'smallscale_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 2: Run Migrations

**Migrate Database Tables:**

```bash
# Navigate to project
cd /var/www/smallscale

# Run migrations
php artisan migrate --force

# Seed database with initial data (optional)
php artisan db:seed --force
```

### Step 3: Backup Configuration

**Setup Automated Backups:**

```bash
# Create backup script
sudo nano /usr/local/bin/backup-database.sh
```

**Backup Script:**

```bash
#!/bin/bash

# Configuration
DB_NAME="smallscale_db"
DB_USER="smallscale_user"
DB_PASS="YOUR_DATABASE_PASSWORD"
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/smallscale_${DATE}.sql.gz

# Delete backups older than 30 days
find $BACKUP_DIR -name "smallscale_*.sql.gz" -mtime +30 -delete

echo "Backup completed: smallscale_${DATE}.sql.gz"
```

**Make Script Executable:**

```bash
sudo chmod +x /usr/local/bin/backup-database.sh
```

**Schedule Daily Backups (Cron):**

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/backup-database.sh
```

---

## SSL/HTTPS Configuration

### Step 1: Install Certbot (Let's Encrypt)

**Install Certbot:**

```bash
# Install snapd (if not already installed)
sudo apt install snapd -y

# Install Certbot
sudo snap install --classic certbot

# Create symbolic link
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### Step 2: Obtain SSL Certificate

**Generate Certificate:**

```bash
# Stop Apache temporarily
sudo systemctl stop apache2

# Obtain certificate
sudo certbot certonly --standalone -d SmallScalePS.com -d www.SmallScalePS.com

# You'll be asked:
# - Email address (for renewal notifications)
# - Agree to terms (Y)
# - Share email with EFF (your choice)

# Start Apache
sudo systemctl start apache2
```

**Certificate Files Location:**
```
Certificate: /etc/letsencrypt/live/SmallScalePS.com/fullchain.pem
Private Key: /etc/letsencrypt/live/SmallScalePS.com/privkey.pem
```

### Step 3: Configure Apache for HTTPS

**Update VirtualHost:**

```bash
sudo nano /etc/apache2/sites-available/smallscale-ssl.conf
```

**SSL VirtualHost Configuration:**

```apache
<VirtualHost *:443>
    ServerName SmallScalePS.com
    ServerAlias www.SmallScalePS.com
    ServerAdmin admin@SmallScalePS.com
    
    DocumentRoot /var/www/smallscale/public
    
    <Directory /var/www/smallscale/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/SmallScalePS.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/SmallScalePS.com/privkey.pem
    
    # Security Headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    
    ErrorLog ${APACHE_LOG_DIR}/smallscale-ssl-error.log
    CustomLog ${APACHE_LOG_DIR}/smallscale-ssl-access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName SmallScalePS.com
    ServerAlias www.SmallScalePS.com
    
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>
```

**Enable SSL Site:**

```bash
# Enable SSL module
sudo a2enmod ssl
sudo a2enmod headers

# Enable SSL site
sudo a2ensite smallscale-ssl.conf

# Test configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

### Step 4: Auto-Renewal Setup

**Test Renewal:**

```bash
sudo certbot renew --dry-run
```

**Certbot Auto-Renewal:**
Certbot automatically sets up renewal. Check with:
```bash
sudo systemctl status certbot.timer
```

---

## Admin Dashboard Setup

### Step 1: Admin Route Protection

**Laravel Route Configuration (routes/web.php):**

```php
<?php

// Public routes
Route::get('/', 'HomeController@index');
Route::get('/products', 'ProductController@index');
Route::get('/about', 'PageController@about');
Route::get('/contact', 'PageController@contact');
Route::get('/faq', 'PageController@faq');
Route::get('/pricing', 'PageController@pricing');

// Customer routes
Route::prefix('customer')->group(function () {
    Route::get('/login', 'Auth\CustomerLoginController@showLoginForm')->name('customer.login');
    Route::post('/login', 'Auth\CustomerLoginController@login');
    Route::post('/register', 'Auth\CustomerRegisterController@register');
    
    Route::middleware('auth:customer')->group(function () {
        Route::get('/dashboard', 'Customer\DashboardController@index')->name('customer.dashboard');
        Route::get('/orders', 'Customer\OrderController@index');
        Route::post('/logout', 'Auth\CustomerLoginController@logout');
    });
});

// Admin routes (protected)
Route::prefix('admin')->middleware(['auth:admin', 'verified', '2fa'])->group(function () {
    Route::get('/dashboard', 'Admin\DashboardController@index')->name('admin.dashboard');
    
    // Products
    Route::resource('products', 'Admin\ProductController');
    Route::post('products/bulk-action', 'Admin\ProductController@bulkAction');
    
    // Orders
    Route::resource('orders', 'Admin\OrderController');
    Route::post('orders/{order}/status', 'Admin\OrderController@updateStatus');
    
    // Customers
    Route::resource('customers', 'Admin\CustomerController');
    Route::post('customers/{customer}/approve', 'Admin\CustomerController@approve');
    Route::post('customers/{customer}/reject', 'Admin\CustomerController@reject');
    
    // Settings
    Route::get('settings', 'Admin\SettingController@index');
    Route::post('settings', 'Admin\SettingController@update');
});

// Admin authentication (no middleware)
Route::prefix('admin')->group(function () {
    Route::get('/login', 'Auth\AdminLoginController@showLoginForm')->name('admin.login');
    Route::post('/login', 'Auth\AdminLoginController@login');
    Route::post('/logout', 'Auth\AdminLoginController@logout')->name('admin.logout');
    
    // 2FA routes
    Route::get('/2fa', 'Auth\TwoFactorController@show')->name('admin.2fa');
    Route::post('/2fa/verify', 'Auth\TwoFactorController@verify');
});
```

### Step 2: Admin Middleware

**Create Admin Middleware:**

```bash
php artisan make:middleware AdminAuthenticate
```

**Middleware Code (app/Http/Middleware/AdminAuthenticate.php):**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class AdminAuthenticate
{
    public function handle($request, Closure $next)
    {
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login');
        }
        
        // Check if admin is active
        $admin = Auth::guard('admin')->user();
        if (!$admin->is_active) {
            Auth::guard('admin')->logout();
            return redirect()->route('admin.login')
                ->with('error', 'Your account has been deactivated.');
        }
        
        // Log admin activity
        activity()
            ->performedOn($admin)
            ->log('Accessed: ' . $request->path());
        
        return $next($request);
    }
}
```

**Register Middleware (app/Http/Kernel.php):**

```php
protected $routeMiddleware = [
    // ... existing middleware
    'auth.admin' => \App\Http\Middleware\AdminAuthenticate::class,
    '2fa' => \App\Http\Middleware\TwoFactorAuthenticate::class,
];
```

### Step 3: Admin Model & Migration

**Create Admin Migration:**

```bash
php artisan make:migration create_admins_table
```

**Migration Code (database/migrations/*_create_admins_table.php):**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->enum('role', ['super_admin', 'admin', 'manager', 'editor'])->default('admin');
            $table->boolean('is_active')->default(true);
            $table->boolean('2fa_enabled')->default(false);
            $table->string('2fa_secret')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip')->nullable();
            $table->integer('login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('admins');
    }
}
```

**Run Migration:**

```bash
php artisan migrate
```

---

## First Admin Account

### Method 1: Command Line (Recommended)

**Create Admin via Artisan Command:**

```bash
# Create custom artisan command
php artisan make:command CreateAdminUser
```

**Command Code (app/Console/Commands/CreateAdminUser.php):**

```php
<?php

namespace App\Console\Commands;

use App\Models\Admin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create';
    protected $description = 'Create a new admin user';

    public function handle()
    {
        $this->info('Creating new admin user...');
        
        $name = $this->ask('Admin name');
        $email = $this->ask('Admin email');
        $password = $this->secret('Password (min 8 characters)');
        $password_confirmation = $this->secret('Confirm password');
        
        // Validate
        if ($password !== $password_confirmation) {
            $this->error('Passwords do not match!');
            return 1;
        }
        
        if (strlen($password) < 8) {
            $this->error('Password must be at least 8 characters!');
            return 1;
        }
        
        // Check if email already exists
        if (Admin::where('email', $email)->exists()) {
            $this->error('Admin with this email already exists!');
            return 1;
        }
        
        // Create admin
        $admin = Admin::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'super_admin',
            'is_active' => true,
        ]);
        
        $this->info('Admin user created successfully!');
        $this->table(
            ['ID', 'Name', 'Email', 'Role'],
            [[$admin->id, $admin->name, $admin->email, $admin->role]]
        );
        
        return 0;
    }
}
```

**Create First Admin:**

```bash
# Run the command
php artisan admin:create

# Enter details when prompted:
# Name: Your Full Name
# Email: your@email.com
# Password: Strong_Password_123
# Confirm Password: Strong_Password_123
```

### Method 2: Database Seeder

**Create Admin Seeder:**

```bash
php artisan make:seeder AdminSeeder
```

**Seeder Code (database/seeders/AdminSeeder.php):**

```php
<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'name' => 'SmallScale Admin',
            'email' => 'admin@SmallScalePS.com',
            'password' => Hash::make('Change_This_Password_123'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);
    }
}
```

**Run Seeder:**

```bash
php artisan db:seed --class=AdminSeeder

# Or run all seeders
php artisan db:seed
```

**IMPORTANT:** Change the default password immediately after first login!

### Method 3: Direct Database Insert

**Via MySQL Command Line:**

```bash
# Login to MySQL
sudo mysql -u root -p

# Use database
USE smallscale_db;

# Insert admin user
INSERT INTO admins (name, email, password, role, is_active, created_at, updated_at)
VALUES (
    'SmallScale Admin',
    'admin@SmallScalePS.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: "password"
    'super_admin',
    1,
    NOW(),
    NOW()
);

# Exit
EXIT;
```

**SECURITY WARNING:** The password above is "password" - **Change it immediately!**

---

## Customer Access Flow

### How Customers Access Your Website

**Step-by-Step Customer Journey:**

**1. Customer Visits Website:**
```
Customer types: www.SmallScalePS.com
↓
Cloudflare (CDN) - Fast loading
↓
Your Web Server
↓
Homepage displayed
```

**2. Customer Browses Products:**
```
Customer clicks "Products"
↓
www.SmallScalePS.com/products
↓
12 products displayed with prices
↓
Can add to cart (retail) or request quote (wholesale)
```

**3. Customer Registration (For Wholesale):**
```
Customer clicks "Create Account"
↓
www.SmallScalePS.com/customer/register
↓
Fills registration form (business details)
↓
Submits form
↓
Email sent: "Registration received, pending approval"
↓
Admin receives notification
↓
Admin approves/rejects
↓
Customer receives email: "Account approved" or "Rejected"
```

**4. Customer Login:**
```
Customer visits: www.SmallScalePS.com/customer/login
↓
Enters email and password
↓
Backend verifies credentials
↓
Session created
↓
Redirected to: www.SmallScalePS.com/customer/dashboard
```

**5. Customer Places Order:**
```
Logged-in customer adds products to cart
↓
Clicks "Checkout"
↓
www.SmallScalePS.com/customer/checkout
↓
Fills delivery details
↓
Chooses payment method (bank transfer/Paystack)
↓
Confirms order
↓
Order created in database
↓
Customer receives:
- Order confirmation email
- SMS notification
- WhatsApp message (if enabled)
↓
Order appears in customer dashboard
```

**Public Pages (No Login Required):**
- Homepage: www.SmallScalePS.com
- Products: www.SmallScalePS.com/products
- About: www.SmallScalePS.com/about
- Contact: www.SmallScalePS.com/contact
- FAQ: www.SmallScalePS.com/faq
- Pricing: www.SmallScalePS.com/pricing

**Protected Pages (Login Required):**
- Dashboard: www.SmallScalePS.com/customer/dashboard
- Orders: www.SmallScalePS.com/customer/orders
- Quotes: www.SmallScalePS.com/customer/quotes
- Profile: www.SmallScalePS.com/customer/profile

---

## Admin Access Flow

### How You Access Admin Dashboard

**Step-by-Step Admin Access:**

**1. Visit Admin Login Page:**
```
You type: www.SmallScalePS.com/admin
↓
Redirected to: www.SmallScalePS.com/admin/login
↓
Admin login page displayed
```

**2. Admin Login:**
```
Enter your admin email: admin@SmallScalePS.com
Enter your password: Your_Secure_Password
↓
Backend validates credentials
↓
Checks if account is active
↓
Checks login attempts (max 3)
↓
If correct: Proceed to 2FA
If incorrect: Show error (3 attempts max, then 1-hour lockout)
```

**3. Two-Factor Authentication (2FA):**
```
System sends SMS code to your phone: "Your code: 123456"
↓
Enter 6-digit code
↓
Backend verifies code
↓
If correct: Login successful
If incorrect: Try again (3 attempts max)
```

**4. Admin Dashboard Access:**
```
Login successful
↓
Session created (secure token)
↓
Redirected to: www.SmallScalePS.com/admin/dashboard
↓
Dashboard displayed with:
- Today's orders
- Total revenue
- Pending customer approvals
- Low stock alerts
- Quick actions
```

**5. Admin Navigation:**
```
From dashboard, you can access:

Products: /admin/products
- View all products
- Add new product
- Edit existing products
- Delete products
- Manage stock levels

Orders: /admin/orders
- View all orders
- Filter by status
- Update order status
- Print invoices
- Contact customers

Customers: /admin/customers
- View all customers
- Approve/reject registrations
- Assign customer tiers
- Block/unblock accounts
- View order history

Content: /admin/content
- Edit homepage
- Manage banners
- Update FAQs
- Edit about page

Settings: /admin/settings
- Business information
- Payment settings
- Email configuration
- SMS configuration
- Admin users
```

**Admin Security Features:**

**1. IP Whitelisting (Optional but Recommended):**
```
Only your IP address can access /admin
Configure in .env:
ADMIN_ALLOWED_IPS=your.ip.address,another.ip.address
```

**2. Session Timeout:**
```
Inactive for 30 minutes → Auto logout
Must login again
```

**3. Audit Logging:**
```
Every admin action is logged:
- Who did it
- What was done
- When it happened
- From which IP
```

**4. Role-Based Access:**
```
Super Admin: Full access to everything
Admin: Cannot manage other admins
Manager: Cannot delete products or customers
Editor: Can only edit content, view reports
```

---

## Post-Launch Management

### Managing Products

**Add New Product:**

1. **Login to Admin:**
   - Visit: www.SmallScalePS.com/admin
   - Enter credentials + 2FA code

2. **Navigate to Products:**
   - Click "Products" in sidebar
   - Click "Add New Product" button

3. **Fill Product Details:**
   ```
   Product Name: Premium Rice
   Category: Grains & Cereals
   SKU: RICE-001 (auto-generated)
   Description: High-quality long grain rice...
   
   Retail Price: ₦32,000
   Bulk Price: ₦28,000
   Bulk Threshold: 10 bags
   Minimum Order: 1 bag (50kg)
   
   Stock Level: 50 bags
   Unit: Bag
   
   Status: Active
   Featured: Yes
   ```

4. **Upload Product Image:**
   - Click "Upload Image"
   - Select image (max 2MB, JPG/PNG)
   - Image automatically resized and optimized

5. **Save Product:**
   - Click "Save Product"
   - Product appears on website immediately
   - Notification sent to subscribed customers (if enabled)

**Edit Existing Product:**

1. Go to Products page
2. Find product (use search or filters)
3. Click "Edit" button
4. Make changes
5. Click "Update Product"

**Update Stock Levels:**

1. Go to Products page
2. Find product
3. Click "Quick Edit" or "Edit"
4. Update "Stock Level" field
5. Save changes

**Bulk Actions:**

1. Select multiple products (checkboxes)
2. Choose action from dropdown:
   - Activate
   - Deactivate
   - Delete
   - Update category
3. Click "Apply"

### Managing Customers

**Approve New Customer:**

1. **Check Dashboard:**
   - Look for "Pending Approvals" widget
   - Shows number of customers waiting for approval

2. **View Customer Details:**
   - Click on customer name
   - Review business information:
     - Company name
     - CAC registration number
     - Tax ID
     - Business address
     - Contact details
     - Documents uploaded

3. **Verify Documents:**
   - View uploaded CAC certificate
   - Verify Tax ID
   - Check business legitimacy (optional: Google search)

4. **Assign Customer Tier:**
   - Starter Tier (10% discount, ₦50K min order)
   - Business Tier (20% discount, ₦200K min order)
   - Enterprise Tier (30% discount, ₦1M min order)

5. **Approve or Reject:**
   - **Approve:** Customer receives email + SMS, can now login
   - **Reject:** Customer receives email with reason

**Block/Unblock Customer:**

1. Go to Customers page
2. Find customer
3. Click "Block" or "Unblock"
4. Enter reason (optional)
5. Confirm action

**Upgrade Customer Tier:**

1. Go to customer profile
2. Click "Edit"
3. Change "Tier" dropdown
4. Save changes
5. Customer sees new prices immediately

### Managing Orders

**Process New Order:**

1. **Check Dashboard:**
   - "New Orders" widget shows pending orders
   - Click to view order details

2. **View Order Details:**
   ```
   Order #12345
   Customer: Chidi's Restaurant
   Date: Jan 8, 2026
   Status: Pending Payment
   
   Items:
   - Premium Rice (10 bags) @ ₦28,000 = ₦280,000
   - Vegetable Oil (5 containers) @ ₦16,000 = ₦80,000
   
   Subtotal: ₦360,000
   Delivery: ₦5,000
   Total: ₦365,000
   
   Payment Method: Bank Transfer
   Delivery Address: 123 Market Street, Lagos
   ```

3. **Verify Payment:**
   - Check bank account for transfer
   - Match amount to order total
   - Match reference number

4. **Update Order Status:**
   - Click "Update Status"
   - Select: "Payment Confirmed"
   - Customer receives SMS: "Payment confirmed"

5. **Process Order:**
   - Update status to "Processing"
   - Pick items from inventory
   - Update status to "Ready for Delivery"
   - Assign to delivery
   - Update status to "Dispatched" (enter tracking number)
   - Customer receives WhatsApp: "Order dispatched"

6. **Complete Order:**
   - After delivery, update to "Delivered"
   - Request customer review (automatic email sent)

**Print Invoice:**

1. Go to order details
2. Click "Print Invoice"
3. PDF generated with:
   - Company letterhead
   - Order details
   - Payment details
   - Customer details

**Contact Customer:**

From order page, you can:
- **Call:** Click phone number (opens phone dialer)
- **WhatsApp:** Click WhatsApp icon (opens WhatsApp chat)
- **Email:** Click "Send Email" (opens email form)

### Managing Content

**Edit Homepage:**

1. Login to admin
2. Go to Content → Homepage
3. Edit sections:
   - Hero headline and subheadline
   - Business introduction text
   - Key benefits (6 items)
   - Featured products selection
   - Statistics (orders, customers, satisfaction)

4. Click "Save Changes"
5. Homepage updated immediately

**Manage Banners:**

1. Go to Content → Banners
2. Click "Add New Banner"
3. Upload banner image (1920x600px recommended)
4. Set display schedule:
   - Start date
   - End date
5. Set display location:
   - Homepage
   - Products page
   - All pages
6. Save banner

**Update FAQs:**

1. Go to Content → FAQs
2. Click "Add New FAQ" or edit existing
3. Enter:
   - Question
   - Answer
   - Category (General, Products, Pricing, etc.)
4. Save changes

**Update Contact Information:**

1. Go to Settings → Business Information
2. Update:
   - Business name
   - Phone numbers
   - Email addresses
   - Physical address
   - Business hours
   - WhatsApp number
3. Save changes (updates across entire website)

---

## Updating Website

### How to Update Website Without Breaking It

**Safe Update Process:**

**1. Test Changes Locally First:**
```
Never make changes directly on live server
↓
Set up local development environment
↓
Make changes locally
↓
Test thoroughly
↓
Only then deploy to production
```

**2. Create Backup Before Updates:**
```bash
# Backup database
sudo /usr/local/bin/backup-database.sh

# Backup website files
cd /var/www
sudo tar -czf smallscale-backup-$(date +%Y%m%d).tar.gz smallscale/

# Move backup to safe location
sudo mv smallscale-backup-*.tar.gz /var/backups/
```

**3. Enable Maintenance Mode:**
```bash
# Put site in maintenance mode
cd /var/www/smallscale
php artisan down

# Visitors see: "We'll be back soon!"
```

**4. Pull Latest Changes:**
```bash
# If using Git
git pull origin main

# Or upload new files via SFTP
```

**5. Update Dependencies:**
```bash
# Update Composer packages
composer install --no-dev --optimize-autoloader

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

**6. Run Database Migrations:**
```bash
# Run any new migrations
php artisan migrate --force
```

**7. Rebuild Caches:**
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Optimize autoloader
composer dump-autoload --optimize
```

**8. Test in Maintenance Mode:**
```
Visit: www.SmallScalePS.com
↓
Should show maintenance page
↓
Test admin access (maintenance mode doesn't affect admin)
↓
Check all features work
```

**9. Disable Maintenance Mode:**
```bash
# Bring site back online
php artisan up
```

**10. Monitor After Update:**
```
Check error logs for issues:
tail -f /var/www/smallscale/storage/logs/laravel.log

Check Apache errors:
tail -f /var/log/apache2/smallscale-error.log
```

### Rolling Back Updates

**If Something Goes Wrong:**

**Option 1: Git Rollback:**
```bash
# Put in maintenance mode
php artisan down

# View commit history
git log --oneline

# Rollback to previous version
git checkout PREVIOUS_COMMIT_HASH

# Clear caches
php artisan cache:clear
php artisan config:clear

# Bring back online
php artisan up
```

**Option 2: Restore from Backup:**
```bash
# Put in maintenance mode
php artisan down

# Restore database
cd /var/backups/mysql
gunzip -c smallscale_YYYYMMDD_HHMMSS.sql.gz | mysql -u smallscale_user -p smallscale_db

# Restore files
cd /var/backups
tar -xzf smallscale-backup-YYYYMMDD.tar.gz -C /var/www/

# Fix permissions
sudo chown -R www-data:www-data /var/www/smallscale
sudo chmod -R 755 /var/www/smallscale

# Bring back online
cd /var/www/smallscale
php artisan up
```

### Updating Frontend Only (HTML/CSS/JS)

**For simple frontend changes:**

1. **Edit files via SFTP:**
   - Connect to server with FileZilla
   - Navigate to `/var/www/smallscale/resources/views`
   - Download file you want to edit
   - Edit locally
   - Upload back to server
   - Changes appear immediately (no restart needed)

2. **Clear browser cache:**
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Or add version parameter to CSS/JS files

**Example: Update Product Page:**
```
1. Download: /var/www/smallscale/resources/views/products.blade.php
2. Edit in text editor
3. Upload to same location
4. Visit www.SmallScalePS.com/products
5. Hard refresh (Ctrl+Shift+R)
```

---

## Security Best Practices

### Server Security

**1. Keep Software Updated:**
```bash
# Update system weekly
sudo apt update && sudo apt upgrade -y

# Update PHP/MySQL/Apache as needed
```

**2. Configure Firewall:**
```bash
# Install UFW (Uncomplicated Firewall)
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

**3. Install Fail2Ban (Prevent Brute Force):**
```bash
# Install
sudo apt install fail2ban -y

# Configure for Apache
sudo nano /etc/fail2ban/jail.local
```

**Fail2Ban Configuration:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[apache-auth]
enabled = true
port = http,https
logpath = /var/log/apache2/*error.log

[apache-badbots]
enabled = true
port = http,https
logpath = /var/log/apache2/*access.log
```

**Start Fail2Ban:**
```bash
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

**4. Disable Root Login:**
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Change this line:
PermitRootLogin no

# Restart SSH
sudo systemctl restart sshd
```

**5. Use SSH Keys Instead of Passwords:**
```bash
# On your computer, generate SSH key
ssh-keygen -t rsa -b 4096

# Copy public key to server
ssh-copy-id smallscale@YOUR_SERVER_IP

# Disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### Application Security

**1. Strong Admin Passwords:**
```
Minimum requirements:
- 12+ characters
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters (!@#$%^&*)
- Not a dictionary word
- Not related to business name

Example: Sm@llSc@le2026!SecureAdmin
```

**2. Enable 2FA for All Admins:**
```
Force all admin users to enable 2FA
Check this in admin user management
Resend 2FA setup if not completed
```

**3. Regular Security Audits:**
```bash
# Check for vulnerable packages
cd /var/www/smallscale
composer audit

# Update vulnerable packages
composer update
```

**4. Monitor Login Attempts:**
```bash
# View admin login logs
tail -n 100 /var/www/smallscale/storage/logs/laravel.log | grep "admin.login"

# Check for suspicious activity
# Multiple failed logins from same IP = potential attack
```

**5. Rate Limiting:**
```
Already configured in Laravel:
- Login: 5 attempts per minute
- API: 60 requests per minute
- Admin actions: Logged and monitored
```

**6. Database Security:**
```
✅ Use strong database password (not 'password')
✅ Database user has limited privileges (not root)
✅ Database only accessible from localhost
✅ Regular backups (daily at 2 AM)
✅ Backup files encrypted
```

**7. Environment Variables:**
```
✅ .env file not accessible via web
✅ Contains no default/weak passwords
✅ API keys rotated every 6 months
✅ Never committed to Git
```

### Backup Strategy

**Automated Backups:**

**1. Database Backups (Daily):**
```
Schedule: 2 AM daily
Retention: 30 days
Location: /var/backups/mysql/
```

**2. File Backups (Weekly):**
```bash
# Create weekly backup script
sudo nano /usr/local/bin/backup-files.sh
```

**Weekly Backup Script:**
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/files"
DATE=$(date +%Y%m%d)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup website files
cd /var/www
sudo tar -czf $BACKUP_DIR/smallscale-files-${DATE}.tar.gz smallscale/

# Delete backups older than 60 days
find $BACKUP_DIR -name "smallscale-files-*.tar.gz" -mtime +60 -delete

echo "File backup completed: smallscale-files-${DATE}.tar.gz"
```

**Make executable and schedule:**
```bash
sudo chmod +x /usr/local/bin/backup-files.sh

# Add to crontab (runs Sundays at 3 AM)
crontab -e
0 3 * * 0 /usr/local/bin/backup-files.sh
```

**3. Off-Site Backups (Monthly):**

Use cloud storage for disaster recovery:

**Option A: Dropbox/Google Drive**
```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Configure
rclone config
# Follow prompts to connect to Dropbox/Drive

# Sync backups monthly
rclone sync /var/backups dropbox:SmallScale-Backups
```

**Option B: AWS S3**
```bash
# Install AWS CLI
sudo apt install awscli -y

# Configure
aws configure
# Enter AWS Access Key ID
# Enter AWS Secret Access Key

# Upload backups
aws s3 sync /var/backups s3://smallscale-backups/
```

---

## Troubleshooting

### Common Issues & Solutions

**Problem 1: Website Not Loading**

**Symptoms:** "This site can't be reached" or "Connection timed out"

**Solutions:**
```bash
# Check if Apache is running
sudo systemctl status apache2

# If not running, start it
sudo systemctl start apache2

# Check if server is accessible
ping YOUR_SERVER_IP

# Check DNS
nslookup SmallScalePS.com

# Check firewall
sudo ufw status
# Ensure ports 80 and 443 are allowed
```

**Problem 2: SSL Certificate Not Working**

**Symptoms:** "Not Secure" or "SSL Error"

**Solutions:**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# If expired, obtain new one
sudo certbot certonly --standalone -d SmallScalePS.com -d www.SmallScalePS.com

# Restart Apache
sudo systemctl restart apache2
```

**Problem 3: Can't Login to Admin**

**Symptoms:** "Invalid credentials" even with correct password

**Solutions:**
```bash
# Reset admin password via command line
cd /var/www/smallscale
php artisan tinker

# In tinker console:
$admin = App\Models\Admin::where('email', 'admin@SmallScalePS.com')->first();
$admin->password = Hash::make('New_Password_123');
$admin->login_attempts = 0;
$admin->locked_until = null;
$admin->save();
exit;

# Try logging in again
```

**Problem 4: Images Not Uploading**

**Symptoms:** "Failed to upload image" or "File too large"

**Solutions:**
```bash
# Check upload directory permissions
sudo chmod -R 775 /var/www/smallscale/storage/app/public
sudo chown -R www-data:www-data /var/www/smallscale/storage

# Check PHP upload limits
sudo nano /etc/php/8.2/apache2/php.ini

# Update these values:
upload_max_filesize = 10M
post_max_size = 10M
max_file_uploads = 20

# Restart Apache
sudo systemctl restart apache2
```

**Problem 5: Database Connection Error**

**Symptoms:** "Could not connect to database" or "Access denied"

**Solutions:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Start if not running
sudo systemctl start mysql

# Verify database credentials in .env
nano /var/www/smallscale/.env

# Test database connection
cd /var/www/smallscale
php artisan tinker
DB::connection()->getPdo();
# Should show: PDO object (connection successful)
exit;
```

**Problem 6: Email Notifications Not Sending**

**Symptoms:** Customers not receiving order confirmation emails

**Solutions:**
```bash
# Check email configuration in .env
nano /var/www/smallscale/.env

# Verify SendGrid API key is correct
# Test email sending
cd /var/www/smallscale
php artisan tinker

Mail::raw('Test email', function($message) {
    $message->to('your@email.com')->subject('Test');
});
exit;

# Check email logs
tail -f /var/www/smallscale/storage/logs/laravel.log | grep "email"
```

**Problem 7: Website Very Slow**

**Solutions:**
```bash
# Clear all caches
cd /var/www/smallscale
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize application
php artisan config:cache
php artisan route:cache
php artisan optimize

# Check server resources
htop
# Look for high CPU or memory usage

# Check database slow queries
sudo mysql -u root -p
USE smallscale_db;
SHOW PROCESSLIST;
```

**Problem 8: Can't Access Admin Dashboard**

**Symptoms:** Admin login redirects to homepage or 404 error

**Solutions:**
```bash
# Clear route cache
cd /var/www/smallscale
php artisan route:clear
php artisan route:cache

# Check Apache config
sudo nano /etc/apache2/sites-available/smallscale-ssl.conf
# Ensure AllowOverride All is set

# Restart Apache
sudo systemctl restart apache2

# Check .htaccess file exists
ls -la /var/www/smallscale/public/.htaccess
```

### Getting Help

**If you still have issues:**

**1. Check Logs:**
```bash
# Application logs
tail -f /var/www/smallscale/storage/logs/laravel.log

# Apache error logs
tail -f /var/log/apache2/smallscale-error.log

# MySQL logs
tail -f /var/log/mysql/error.log

# System logs
tail -f /var/log/syslog
```

**2. Contact Hosting Support:**
- Whogohost: support@whogohost.ng, +234 700 9646 4678
- DigitalOcean: Submit ticket at cloud.digitalocean.com
- Qservers: support@qservers.net

**3. Hire Developer:**
- For complex issues, hire a Laravel developer
- Budget: ₦20,000-50,000 for troubleshooting
- Platforms: Upwork, Fiverr, or local Nigerian developers

---

## Summary

### Your Website is Now:

✅ **Publicly Accessible:** www.SmallScalePS.com  
✅ **Secure:** HTTPS with SSL certificate  
✅ **24/7 Available:** Running on reliable hosting  
✅ **Admin Controlled:** You have full dashboard access  
✅ **Backed Up:** Daily database + weekly file backups  
✅ **Monitored:** Logs and alerts configured  
✅ **Scalable:** Can handle growth  

### Quick Reference

**Customer URLs:**
```
Homepage: www.SmallScalePS.com
Products: www.SmallScalePS.com/products
Login: www.SmallScalePS.com/customer/login
Dashboard: www.SmallScalePS.com/customer/dashboard
```

**Admin URLs:**
```
Login: www.SmallScalePS.com/admin
Dashboard: www.SmallScalePS.com/admin/dashboard
Products: www.SmallScalePS.com/admin/products
Orders: www.SmallScalePS.com/admin/orders
Customers: www.SmallScalePS.com/admin/customers
```

**Server Access:**
```
SSH: ssh smallscale@YOUR_SERVER_IP
cPanel: https://cpanel.yourdomain.com (if using Whogohost)
Database: phpMyAdmin or MySQL command line
```

**Important Credentials (Keep Safe!):**
```
Domain Registrar Login
Hosting Account Login
Server SSH Password/Key
Database Root Password
Admin Email & Password
Cloudflare Account
Payment Gateway API Keys
Email Service API Key
SMS Service API Key
```

### Monthly Checklist

**Things to do every month:**
- [ ] Check website is accessible
- [ ] Login to admin and check orders
- [ ] Approve pending customer registrations
- [ ] Update product stock levels
- [ ] Check database backups completed
- [ ] Review error logs for issues
- [ ] Check SSL certificate (should auto-renew)
- [ ] Test email notifications working
- [ ] Review security logs for suspicious activity
- [ ] Update content if needed

### Congratulations! 🎉

Your SmallScale Wholesale website is now **fully deployed and ready for business!**

Customers can browse products, register, place orders, and you can manage everything securely through your admin dashboard.

**Need Help?** Refer back to this guide or contact:
- Email: damseljummy853@gmail.com
- Phone: +234 704 609 9135
- WhatsApp: +234 704 609 9135

---

**Document Version:** 1.0  
**Last Updated:** January 8, 2026  
**Status:** Production Ready ✅
