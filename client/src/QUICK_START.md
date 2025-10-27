# NITC Marketplace - Quick Start Guide

Get your NITC Marketplace up and running in under 10 minutes!

## 📋 Prerequisites

- Node.js 16+ installed ([Download](https://nodejs.org/))
- Code editor (VS Code recommended)
- Terminal/Command Prompt access

## 🚀 Quick Setup (5 Steps)

### Step 1: Create React App
```bash
npx create-react-app nitc-marketplace --template typescript
cd nitc-marketplace
```

### Step 2: Install Dependencies
```bash
npm install lucide-react sonner@2.0.3 react-hook-form@7.55.0 clsx tailwind-merge class-variance-authority
```

### Step 3: Copy Files
Copy all files from the repository to your project:
- `/src/App.tsx` → Your `/src/App.tsx`
- `/components/*` → Your `/src/components/*`
- `/styles/globals.css` → Your `/src/styles/globals.css`

**Critical Files:**
```
src/
├── App.tsx                   ← COPY THIS
├── components/               ← COPY ALL FILES
│   ├── *.tsx                 (15 component files)
│   ├── ui/*.tsx              (45+ UI components)
│   └── figma/ImageWithFallback.tsx
└── styles/
    └── globals.css           ← COPY THIS
```

### Step 4: Update Entry Point
Replace `src/index.tsx` with:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { Toaster } from 'sonner@2.0.3';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </React.StrictMode>
);
```

### Step 5: Run!
```bash
npm start
```

Your app should open at `http://localhost:3000`

## 🧪 Test It Out

### Login as Student
- Email: `student.demo@nitc.ac.in`
- Password: `password123`

### Login as Admin
- Email: `admin@nitc.ac.in`
- Password: `admin123`

## ✅ Verification Checklist

After setup, you should see:
- [ ] Sign-in page loads
- [ ] Can login with demo credentials
- [ ] See 4 mock items on marketplace
- [ ] Search bar works
- [ ] Can filter by department
- [ ] Toast notifications appear
- [ ] No console errors

## 🔧 Common Issues & Fixes

### Issue: Module not found
```bash
# Install missing dependencies
npm install
```

### Issue: Blank white screen
**Check:** 
- Browser console for errors
- All files copied correctly
- `globals.css` is imported in `index.tsx`

### Issue: Styles not working
**Fix:**
- Verify `globals.css` content is complete
- Check import path in `index.tsx`

### Issue: TypeScript errors
**Fix:**
```bash
# Install type definitions
npm install --save-dev @types/react @types/react-dom @types/node
```

## 📁 File Count Check

You should have:
- ✓ 15 main component files
- ✓ 45+ UI component files
- ✓ 1 globals.css file
- ✓ 1 App.tsx file
- ✓ 1 ImageWithFallback.tsx file

**Total:** ~62 `.tsx` files + 1 `.css` file

## 🎯 Next Steps

1. **Explore Features:**
   - Post an item
   - Send a message
   - Submit a review
   - View admin dashboard (login as admin)

2. **Customize:**
   - Change colors in `globals.css`
   - Modify mock data in components
   - Add your own branding

3. **Deploy:**
   - See `DEPLOYMENT.md` for hosting options
   - Recommended: Vercel (easiest)

## 📚 Documentation

- **Full Setup:** See `SETUP_GUIDE.md`
- **File Structure:** See `FILE_STRUCTURE.md`
- **Deployment:** See `DEPLOYMENT.md`
- **Features:** See `README.md`

## 🆘 Need Help?

1. **Check console errors** - Most issues show error messages
2. **Verify all files copied** - Missing files cause import errors
3. **Clear node_modules** - Delete `node_modules` and run `npm install`
4. **Check Node version** - Must be v16 or higher

## ⚡ Alternative: Vite Setup (Faster)

For a faster development experience:

```bash
# Create Vite app
npm create vite@latest nitc-marketplace -- --template react-ts
cd nitc-marketplace

# Install dependencies
npm install lucide-react sonner@2.0.3 react-hook-form@7.55.0 clsx tailwind-merge class-variance-authority

# Copy all files (same as above)

# Update src/main.tsx instead of src/index.tsx

# Run
npm run dev
```

## 🎨 Customization Quick Tips

### Change Primary Color
Edit `styles/globals.css`:
```css
:root {
  --primary: #YOUR_COLOR_HERE;
}
```

### Change App Name
Edit `public/index.html`:
```html
<title>Your Marketplace Name</title>
```

### Change Logo Text
Edit `components/Header.tsx`:
```tsx
<h1>Your Marketplace</h1>
```

## 📊 Feature Overview

| Feature | Status | Test Method |
|---------|--------|-------------|
| Authentication | ✅ Ready | Login with demo credentials |
| Browse Items | ✅ Ready | View homepage |
| Search | ✅ Ready | Search for "mathematics" |
| Filters | ✅ Ready | Filter by CSE department |
| Post Items | ✅ Ready | Click "List Item" |
| Messaging | ✅ Ready | Click message icon |
| User Profile | ✅ Ready | Click user menu → Profile |
| Admin Dashboard | ✅ Ready | Login as admin |
| Reviews | ✅ Ready | Complete transaction → Submit review |
| Manage Listings | ✅ Ready | Profile → Manage Listings |

## 🔒 Security Notes

- All data is currently mock (client-side only)
- No real authentication implemented
- Passwords are not encrypted (demo only)
- Ready for backend integration

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Support

- Responsive design included
- Touch-friendly interface
- Mobile navigation menu

## 💾 Storage

Currently using:
- No persistent storage (reloads reset data)
- Mock data in component state
- Ready for backend/database integration

## 🔄 Updates

To update the codebase:
```bash
git pull origin main
npm install
npm start
```

## 🎓 Learning Resources

- **React:** [reactjs.org](https://reactjs.org)
- **TypeScript:** [typescriptlang.org](https://typescriptlang.org)
- **Tailwind CSS:** [tailwindcss.com](https://tailwindcss.com)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)

---

## 🎉 Success!

If you can see the marketplace with items, search works, and you can login - **you're all set!**

Happy coding! 🚀

---

**Need more details?** Check the other documentation files:
- `SETUP_GUIDE.md` - Detailed setup instructions
- `README.md` - Complete project documentation
- `DEPLOYMENT.md` - How to deploy online
- `FILE_STRUCTURE.md` - Complete file listing
