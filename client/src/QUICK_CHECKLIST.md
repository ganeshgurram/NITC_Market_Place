# Quick Start Checklist ✅

Use this checklist to get your NITC Marketplace up and running quickly.

## Prerequisites ☑️

- [ ] Node.js installed (v14+) - `node --version`
- [ ] npm installed - `npm --version`
- [ ] MongoDB installed OR Docker available
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## Setup Steps 🛠️

### 1. MongoDB Setup
Choose ONE option:

**Option A: Docker (Easiest)**
- [ ] Run: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
- [ ] Verify: `docker ps` shows mongodb running

**Option B: Local MongoDB**
- [ ] MongoDB installed
- [ ] MongoDB running
- [ ] Can connect with `mongosh` or `mongo`

**Option C: MongoDB Atlas (Cloud)**
- [ ] Account created at mongodb.com/cloud/atlas
- [ ] Cluster created (free M0 tier)
- [ ] Connection string copied

### 2. Backend Setup

- [ ] Navigate to project: `cd nitc-marketplace`
- [ ] Go to backend: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Create .env: `cp .env.example .env`
- [ ] Edit .env with your settings
- [ ] Return to root: `cd ..`

**Backend .env Configuration:**
```env
MONGODB_URI=mongodb://localhost:27017/nitc-marketplace
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```
- [ ] MONGODB_URI is correct
- [ ] JWT_SECRET is set (change from default)
- [ ] PORT is 5000 (or change if needed)

### 3. Frontend Setup

- [ ] In project root directory
- [ ] Install dependencies: `npm install`
- [ ] Create .env: `echo "VITE_API_URL=http://localhost:5000/api" > .env`

**Frontend .env Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```
- [ ] VITE_API_URL matches backend URL

### 4. Start Servers

**Option A: Use Scripts (Recommended)**

macOS/Linux:
- [ ] Make executable: `chmod +x start.sh`
- [ ] Run: `./start.sh`

Windows:
- [ ] Run: `start.bat`

**Option B: Manual Start**

Terminal 1 - Backend:
- [ ] `cd backend`
- [ ] `npm run dev`
- [ ] Server starts on port 5000
- [ ] No errors in console
- [ ] "Connected to MongoDB" message appears

Terminal 2 - Frontend:
- [ ] In project root
- [ ] `npm run dev`
- [ ] Server starts on port 5173
- [ ] No errors in console
- [ ] Opens browser automatically

### 5. Verify Setup

- [ ] Frontend opens at http://localhost:5173
- [ ] Backend responds at http://localhost:5000/api/health
- [ ] No console errors in browser
- [ ] No errors in terminal/backend logs

**Test Backend:**
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status":"ok","message":"NITC Marketplace API is running"}`

- [ ] Health check returns OK

## First Run Testing 🧪

### Test Authentication

- [ ] Click "Sign Up" on frontend
- [ ] Fill in form with @nitc.ac.in email
- [ ] Submit form
- [ ] Account created successfully
- [ ] Redirected to marketplace
- [ ] Toast notification appears

### Test Admin Access

- [ ] Sign out if logged in
- [ ] Click "Sign In"
- [ ] Use admin credentials:
  - Email: `admin@nitc.ac.in`
  - Password: `admin123`
- [ ] Admin dashboard appears
- [ ] Can see admin statistics

### Test Basic Features

- [ ] Can see marketplace listings
- [ ] Search bar works
- [ ] Filter dropdowns work
- [ ] Can click on an item to view details
- [ ] Messages icon visible in header

## Integration Checklist 🔌

### Components to Integrate

Review `INTEGRATION_EXAMPLES.md` and integrate:

- [ ] App.tsx - Load items from API
- [ ] ListItemPage.tsx - Create items via API
- [ ] ManageListings.tsx - Update/delete via API
- [ ] MessagingInterface.tsx - Real messaging
- [ ] ItemDetail.tsx - Load item details
- [ ] SubmitReview.tsx - Submit reviews
- [ ] ViewRatings.tsx - Load reviews
- [ ] AdminDashboard.tsx - Load admin data
- [ ] UserProfile.tsx - Load user data
- [ ] Header.tsx - Unread message count

### API Integration Status

- [✅] SignIn.tsx - Integrated
- [✅] SignUp.tsx - Integrated
- [✅] utils/api.ts - Complete
- [ ] App.tsx - Needs integration
- [ ] Other components - Ready for integration

## Common Issues Checklist 🔧

### MongoDB Issues

- [ ] MongoDB is running - `mongosh` connects
- [ ] Port 27017 is free - `netstat -an | grep 27017`
- [ ] Connection string is correct in .env
- [ ] No firewall blocking MongoDB

