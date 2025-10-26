# Complete Setup Guide for NITC Marketplace

This guide will help you set up the NITC Marketplace frontend on your local computer from scratch.

## Method 1: Using Create React App (Recommended for Beginners)

### Step 1: Install Node.js
1. Download and install Node.js from https://nodejs.org/ (LTS version recommended)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Create React App
```bash
npx create-react-app nitc-marketplace --template typescript
cd nitc-marketplace
```

### Step 3: Install Dependencies
```bash
npm install lucide-react sonner@2.0.3 react-hook-form@7.55.0
```

### Step 4: Set Up Project Structure

1. Create the following folder structure inside `src/`:
   ```
   src/
   ├── components/
   │   ├── ui/
   │   └── figma/
   ├── styles/
   └── utils/
   ```

2. Copy all files from this repository:
   - Copy `App.tsx` → `src/App.tsx`
   - Copy all files from `components/` → `src/components/`
   - Copy `styles/globals.css` → `src/styles/globals.css`

### Step 5: Update Configuration Files

**src/index.tsx**:
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
    <Toaster position="top-right" />
  </React.StrictMode>
);
```

**src/App.tsx** (Add Toaster at the end):
```tsx
// ... existing imports
import { Toaster } from "sonner@2.0.3";

export default function App() {
  // ... existing code
  
  return (
    <>
      {/* ... existing JSX */}
      <Toaster position="top-right" richColors />
    </>
  );
}
```

### Step 6: Create Missing Utility Files

**src/components/ui/utils.ts**:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**src/components/figma/ImageWithFallback.tsx**:
```tsx
import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function ImageWithFallback({ src, alt, className, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? 'https://via.placeholder.com/400x400?text=No+Image' : imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setHasError(true);
        setImgSrc('https://via.placeholder.com/400x400?text=No+Image');
      }}
      {...props}
    />
  );
}
```

**src/components/ui/use-mobile.ts**:
```typescript
import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

### Step 7: Update package.json

Add these additional dependencies if not already present:
```bash
npm install clsx tailwind-merge class-variance-authority
```

### Step 8: Configure Tailwind CSS v4

**public/index.html** - Update the head section:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="NITC Student Marketplace" />
    <title>NITC Marketplace</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### Step 9: Run the Application

```bash
npm start
```

Your app should now be running on `http://localhost:3000`

## Method 2: Using Vite (Faster Alternative)

### Step 1: Create Vite App
```bash
npm create vite@latest nitc-marketplace -- --template react-ts
cd nitc-marketplace
npm install
```

### Step 2: Install Dependencies
```bash
npm install lucide-react sonner@2.0.3 react-hook-form@7.55.0 clsx tailwind-merge class-variance-authority
```

### Step 3: Set Up Files
Same as Method 1, but:
- Update `src/main.tsx` instead of `src/index.tsx`
- Copy files to appropriate locations

**src/main.tsx**:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'
import { Toaster } from 'sonner@2.0.3'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </React.StrictMode>,
)
```

### Step 4: Run
```bash
npm run dev
```

## Troubleshooting

### Issue: Module not found errors
**Solution**: Make sure all files are in the correct directories and import paths match

### Issue: Tailwind classes not working
**Solution**: 
1. Verify `globals.css` is imported in your entry file
2. Check that Tailwind v4 syntax is correct in `globals.css`

### Issue: TypeScript errors
**Solution**:
1. Make sure all `.tsx` files use TypeScript
2. Install type definitions: `npm install --save-dev @types/react @types/react-dom`

### Issue: Images not loading
**Solution**: The app uses Unsplash URLs. Make sure you have internet connection.

### Issue: Sonner toasts not appearing
**Solution**: 
1. Verify `<Toaster />` component is added
2. Check that sonner@2.0.3 is installed correctly

## File Checklist

Before running, ensure you have all these files:

- [ ] `/src/App.tsx`
- [ ] `/src/index.tsx` or `/src/main.tsx`
- [ ] `/src/styles/globals.css`
- [ ] `/src/components/Header.tsx`
- [ ] `/src/components/CategoryFilter.tsx`
- [ ] `/src/components/ItemCard.tsx`
- [ ] `/src/components/ItemDetail.tsx`
- [ ] `/src/components/SignIn.tsx`
- [ ] `/src/components/SignUp.tsx`
- [ ] `/src/components/UserProfile.tsx`
- [ ] `/src/components/MessagingInterface.tsx`
- [ ] `/src/components/AdminDashboard.tsx`
- [ ] `/src/components/ListItemPage.tsx`
- [ ] `/src/components/ManageListings.tsx`
- [ ] `/src/components/SubmitReview.tsx`
- [ ] `/src/components/ViewRatings.tsx`
- [ ] `/src/components/TransactionComplete.tsx`
- [ ] `/src/components/PostItemDialog.tsx`
- [ ] `/src/components/ui/` (all shadcn components)
- [ ] `/src/components/figma/ImageWithFallback.tsx`

## Quick Test

After setup, test these features:

1. **Sign In**: Use `admin@nitc.ac.in` / `admin123` or `student.demo@nitc.ac.in` / `password123`
2. **Browse Items**: Should see 4 mock items on the homepage
3. **Search**: Try searching for "mathematics"
4. **Filter**: Filter by "Computer Science & Engineering"
5. **View Details**: Click on any item card
6. **Admin Dashboard**: Sign in as admin to access dashboard

## Next Steps

1. Test all features thoroughly
2. Customize styling in `globals.css`
3. Replace mock data with your backend API
4. Deploy to hosting service (Vercel, Netlify, etc.)

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure file paths are correct
4. Check that you're using compatible Node.js version (v16+)

---

Happy Coding! 🚀
