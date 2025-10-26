# NITC Marketplace - Frontend Application

A comprehensive React-based marketplace platform for NITC students to exchange, sell, or donate academic resources.

## Features

### Student Features
- **Authentication**: Sign up and sign in with NITC email validation
- **Browse Listings**: Search and filter items by department, semester, and type
- **Post Items**: List textbooks, lab equipment, and stationery for sale, rent, or donation
- **Messaging**: Secure in-app messaging system to communicate with sellers/buyers
- **User Profiles**: View and manage your profile with ratings and reviews
- **Transaction Management**: Complete transactions and leave reviews
- **Review System**: Submit and view ratings for sellers (Communication, Item Condition, Transaction Process, Overall Experience)
- **Manage Listings**: Edit, delete, and update status of your listings

### Admin Features  
- **Admin Dashboard**: Comprehensive overview of platform statistics
- **User Management**: View, suspend, and manage user accounts
- **Listing Management**: Monitor and moderate all listings
- **Report Management**: Handle user-reported items and issues
- **Analytics**: Track user growth, transactions, and platform metrics

## Technology Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Recharts** - Charts (for admin dashboard)

## Project Structure

```
nitc-marketplace/
├── App.tsx                          # Main application component
├── components/
│   ├── AdminDashboard.tsx          # Admin dashboard with stats & management
│   ├── CategoryFilter.tsx          # Filter bar for listings
│   ├── Header.tsx                  # Navigation header
│   ├── ItemCard.tsx                # Individual item card component
│   ├── ItemDetail.tsx              # Detailed item view
│   ├── ListItemPage.tsx            # Form to list new items
│   ├── ManageListings.tsx          # Seller's listing management
│   ├── MessagingInterface.tsx      # Chat/messaging system
│   ├── PostItemDialog.tsx          # Dialog for posting items
│   ├── SignIn.tsx                  # Sign in page
│   ├── SignUp.tsx                  # Sign up page
│   ├── SubmitReview.tsx            # Review submission form
│   ├── TransactionComplete.tsx     # Transaction completion modal
│   ├── UserProfile.tsx             # User profile page
│   ├── ViewRatings.tsx             # View all ratings & reviews
│   └── ui/                         # shadcn UI components
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── ... (other shadcn components)
├── styles/
│   └── globals.css                 # Global styles & Tailwind config
└── README.md                       # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Create a new React project** (if starting from scratch):
   ```bash
   npx create-react-app nitc-marketplace --template typescript
   cd nitc-marketplace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install required packages**:
   ```bash
   # Core dependencies
   npm install lucide-react sonner@2.0.3 react-hook-form@7.55.0

   # shadcn/ui components are already included in the components/ui directory
   ```

4. **Copy all the files** from this repository into your project:
   - Copy `App.tsx` to `/src/App.tsx`
   - Copy all `components/` folder contents to `/src/components/`
   - Copy `styles/globals.css` to `/src/styles/globals.css`

5. **Update your main files**:

   **src/index.tsx** or **src/main.tsx**:
   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import './styles/globals.css';
   import App from './App';

   const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
   );
   root.render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

   **public/index.html** (add Sonner Toaster):
   Update your HTML to include the Sonner toaster by modifying the root div section:
   ```html
   <body>
     <div id="root"></div>
   </body>
   ```

6. **Add Sonner Toaster to App.tsx**:
   Make sure your App.tsx imports and uses the Toaster:
   ```tsx
   import { Toaster } from "sonner@2.0.3";
   
   // Add <Toaster /> at the root level of your app
   ```

### Running the Application

```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

## Demo Credentials

### Student Login
- Email: `student.demo@nitc.ac.in`
- Password: `password123`

### Admin Login
- Email: `admin@nitc.ac.in`
- Password: `admin123`

## Features Walkthrough

### For Students

1. **Sign Up / Sign In**
   - Use your NITC email (must end with @nitc.ac.in)
   - Complete the two-step registration process

2. **Browse Marketplace**
   - View all available listings
   - Filter by department, semester, and listing type
   - Search for specific items

3. **Post an Item**
   - Click "List Item" in the header
   - Fill in item details (2-step process)
   - Add images and set pickup location
   - Choose between sale, rent, or free donation

4. **View Item Details**
   - Click on any item card to see full details
   - View seller information and ratings
   - Contact seller via messaging

5. **Manage Your Listings**
   - Access from your profile
   - Edit, delete, or mark items as sold
   - View transaction history

6. **Complete Transactions & Reviews**
   - Use "Complete Transaction" button on item detail page (demo)
   - Submit detailed reviews with multiple rating categories
   - View all ratings received on your profile

7. **Messaging**
   - Click message icon in header
   - View all conversations
   - Send and receive messages

### For Admins

1. **Access Admin Dashboard**
   - Sign in with admin credentials
   - View platform statistics and analytics

2. **Manage Users**
   - View all registered users
   - Suspend or delete user accounts
   - Monitor user activity

3. **Manage Listings**
   - View all marketplace listings
   - Hide or delete inappropriate listings
   - Monitor reported items

4. **Handle Reports**
   - Review user-submitted reports
   - Take action on flagged content
   - Resolve disputes

## Customization

### Styling
- Modify `styles/globals.css` to change theme colors and typography
- Tailwind classes are used throughout for styling
- CSS variables control the color scheme

### Mock Data
- Currently uses mock data in components
- Replace with actual API calls when backend is ready
- Mock data locations:
  - Items: `App.tsx` (mockItems)
  - Conversations: `MessagingInterface.tsx`
  - Reviews: `ViewRatings.tsx`
  - Transactions: `ManageListings.tsx`

### Adding Backend Integration

When ready to integrate with a backend (e.g., Supabase):

1. **Authentication**
   - Replace mock auth in `SignIn.tsx` and `SignUp.tsx`
   - Implement real email validation
   - Store JWT tokens

2. **API Calls**
   - Create an API service layer
   - Replace mock data with actual API calls
   - Implement error handling

3. **Real-time Features**
   - Implement WebSocket for messaging
   - Add real-time listing updates
   - Notification system

## Known Limitations

- Currently frontend-only with mock data
- No actual file upload (uses placeholder images)
- No persistent data storage
- Email verification not implemented
- Payment integration not included

## Future Enhancements

- [ ] Backend integration with Supabase/Firebase
- [ ] Real file upload functionality
- [ ] Email verification system
- [ ] Push notifications
- [ ] Mobile responsive improvements
- [ ] Advanced search with filters
- [ ] Wishlist/favorites functionality
- [ ] Price negotiation feature
- [ ] Multi-language support

## Contributing

This is a student project for NITC. Contributions are welcome!

## License

This project is for educational purposes.

## Support

For issues or questions, please contact the development team.

---

Built with ❤️ for the NITC student community
