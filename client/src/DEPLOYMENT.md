# Deployment Guide for NITC Marketplace

This guide covers deploying the NITC Marketplace frontend to various hosting platforms.

## Prerequisites

- Git repository with your code
- GitHub account (for most deployment options)
- Completed local setup and testing

## Option 1: Deploy to Vercel (Recommended)

Vercel offers the easiest deployment for React apps with automatic builds.

### Steps:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/nitc-marketplace.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Create React App
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Click "Deploy"

3. **Environment Variables** (if needed later)
   - Go to Project Settings → Environment Variables
   - Add any API keys or configuration

4. **Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain

Your app will be live at `https://your-project-name.vercel.app`

## Option 2: Deploy to Netlify

### Steps:

1. **Push to GitHub** (same as Vercel step 1)

2. **Deploy on Netlify**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

3. **Configure Redirects** (for client-side routing)
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

Your app will be live at `https://your-site-name.netlify.app`

## Option 3: Deploy to GitHub Pages

### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/nitc-marketplace",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

Your app will be live at `https://yourusername.github.io/nitc-marketplace`

## Option 4: Deploy to Firebase Hosting

### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   - Select or create a project
   - Public directory: `build`
   - Single-page app: Yes
   - Set up automatic builds: No

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

Your app will be live at `https://your-project-id.web.app`

## Option 5: Deploy to AWS Amplify

### Steps:

1. **Push to GitHub** (if not already done)

2. **Deploy on AWS Amplify**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect to GitHub
   - Select your repository and branch
   - Configure:
     - Build settings: Auto-detected
     - Build command: `npm run build`
     - Output directory: `build`
   - Save and deploy

Your app will be live at `https://main.amplifyapp.com`

## Build Optimization

Before deploying to production:

### 1. Optimize Images
- Use WebP format for images
- Compress images
- Implement lazy loading

### 2. Code Splitting
Already handled by Create React App, but verify:
```tsx
// Use dynamic imports for large components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
```

### 3. Environment Variables
Create `.env.production`:
```
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_ENV=production
```

### 4. Remove Console Logs
```bash
# Install babel plugin
npm install --save-dev babel-plugin-transform-remove-console
```

### 5. Enable Gzip Compression
Most hosting providers do this automatically, but verify.

## Performance Checklist

- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] Images load properly
- [ ] Navigation works (all routes)
- [ ] Forms submit correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast load time (< 3 seconds)
- [ ] SEO meta tags added
- [ ] Analytics added (Google Analytics, etc.)

## Monitoring and Analytics

### Add Google Analytics

1. **Get GA tracking ID** from https://analytics.google.com

2. **Add to public/index.html**:
   ```html
   <head>
     <!-- Google Analytics -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_TRACKING_ID');
     </script>
   </head>
   ```

### Error Tracking with Sentry

1. **Install Sentry**:
   ```bash
   npm install @sentry/react
   ```

2. **Initialize in index.tsx**:
   ```tsx
   import * as Sentry from "@sentry/react";

   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     integrations: [new Sentry.BrowserTracing()],
     tracesSampleRate: 1.0,
   });
   ```

## SSL Certificate

All mentioned hosting platforms provide free SSL certificates automatically. Your site will be served over HTTPS.

## Custom Domain Setup

### For Vercel:
1. Go to Project Settings → Domains
2. Add domain
3. Update DNS records at your domain registrar

### For Netlify:
1. Go to Domain settings
2. Add custom domain
3. Netlify will provide DNS records
4. Update at your domain registrar

## Continuous Deployment

All platforms mentioned support automatic deployments:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Automatic Build**: The platform will detect the push and automatically build and deploy

## Rollback Strategy

### Vercel:
- Go to Deployments
- Click on previous deployment
- Click "Promote to Production"

### Netlify:
- Go to Deploys
- Find previous deploy
- Click "Publish deploy"

## Environment-Specific Builds

Create different environment files:

- `.env.development` - For local development
- `.env.staging` - For staging environment
- `.env.production` - For production

## Security Considerations

1. **Never commit sensitive data**:
   - Add `.env` to `.gitignore`
   - Use environment variables for API keys

2. **Content Security Policy**:
   Add to `public/index.html`:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' https://images.unsplash.com https://via.placeholder.com">
   ```

3. **CORS Configuration**:
   Configure on your backend to only allow your frontend domain

## Post-Deployment Testing

Test these on the live site:

- [ ] All authentication flows work
- [ ] All pages are accessible
- [ ] Images load from Unsplash
- [ ] Forms work correctly
- [ ] No broken links
- [ ] Mobile view works
- [ ] Search functionality
- [ ] Filter functionality
- [ ] Toast notifications appear

## Troubleshooting Deployment Issues

### Build Fails

**Check:**
- All dependencies in package.json
- No TypeScript errors
- Build command is correct
- Node version compatibility

**Solution:**
```bash
# Test build locally first
npm run build
```

### 404 on Refresh

**Solution:**
Add redirect rules (different per platform)

**Netlify** - `public/_redirects`:
```
/*    /index.html   200
```

**Vercel** - `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Environment Variables Not Working

**Check:**
- Variables are prefixed with `REACT_APP_`
- Variables are added in hosting platform settings
- Build was triggered after adding variables

### Slow Load Times

**Solutions:**
- Enable CDN (usually automatic)
- Optimize images
- Enable caching headers
- Use code splitting

## Costs

### Free Tiers:
- **Vercel**: Free for personal projects, unlimited bandwidth
- **Netlify**: 100GB bandwidth/month free
- **GitHub Pages**: Free for public repos
- **Firebase**: Free tier available
- **AWS Amplify**: Free tier for 12 months

### Paid Plans:
Only needed for:
- High traffic (>100GB/month)
- Team collaboration features
- Advanced analytics
- Custom SLAs

## Recommended Setup for NITC Marketplace

**For Development/Testing:**
- Deploy to Vercel free tier
- Use automatic deployments from GitHub
- Add staging branch for testing

**For Production:**
- Custom domain (nitcmarketplace.com)
- Vercel Pro if high traffic expected
- Add monitoring (Sentry)
- Add analytics (Google Analytics)
- Set up proper error boundaries

## Support and Maintenance

1. **Monitor**: Set up uptime monitoring (UptimeRobot, Pingdom)
2. **Update**: Regularly update dependencies
3. **Backup**: Keep GitHub as source of truth
4. **Scale**: Upgrade hosting plan as traffic grows

---

Choose the deployment platform that best fits your needs. For NITC Marketplace, **Vercel** is recommended for its ease of use, excellent performance, and generous free tier.
