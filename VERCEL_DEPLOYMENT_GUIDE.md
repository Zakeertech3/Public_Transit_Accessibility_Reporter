# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
3. **Git installed** - To push your code to GitHub

## 🔧 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. **Go to GitHub** and create a new repository
2. **Name it**: `transit-accessibility-reporter` (or any name you prefer)
3. **Make it public** (required for free Vercel deployment)
4. **Don't initialize** with README (we'll push existing code)

### Step 2: Push Your Code to GitHub

Open PowerShell in your project directory and run:

```powershell
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit - Transit Accessibility Reporter with custom categories"

# Add your GitHub repository as origin (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/transit-accessibility-reporter.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username!

### Step 3: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your repository** from the list
4. **Configure the project**:

   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (use root)
   - **Build Command**: Leave empty
   - **Output Directory**: `frontend`
   - **Install Command**: `pip install -r requirements.txt`

5. **Click "Deploy"**

### Step 4: Wait for Deployment

- Vercel will build and deploy your app
- This usually takes 2-3 minutes
- You'll get a live URL like: `https://your-app-name.vercel.app`

## 📱 Mobile Access

Once deployed, you can:

1. **Open the Vercel URL** on any mobile device
2. **Add to Home Screen** (iOS/Android):
   - **iOS**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home Screen
3. **Use like a native app** with GPS location access

## 🔍 Troubleshooting

### If Deployment Fails

1. **Check build logs** in Vercel dashboard
2. **Common issues**:
   - Missing dependencies in `requirements.txt`
   - Python version compatibility
   - File path issues

### If API Doesn't Work

1. **Check function logs** in Vercel dashboard
2. **Verify API endpoints** are accessible:
   - `https://your-app.vercel.app/health`
   - `https://your-app.vercel.app/api/reports`

### Database Issues

**Note**: SQLite doesn't work on Vercel serverless functions. For production, you'll need:

1. **Use Vercel Postgres** (recommended):

   ```bash
   # In Vercel dashboard, add Postgres database
   # Update connection string in environment variables
   ```

2. **Or use external database**:
   - Railway PostgreSQL
   - PlanetScale MySQL
   - Supabase PostgreSQL

## 🎯 Quick Commands

```powershell
# Check git status
git status

# Add new changes
git add .
git commit -m "Updated features"
git push

# Vercel will auto-deploy on push!
```

## 🌐 Example URLs

After deployment, your app will be available at:

- **Main App**: `https://your-app-name.vercel.app`
- **Report Form**: `https://your-app-name.vercel.app/index.html`
- **Map View**: `https://your-app-name.vercel.app/map.html`
- **Reports List**: `https://your-app-name.vercel.app/reports.html`
- **API Health**: `https://your-app-name.vercel.app/health`

## 📱 Mobile Features

Your deployed app will have:

- ✅ **Responsive design** - Works on all screen sizes
- ✅ **GPS location** - Access device location
- ✅ **Camera access** - Take photos for reports
- ✅ **Offline-ready** - Basic functionality without internet
- ✅ **Fast loading** - Optimized for mobile networks
- ✅ **Touch-friendly** - Large buttons and inputs

## 🔄 Continuous Deployment

Once set up:

1. **Make changes** to your code locally
2. **Push to GitHub**: `git push`
3. **Vercel auto-deploys** - No manual steps needed!
4. **Live in 1-2 minutes** - Changes appear automatically

## 🎉 Success!

Your Transit Accessibility Reporter is now live and accessible from any mobile device worldwide! Share the URL with users who need to report accessibility issues.
