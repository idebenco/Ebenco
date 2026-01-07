# Deployment Guide - Wholesale Business Website

This guide provides step-by-step instructions for deploying the wholesale business website to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup (MongoDB Atlas)](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Post-Deployment](#post-deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

Before deploying, ensure you have:

- Git installed
- GitHub account with repository access
- MongoDB Atlas account (free tier available)
- Hosting platform accounts:
  - Backend: Heroku, Railway, Render, or DigitalOcean
  - Frontend: Netlify, Vercel, or GitHub Pages
- Domain name (optional)

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization and project

### Step 2: Create Database Cluster
1. Click "Build a Database"
2. Select "Shared" (Free tier)
3. Choose a cloud provider and region (closest to your users)
4. Name your cluster (e.g., "wholesale-cluster")
5. Click "Create Cluster"

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with username and strong password
4. Set permissions to "Read and write to any database"
5. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses of your hosting platform
5. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" and click "Connect"
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with your database name (e.g., "wholesale-db")

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/wholesale-db?retryWrites=true&w=majority
```

## Backend Deployment

### Option 1: Deploy to Render (Recommended)

1. **Sign up for Render**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - Name: `wholesale-backend`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Branch: `main` or your deployment branch
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Set Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.netlify.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://wholesale-backend.onrender.com`)

### Option 2: Deploy to Railway

1. **Sign up for Railway**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Add environment variables (same as above)
   - Set root directory to `backend`
   - Railway auto-detects Node.js and deploys

4. **Get Service URL**
   - Copy the generated URL from Railway dashboard

### Option 3: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create wholesale-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your-connection-string
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Seed Database (One-time)
After backend deployment, seed the database:

1. Access your backend URL in browser or use curl
2. Run seed script via Heroku CLI:
   ```bash
   heroku run npm run seed -a wholesale-backend
   ```

## Frontend Deployment

### Option 1: Deploy to Netlify (Recommended)

1. **Sign up for Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Note your site URL (e.g., `https://wholesale-business.netlify.app`)

6. **Update Backend CORS**
   - Go back to your backend hosting platform
   - Update `FRONTEND_URL` environment variable with your Netlify URL
   - Redeploy backend

### Option 2: Deploy to Vercel

1. **Sign up for Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment

### Option 3: Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/reponame",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/reponame/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Post-Deployment

### 1. Test the Application
- Visit your frontend URL
- Register a new customer account
- Test login functionality
- Browse products
- Submit a test order
- Login with admin credentials
- Test admin dashboard features

### 2. Update CORS Settings
Ensure backend CORS is configured correctly:
```typescript
cors({
  origin: 'https://your-frontend-url.netlify.app',
  credentials: true,
})
```

### 3. Set Up Custom Domain (Optional)

**For Netlify:**
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records with your domain registrar

**For Render:**
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

### 4. Enable HTTPS
- Most modern hosting platforms enable HTTPS by default
- Verify SSL certificate is active
- Ensure all API calls use HTTPS

### 5. Monitor Performance
- Check application logs for errors
- Monitor database connections
- Set up error tracking (Sentry, LogRocket)
- Enable analytics (Google Analytics)

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wholesale-db
JWT_SECRET=change-this-to-a-random-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend.netlify.app
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Monitoring and Maintenance

### Regular Tasks
1. **Monitor Database Usage**
   - Check MongoDB Atlas metrics
   - Monitor storage and connection limits
   - Scale cluster if needed

2. **Update Dependencies**
   ```bash
   npm outdated
   npm update
   ```

3. **Security Updates**
   - Regularly update npm packages
   - Monitor security advisories
   - Rotate JWT secrets periodically

4. **Backup Database**
   - MongoDB Atlas provides automatic backups
   - Configure backup retention policy
   - Test restore procedure

### Troubleshooting

**Backend not starting:**
- Check environment variables
- Verify MongoDB connection string
- Check hosting platform logs

**Frontend can't connect to backend:**
- Verify API URL in frontend env
- Check CORS settings in backend
- Ensure backend is running

**Database connection errors:**
- Verify IP whitelist in MongoDB Atlas
- Check connection string format
- Ensure database user has correct permissions

## Scaling Considerations

### When to Scale

**Backend:**
- Response times > 1 second
- High CPU/memory usage
- Increasing number of concurrent users

**Database:**
- Storage approaching limits
- Slow query performance
- Connection pool exhausted

**Frontend:**
- High traffic volumes
- Global user base (consider CDN)

### Scaling Options

1. **Vertical Scaling**: Upgrade to larger instance
2. **Horizontal Scaling**: Add more servers (load balancing)
3. **Database Scaling**: Upgrade MongoDB cluster tier
4. **CDN**: Use CloudFront, Cloudflare for static assets
5. **Caching**: Implement Redis for frequently accessed data

## Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] Strong JWT secret in production
- [ ] Environment variables secured
- [ ] Database credentials rotated regularly
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (MongoDB uses BSON)
- [ ] XSS protection headers set
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

## Cost Estimation

### Free Tier (Suitable for Development/Testing)
- MongoDB Atlas: Free (M0 cluster, 512MB storage)
- Render/Railway: Free tier available (limited hours)
- Netlify/Vercel: Free tier (generous limits)
- **Total: $0/month**

### Production Tier (Recommended)
- MongoDB Atlas: $9-25/month (M10 cluster)
- Render/Railway: $7-15/month (always-on)
- Netlify/Vercel: Free tier sufficient
- Custom Domain: $10-15/year
- **Total: ~$20-40/month**

## Support and Documentation

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)

## Conclusion

Your wholesale business website is now deployed! Continue monitoring performance, gathering user feedback, and iterating on features to provide the best experience for your customers.

For support or questions, refer to the main README.md or contact your development team.
