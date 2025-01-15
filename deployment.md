# Deployment Guide for YouTube Downloader App

## Prerequisites
1. A Vercel account (free at vercel.com)
2. Git installed on your computer
3. GitHub account
4. yt-dlp installed on the deployment server

## Step-by-Step Deployment Process

### 1. Prepare Your Project for Production

First, let's update your package.json to ensure all dependencies are properly listed:
```json
{
  "name": "youtube-downloader",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 2. Create a GitHub Repository
1. Go to github.com
2. Click "New Repository"
3. Name it "youtube-downloader"
4. Make it public
5. Don't initialize with README (we already have one)

### 3. Push Your Code to GitHub
Run these commands in your project directory:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 4. Deploy to Vercel
1. Go to vercel.com
2. Sign up/Login with your GitHub account
3. Click "Import Project"
4. Select your GitHub repository
5. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 5. Environment Setup
Since this app requires yt-dlp, we need to use a custom server that has yt-dlp installed. You have two options:

#### Option A: Deploy to a VPS (Virtual Private Server)
1. Get a VPS from providers like DigitalOcean, Linode, or AWS EC2
2. SSH into your server
3. Install required dependencies:
   ```bash
   sudo apt update
   sudo apt install nodejs npm python3-pip
   sudo pip install yt-dlp
   ```
4. Clone your repository
5. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
6. Use PM2 to run the app:
   ```bash
   npm install -g pm2
   pm2 start npm --name "youtube-downloader" -- start
   ```

#### Option B: Use Docker (Recommended)
1. Create a Dockerfile in your project:
```dockerfile
FROM node:18-alpine

# Install dependencies for yt-dlp
RUN apk add --no-cache python3 py3-pip ffmpeg
RUN pip3 install yt-dlp

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build app
RUN npm run build

# Start app
CMD ["npm", "start"]
```

2. Build and run with Docker:
```bash
docker build -t youtube-downloader .
docker run -p 3000:3000 youtube-downloader
```

### 6. Domain Setup (Optional)
1. Buy a domain from providers like Namecheap or GoDaddy
2. Add domain in Vercel:
   - Go to Project Settings
   - Domains
   - Add your domain
   - Follow DNS configuration instructions

### 7. SSL Setup
- If using Vercel: SSL is automatically handled
- If using VPS: Use Certbot for free SSL certificates

### 8. Monitoring and Maintenance
1. Set up monitoring:
   - Use Vercel Analytics
   - Or implement services like Sentry for error tracking
2. Regular updates:
   - Keep yt-dlp updated
   - Update Node.js dependencies

## Important Notes
1. Make sure your deployment provider allows video downloading
2. Consider rate limiting to prevent abuse
3. Add proper error handling for production
4. Monitor server resources
5. Keep backups of your code

## Troubleshooting
Common issues and solutions:
1. yt-dlp not found: Install it on the server
2. Permission errors: Check file permissions
3. Memory issues: Adjust Node.js memory limit
4. Download errors: Update yt-dlp regularly