**Fix:** Restart MongoDB, check connection string, verify port

### Backend Issues

- [ ] Dependencies installed - `node_modules` exists
- [ ] .env file exists in backend folder
- [ ] Port 5000 is free
- [ ] No syntax errors in backend code
- [ ] MongoDB connection successful

**Fix:** `cd backend && npm install`, check logs, verify .env

### Frontend Issues

- [ ] Dependencies installed - `node_modules` exists
- [ ] .env file exists in root folder
- [ ] Port 5173 is free
- [ ] Backend is running and accessible
- [ ] VITE_API_URL is correct

**Fix:** `npm install`, check .env, verify backend URL

### Connection Issues

- [ ] Backend health check works
- [ ] No CORS errors in browser console
- [ ] Network tab shows API calls
- [ ] Backend logs show requests
- [ ] No 404 errors for API endpoints

**Fix:** Check CORS config, verify URLs, restart servers

### Authentication Issues

- [ ] Token saved in localStorage (check DevTools)
- [ ] Token not expired
- [ ] Backend verifies token correctly
- [ ] No 401 errors in console

**Fix:** Clear localStorage, sign in again, check JWT_SECRET

## Production Checklist 🚀

Before deploying:

### Security
- [ ] Change JWT_SECRET to strong random string
- [ ] Update MONGODB_URI to production database
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Review CORS configuration
- [ ] Secure environment variables
- [ ] Change default admin password

### Database
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable authentication
- [ ] Set up backups
- [ ] Create indexes
- [ ] Test connection from production server

### Backend
- [ ] Environment set to 'production'
- [ ] All routes tested
- [ ] Error handling verified
- [ ] Logging configured
- [ ] Health check endpoint works

### Frontend
- [ ] Build tested - `npm run build`
- [ ] No console errors
- [ ] API URL updated to production
- [ ] Images loading correctly
- [ ] Responsive on all devices

### Testing
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Admin access works
- [ ] Items can be created
- [ ] Messages can be sent
- [ ] Reviews can be submitted
- [ ] Transactions can be completed
- [ ] All filters work
- [ ] Search works

### Deployment
- [ ] Choose hosting platform (Vercel, Heroku, etc.)
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Domain configured (if applicable)
- [ ] SSL certificate installed
- [ ] Monitoring set up

## Quick Commands Reference 💻

```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm run dev

# Test API
curl http://localhost:5000/api/health

# Check MongoDB
mongosh
use nitc-marketplace
db.users.countDocuments()

# View logs
tail -f backend.log

# Stop MongoDB (Docker)
docker stop mongodb

# Restart MongoDB (Docker)
docker start mongodb

# Install dependencies
npm install && cd backend && npm install && cd ..

# Build for production
npm run build
```

## Help & Resources 📚

If stuck, check:

1. **Error Messages** - Read them carefully
2. **Console Logs** - Both browser and terminal
3. **Documentation:**
   - [ ] GETTING_STARTED.md - Quick start
   - [ ] BACKEND_SETUP.md - Detailed setup
   - [ ] INTEGRATION_EXAMPLES.md - Code examples
   - [ ] API_REFERENCE.md - API docs
   - [ ] TROUBLESHOOTING.md - Common issues

4. **MongoDB Logs** - Check database connection
5. **Network Tab** - Inspect API calls

## Success Indicators ✨

You know it's working when:

- ✅ No errors in terminal
- ✅ No errors in browser console
- ✅ Health check returns OK
- ✅ Can sign up and sign in
- ✅ Items display on marketplace
- ✅ Search and filters work
- ✅ Admin dashboard accessible
- ✅ MongoDB contains data

## Final Checks ✔️

- [ ] All dependencies installed
- [ ] MongoDB running
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can sign up new account
- [ ] Can sign in
- [ ] Can access admin dashboard
- [ ] No console errors
- [ ] Ready to integrate more features

## Status

Mark your current status:

- [ ] 🟡 Setting up prerequisites
- [ ] 🟡 Installing dependencies
- [ ] 🟡 Configuring environment
- [ ] 🟡 Starting servers
- [ ] 🟡 Testing basic functionality
- [ ] 🟢 **READY TO DEVELOP!**

---

## Next Steps

Once all checks are complete:

1. Review `INTEGRATION_EXAMPLES.md` for code examples
2. Start integrating components with backend API
3. Test each feature thoroughly
4. Customize to your needs
5. Deploy when ready

**Good luck! 🎉**

You're now ready to build an amazing marketplace platform!

---

**Quick Links:**
- Health Check: http://localhost:5000/api/health
- Frontend: http://localhost:5173
- Admin Login: admin@nitc.ac.in / admin123

**Need help?** Check the documentation files in the project root.
