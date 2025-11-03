# Backend Setup Guide - NITC Marketplace

This is a comprehensive guide to set up and run the Express.js backend with MongoDB for the NITC Marketplace application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [MongoDB Setup](#mongodb-setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional, for version control)

Check your installations:
```bash
node --version
npm --version
mongod --version
```

## Quick Start

### Using the Startup Scripts

**On macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**On Windows:**
```bash
start.bat
```

These scripts will:
1. Check MongoDB connection
2. Install dependencies if needed
3. Create environment files
4. Start both backend and frontend servers

## Detailed Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB ODM)
- bcryptjs (Password hashing)
- jsonwebtoken (Authentication)
- cors (Cross-origin requests)
- dotenv (Environment variables)
- express-validator (Input validation)

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nitc-marketplace

# JWT Secret (Change this to a secure random string)
JWT_SECRET=your_very_secure_secret_key_change_this_in_production

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

**Important:** Generate a strong JWT_SECRET:
```bash
# On macOS/Linux
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator
# https://www.grc.com/passwords.htm
```

### Step 3: Configure Frontend Environment

Create a `.env` file in the root directory (for frontend):

```env
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Setup

You have three options for running MongoDB:

### Option 1: Local MongoDB (Recommended for Development)

**macOS:**
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or run manually
mongod
```

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install using the installer
3. MongoDB will start automatically as a Windows service

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

Verify MongoDB is running:
```bash
# Try connecting with MongoDB shell
mongosh
# or
mongo
```

### Option 2: Docker (Easy Setup)

```bash
# Pull and run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Check if running
docker ps

# View logs
docker logs mongodb

# Stop MongoDB
docker stop mongodb

# Start MongoDB again
docker start mongodb
```

### Option 3: MongoDB Atlas (Cloud - Free Tier Available)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (M0 Free tier)
4. Go to Database Access → Add New Database User
   - Create username and password
5. Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (for development)
6. Click "Connect" on your cluster
7. Choose "Connect your application"
8. Copy the connection string
9. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nitc-marketplace?retryWrites=true&w=majority
```

Replace `username`, `password`, and cluster URL with your values.

## Running the Application

### Start Backend Only

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend Only

```bash
# From root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

### Start Both (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Or use the startup scripts mentioned in Quick Start.

## Testing

### Test Backend API

1. **Check Health Endpoint:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"NITC Marketplace API is running"}
```

2. **Test Sign Up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@nitc.ac.in",
    "password": "password123",
    "rollNumber": "B200001CS",
    "department": "Computer Science & Engineering",
    "semester": "3",
    "phone": "9876543210"
  }'
```

3. **Test Sign In:**
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@nitc.ac.in",
    "password": "password123"
  }'
```

4. **Test Admin Login:**
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nitc.ac.in",
    "password": "admin123"
  }'
```

### Using API Testing Tools

**Postman:**
1. Download [Postman](https://www.postman.com/downloads/)
2. Import the API collection (create from docs)
3. Test each endpoint

**Insomnia:**
1. Download [Insomnia](https://insomnia.rest/download)
2. Create new request
3. Set base URL: `http://localhost:5000/api`
4. Test endpoints

### Test Frontend Integration

1. Open `http://localhost:5173` in browser
2. Sign up with a new account
3. Sign in
4. Create a new item listing
5. Test search and filters
6. Test messaging (open in two browsers/incognito)
7. Test admin dashboard (login as admin)

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   # macOS/Linux
   ps aux | grep mongod
   
   # Windows
   tasklist | findstr mongod
   ```

2. Start MongoDB:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   
   # Docker
   docker start mongodb
   ```

3. Check MongoDB port:
   ```bash
   netstat -an | grep 27017
   ```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**

**macOS/Linux:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)
```

**Windows:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

Or change the PORT in `.env` file.

### JWT Errors

**Error:** `JsonWebTokenError: jwt malformed`

**Solutions:**
1. Clear localStorage in browser
2. Sign in again to get new token
3. Ensure JWT_SECRET is set in `.env`

### CORS Errors

**Error:** `Access to fetch at 'http://localhost:5000' has been blocked by CORS policy`

**Solutions:**
1. Ensure backend CORS is configured correctly
2. Check `VITE_API_URL` in frontend `.env`
3. Restart both servers

### Database Not Found

**Error:** `Database not found`

**Solution:** 
MongoDB creates databases automatically when you first insert data. Just make sure MongoDB is running.

### Dependencies Installation Failed

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Backend Won't Start

1. Check Node.js version: `node --version` (should be v14+)
2. Check for syntax errors in code
3. Check backend logs: `tail -f backend.log`
4. Ensure all dependencies are installed
5. Check `.env` file exists and is configured

### Frontend Can't Connect to Backend

1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check `VITE_API_URL` in frontend `.env`
3. Check browser console for errors
4. Verify no firewall blocking localhost connections

## Next Steps

After successful setup:

1. **Read Integration Guide:** Check `BACKEND_INTEGRATION.md` for detailed integration examples
2. **Test All Features:** Go through the testing checklist
3. **Customize:** Modify the application to your needs
4. **Deploy:** When ready, deploy to production (see deployment docs)

## Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests

# MongoDB
mongosh              # Open MongoDB shell
db.users.find()      # View users
db.items.find()      # View items

# Docker
docker logs mongodb  # View MongoDB logs
docker exec -it mongodb mongosh  # Access MongoDB shell in container

# Project
npm run build        # Build frontend for production
```

## Database Management

### MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Browse and manage your database visually

### Useful MongoDB Commands

```javascript
// Connect to database
use nitc-marketplace

// View all users
db.users.find().pretty()

// Count items
db.items.countDocuments()

// Find specific user
db.users.findOne({ email: "admin@nitc.ac.in" })

// Delete all test data
db.items.deleteMany({ seller: ObjectId("...") })

// Create index for better performance
db.items.createIndex({ title: "text", description: "text" })
```

## Production Considerations

Before deploying to production:

1. **Security:**
   - Change JWT_SECRET to strong random string
   - Use environment-specific .env files
   - Enable rate limiting
   - Add helmet.js for security headers

2. **Database:**
   - Use MongoDB Atlas or managed database
   - Enable authentication
   - Set up backups
   - Add indexes for performance

3. **Monitoring:**
   - Add logging (Winston, Morgan)
   - Set up error tracking (Sentry)
   - Monitor performance (New Relic, DataDog)

4. **Deployment:**
   - Use PM2 for process management
   - Set up CI/CD pipeline
   - Configure domain and SSL
   - Set environment to 'production'

## Support Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Express.js Docs:** https://expressjs.com/
- **Mongoose Docs:** https://mongoosejs.com/
- **JWT Docs:** https://jwt.io/

## Getting Help

If you encounter issues:
1. Check the error message carefully
2. Review the logs (backend.log)
3. Check MongoDB logs
4. Search for similar issues online
5. Review the API documentation

## Contributing

When making changes to the backend:
1. Test thoroughly with Postman/Insomnia
2. Update API documentation
3. Test error cases
4. Check security implications
5. Update this guide if needed

---

**Happy Coding! 🚀**

Your NITC Marketplace backend is now ready to power your marketplace application!
