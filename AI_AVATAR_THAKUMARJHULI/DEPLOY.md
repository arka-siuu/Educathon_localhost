# 🚀 Deploy Thakuma AI Avatar to Railway

## Quick Deployment (5 minutes)

### Step 1: Create a Railway Account
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (free)

### Step 2: Deploy from GitHub

**Option A: Deploy via GitHub (Recommended)**
1. Create a new GitHub repository
2. Push this code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Thakuma AI Avatar"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
3. In Railway, click "New Project" → "Deploy from GitHub repo"
4. Select your repository

**Option B: Deploy via Railway CLI**
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

### Step 3: Add Environment Variables
In Railway dashboard, go to Variables tab and add:
- `GEMINI_API_KEY` = `AIzaSyC7VpTvL_juEkJFcEfjP1oU_h2McA2OjqA`
- `GOOEY_API_KEY` = `sk-pQCdaBVdXmK0N0WezMziLKtp2MhaYvroisddDdgiQ40jDhJe`

### Step 4: Deploy!
Railway will automatically:
- Detect it's a Python app
- Install dependencies from requirements.txt
- Run the app using the Procfile
- Give you a public URL!

Your app will be live at: `https://your-app-name.railway.app`

---

## Alternative: Deploy to Render (Also Free)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up (free)

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: thakuma-ai-avatar
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

### Step 3: Add Environment Variables
Add the same variables as above

### Step 4: Deploy!
Click "Create Web Service"

Your app will be live at: `https://thakuma-ai-avatar.onrender.com`

---

## Files Created for Deployment
- `Procfile` - Tells how to run the app
- `runtime.txt` - Specifies Python version
- `railway.json` - Railway configuration
- `.gitignore` - Files to ignore in git

## Notes
- Both Railway and Render have free tiers
- The app will sleep after 15 minutes of inactivity (free tier)
- First request after sleep might take 30 seconds to wake up
- For production, consider upgrading to paid tier

---

**Need help? Let me know!**
