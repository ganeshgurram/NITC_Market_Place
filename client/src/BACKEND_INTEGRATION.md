# Backend Integration Guide

This guide explains how to integrate the Express.js backend with your NITC Marketplace React frontend.

## Quick Start

### 1. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start MongoDB (if using local)
mongod

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Setup Frontend Environment

Create a `.env` file in the root directory (where your React app is):

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Frontend

```bash
# In the root directory
npm install
npm run dev
```

## Integration Overview

The frontend now uses the `utils/api.ts` file to communicate with the backend. All API calls are centralized in this file.

### Authentication Flow

1. **Sign Up**: User registers → Backend creates user → Returns JWT token
2. **Sign In**: User logs in → Backend validates → Returns JWT token
3. **Token Storage**: Token saved in localStorage
4. **Protected Requests**: Token sent in Authorization header

### Example: Sign In Integration

In `SignIn.tsx`, replace mock authentication with:

```typescript
import { authAPI } from '../utils/api';

const handleSignIn = async (email: string, password: string) => {
  try {
    const response = await authAPI.signin({ email, password });
    onSignIn(response.user);
  } catch (error) {
    console.error('Sign in failed:', error);
    toast.error(error.message || 'Sign in failed');
  }
};
```

## API Usage Examples

### Authentication

```typescript
import { authAPI } from './utils/api';

// Sign up
const userData = {
  name: "John Doe",
  email: "john@nitc.ac.in",
  password: "password123",
  rollNumber: "B200001CS",
  department: "Computer Science & Engineering",
  semester: "3",
  phone: "9876543210",
  hostel: "H3"
};
const response = await authAPI.signup(userData);

// Sign in
const response = await authAPI.signin({ 
  email: "john@nitc.ac.in", 
  password: "password123" 
});

// Sign out
authAPI.signout();
```

### Items Management

```typescript
import { itemsAPI } from './utils/api';

// Get all items with filters
const { items } = await itemsAPI.getAll({
  search: "mathematics",
  department: "Computer Science & Engineering",
  type: "sale"
});

// Create new item
const itemData = {
  title: "Advanced Engineering Mathematics",
  description: "Excellent condition textbook",
  price: 800,
  type: "sale",
  category: "textbook",
  department: "Computer Science & Engineering",
  semester: "3",
  courseCode: "MA2001",
  condition: "like-new",
  location: "Hostel H3",
  images: ["https://example.com/image.jpg"]
};
const response = await itemsAPI.create(itemData);

// Update item
await itemsAPI.update(itemId, { price: 750, isAvailable: false });

// Delete item
await itemsAPI.delete(itemId);

// Get user's own items
const { items } = await itemsAPI.getMyItems();
```

### Messaging

```typescript
import { messagesAPI } from './utils/api';

// Get all conversations
const { conversations } = await messagesAPI.getConversations();

// Get messages in a conversation
const { messages } = await messagesAPI.getConversationMessages(conversationId);

// Send message
await messagesAPI.sendMessage({
  receiverId: "userId123",
  content: "Is this item still available?",
  itemId: "itemId123" // optional
});

// Get unread count
const { count } = await messagesAPI.getUnreadCount();
```

### Reviews

```typescript
import { reviewsAPI } from './utils/api';

// Create review
await reviewsAPI.create({
  reviewedUserId: "sellerId",
  transactionId: "transactionId",
  rating: 5,
  comment: "Great seller!",
  categories: {
    communication: 5,
    itemCondition: 5,
    punctuality: 4
  }
});

// Get user's reviews
const { reviews } = await reviewsAPI.getUserReviews(userId);

// Get review statistics
const stats = await reviewsAPI.getUserStats(userId);
```

### Transactions

```typescript
import { transactionsAPI } from './utils/api';

// Create transaction
const response = await transactionsAPI.create({
  itemId: "itemId",
  sellerId: "sellerId",
  amount: 800
});

// Complete transaction
await transactionsAPI.complete(transactionId);

// Get my transactions
const { transactions } = await transactionsAPI.getMyTransactions('buyer');
```

## Updating Components

### App.tsx

Replace mock data and operations with API calls:

```typescript
import { useState, useEffect } from 'react';
import { itemsAPI, authAPI } from './utils/api';

export default function App() {
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await authAPI.getCurrentUser();
          setCurrentUser(response.user);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        authAPI.signout();
      }
    };
    loadUser();
  }, []);

  // Load items
  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await itemsAPI.getAll({
          department: selectedDepartment,
          semester: selectedSemester,
          type: selectedType,
          search: searchQuery
        });
        setItems(response.items);
      } catch (error) {
        console.error('Failed to load items:', error);
      }
    };
    loadItems();
  }, [selectedDepartment, selectedSemester, selectedType, searchQuery]);

  // Handle post item
  const handlePostItem = async (newItem) => {
    try {
      const response = await itemsAPI.create(newItem);
      setItems([response.item, ...items]);
      toast.success('Item listed successfully!');
    } catch (error) {
      console.error('Failed to create item:', error);
      toast.error(error.message || 'Failed to create item');
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    authAPI.signout();
    setCurrentUser(null);
    setCurrentPage('marketplace');
    toast.success('Signed out successfully');
  };

  // ... rest of component
}
```

