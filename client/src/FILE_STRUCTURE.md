# Complete File Structure for NITC Marketplace

This document lists ALL files you need to copy to your local computer to run the NITC Marketplace frontend.

## Directory Structure

```
nitc-marketplace/
│
├── public/
│   ├── index.html                 # Main HTML file
│   └── favicon.ico                # Website icon
│
├── src/
│   ├── index.tsx                  # Application entry point
│   ├── App.tsx                    # Main application component
│   │
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── Header.tsx
│   │   ├── ItemCard.tsx
│   │   ├── ItemDetail.tsx
│   │   ├── ListItemPage.tsx
│   │   ├── ManageListings.tsx
│   │   ├── MessagingInterface.tsx
│   │   ├── PostItemDialog.tsx
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── SubmitReview.tsx
│   │   ├── TransactionComplete.tsx
│   │   ├── UserProfile.tsx
│   │   ├── ViewRatings.tsx
│   │   │
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   │
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       ├── tooltip.tsx
│   │       ├── use-mobile.ts
│   │       └── utils.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── utils/
│       └── unsplash.ts (optional)
│
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── SETUP_GUIDE.md
├── DEPLOYMENT.md
└── FILE_STRUCTURE.md (this file)
```

## Essential Files to Copy

### Root Level Files

1. **package.json**
   - Location: Root directory
   - Purpose: Project dependencies and scripts
   - Action: Use the provided example, rename to `package.json`

2. **.gitignore**
   ```
   # dependencies
   /node_modules
   /.pnp
   .pnp.js

   # testing
   /coverage

   # production
   /build

   # misc
   .DS_Store
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local

   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   ```

3. **tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "target": "es5",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noFallthroughCasesInSwitch": true,
       "module": "esnext",
       "moduleResolution": "node",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx"
     },
     "include": ["src"]
   }
   ```

### Public Folder

4. **public/index.html**
   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <meta name="theme-color" content="#000000" />
       <meta name="description" content="NITC Student Marketplace - Buy, sell, and exchange academic resources" />
       <title>NITC Marketplace</title>
     </head>
     <body>
       <noscript>You need to enable JavaScript to run this app.</noscript>
       <div id="root"></div>
     </body>
   </html>
   ```

### Source Files

5. **src/index.tsx**
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

6. **src/App.tsx**
   - Copy from the provided file
   - Main application logic and routing

7. **src/styles/globals.css**
   - Copy from the provided file
   - Contains Tailwind v4 configuration and global styles

### Components

All files in `src/components/` should be copied exactly as provided:

**Main Components (14 files):**
- AdminDashboard.tsx
- CategoryFilter.tsx
- Header.tsx
- ItemCard.tsx
- ItemDetail.tsx
- ListItemPage.tsx
- ManageListings.tsx
- MessagingInterface.tsx
- PostItemDialog.tsx
- SignIn.tsx
- SignUp.tsx
- SubmitReview.tsx
- TransactionComplete.tsx
- UserProfile.tsx
- ViewRatings.tsx

**UI Components (45+ files in components/ui/):**
- All shadcn/ui components as listed above
- utils.ts
- use-mobile.ts

**Figma Components (1 file in components/figma/):**
- ImageWithFallback.tsx

## File Size Reference

Approximate sizes to verify correct copying:

```
App.tsx                    ~18 KB
globals.css                ~6 KB
AdminDashboard.tsx         ~12 KB
CategoryFilter.tsx         ~4 KB
Header.tsx                 ~5 KB
ItemCard.tsx               ~5 KB
ItemDetail.tsx             ~7 KB
ListItemPage.tsx           ~14 KB
ManageListings.tsx         ~12 KB
MessagingInterface.tsx     ~10 KB
SignIn.tsx                 ~8 KB
SignUp.tsx                 ~11 KB
SubmitReview.tsx           ~10 KB
TransactionComplete.tsx    ~3 KB
UserProfile.tsx            ~11 KB
ViewRatings.tsx            ~12 KB
```

## Verification Checklist

After copying all files, verify:

- [ ] All 14 main component files present
- [ ] All UI component files present (45+ files)
- [ ] globals.css in styles folder
- [ ] ImageWithFallback.tsx in figma folder
- [ ] index.tsx or main.tsx present
- [ ] package.json present
- [ ] tsconfig.json present
- [ ] .gitignore present
- [ ] public/index.html present

## Installation Order

1. **Create project folder**
   ```bash
   mkdir nitc-marketplace
   cd nitc-marketplace
   ```

2. **Initialize React app**
   ```bash
   npx create-react-app . --template typescript
   ```

3. **Copy all files** from the file structure above

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the app**
   ```bash
   npm start
   ```

## Missing Files Helper

If you get "Module not found" errors:

**Error: Cannot find module './components/ui/utils'**
- Create `src/components/ui/utils.ts` with utility functions

**Error: Cannot find module './components/figma/ImageWithFallback'**
- Create `src/components/figma/ImageWithFallback.tsx` with image component

**Error: Cannot find module 'sonner'**
- Run: `npm install sonner@2.0.3`

**Error: Cannot find module 'lucide-react'**
- Run: `npm install lucide-react`

## Quick Copy Command (Linux/Mac)

If you have all files in a source directory:

```bash
# Copy all component files
cp -r source/components/* src/components/

# Copy styles
cp source/styles/globals.css src/styles/

# Copy App.tsx
cp source/App.tsx src/

# Copy package.json
cp source/package.json .
```

## Windows PowerShell Copy Commands

```powershell
# Copy all component files
Copy-Item -Path "source\components\*" -Destination "src\components\" -Recurse

# Copy styles
Copy-Item -Path "source\styles\globals.css" -Destination "src\styles\"

# Copy App.tsx
Copy-Item -Path "source\App.tsx" -Destination "src\"

# Copy package.json
Copy-Item -Path "source\package.json" -Destination "."
```

## Archive Creation

To create a distributable archive:

```bash
# Create zip file (exclude node_modules and build)
zip -r nitc-marketplace.zip . -x "node_modules/*" -x "build/*" -x ".git/*"
```

## Download Source

All source files are available from the current working environment and need to be copied to your local machine manually.

---

Make sure you have all these files before running `npm start`!