### SignIn.tsx

```typescript
import { authAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export const SignIn = ({ onSignIn, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.signin({ email, password });
      onSignIn(response.user);
    } catch (error) {
      console.error('Sign in failed:', error);
      toast.error(error.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### SignUp.tsx

```typescript
import { authAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export const SignUp = ({ onSignUp, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    semester: '',
    phone: '',
    hostel: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      onSignUp(response.user);
    } catch (error) {
      console.error('Sign up failed:', error);
      toast.error(error.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### ManageListings.tsx

```typescript
import { itemsAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

const handleItemUpdate = async (itemId, updates) => {
  try {
    const response = await itemsAPI.update(itemId, updates);
    onItemUpdate(itemId, response.item);
    toast.success('Item updated successfully');
  } catch (error) {
    console.error('Update failed:', error);
    toast.error(error.message || 'Failed to update item');
  }
};

const handleItemDelete = async (itemId) => {
  try {
    await itemsAPI.delete(itemId);
    onItemDelete(itemId);
    toast.success('Item deleted successfully');
  } catch (error) {
    console.error('Delete failed:', error);
    toast.error(error.message || 'Failed to delete item');
  }
};
```

### MessagingInterface.tsx

```typescript
import { useState, useEffect } from 'react';
import { messagesAPI } from '../utils/api';

export const MessagingInterface = ({ isOpen, onClose, currentUserId }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await messagesAPI.getConversationMessages(conversationId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (content) => {
    try {
      await messagesAPI.sendMessage({
        receiverId: selectedConversation.otherUser.id,
        content,
        itemId: selectedConversation.item?.id
      });
      loadMessages(selectedConversation.conversationId);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  // ... rest of component
};
```

## Error Handling

Always wrap API calls in try-catch blocks and provide user feedback:

```typescript
try {
  const response = await itemsAPI.create(itemData);
  toast.success('Item created successfully');
  // Update UI
} catch (error) {
  console.error('API Error:', error);
  toast.error(error.message || 'Something went wrong');
}
```

## CORS Configuration

If you encounter CORS errors, ensure your backend has CORS enabled for your frontend URL.

In `backend/server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

## Testing the Integration

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `npm run dev`
3. **Test Sign Up**: Create a new account
4. **Test Sign In**: Login with credentials
5. **Test Item Creation**: Post a new item
6. **Test Filtering**: Use filters to find items
7. **Test Messaging**: Send messages between users
8. **Test Admin**: Login as admin (admin@nitc.ac.in / admin123)

## Common Issues and Solutions

### Issue: "Network Error" or "Failed to fetch"
**Solution**: 
- Ensure backend is running on correct port
- Check VITE_API_URL in frontend .env
- Verify CORS is configured

### Issue: "401 Unauthorized"
**Solution**:
- Check if token is stored in localStorage
- Verify token is valid and not expired
- Re-login to get new token

### Issue: "Token expired"
**Solution**:
- Implement token refresh logic
- Or simply re-login

### Issue: Items not loading
**Solution**:
- Check browser console for errors
- Verify API endpoint is correct
- Check if items exist in database

## Next Steps

1. **Add Loading States**: Show spinners while API calls are in progress
2. **Add Error Boundaries**: Catch and handle React errors gracefully
3. **Implement Pagination**: For large lists of items
4. **Add Real-time Features**: Use WebSockets for live messaging
5. **Optimize Performance**: Add caching and memoization
6. **Add Image Upload**: Integrate with cloud storage (Cloudinary, AWS S3)

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use production MongoDB (Atlas, etc.)
- [ ] Configure CORS for production domain
- [ ] Add rate limiting
- [ ] Implement proper logging
- [ ] Add monitoring (Sentry, LogRocket)
- [ ] Enable HTTPS
- [ ] Add input sanitization
- [ ] Implement file upload limits
- [ ] Add database backups
- [ ] Set up CI/CD pipeline

## Support

If you encounter any issues:
1. Check the backend logs for errors
2. Use browser DevTools Network tab to inspect API calls
3. Verify environment variables are set correctly
4. Check MongoDB connection

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)
- [React Query (for better API management)](https://tanstack.com/query/latest)
