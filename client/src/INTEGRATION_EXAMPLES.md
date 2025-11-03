# Integration Examples

This document provides specific code examples for integrating your frontend components with the backend API.

## Table of Contents

- [App.tsx Integration](#apptsx-integration)
- [Item Management](#item-management)
- [Messaging Integration](#messaging-integration)
- [Reviews Integration](#reviews-integration)
- [Admin Dashboard](#admin-dashboard)

## App.tsx Integration

Here's how to update your main App.tsx to use the backend API:

### 1. Add imports

```typescript
import { useState, useEffect } from "react";
import { itemsAPI, authAPI } from "./utils/api";
import { toast } from "sonner@2.0.3";
```

### 2. Load user on mount

```typescript
// Inside App component, add this useEffect
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
      // Token expired or invalid, clear it
      authAPI.signout();
    }
  };
  loadUser();
}, []);
```

### 3. Load items with filters

```typescript
// Add this useEffect to load items
useEffect(() => {
  const loadItems = async () => {
    try {
      const filters: any = {};
      
      if (searchQuery) filters.search = searchQuery;
      if (selectedDepartment && selectedDepartment !== 'All Departments') {
        filters.department = selectedDepartment;
      }
      if (selectedSemester && selectedSemester !== 'All Semesters') {
        filters.semester = selectedSemester;
      }
      if (selectedType && selectedType !== 'All Types') {
        filters.type = selectedType;
      }

      const response = await itemsAPI.getAll(filters);
      setItems(response.items);
    } catch (error) {
      console.error('Failed to load items:', error);
      toast.error('Failed to load items');
    }
  };

  if (currentUser) {
    loadItems();
  }
}, [currentUser, searchQuery, selectedDepartment, selectedSemester, selectedType]);
```

### 4. Update handlePostItem

```typescript
const handlePostItem = async (newItem: any) => {
  if (!currentUser) return;
  
  try {
    const response = await itemsAPI.create(newItem);
    setItems([response.item, ...items]);
    toast.success('Item listed successfully!');
  } catch (error: any) {
    console.error('Failed to create item:', error);
    toast.error(error.message || 'Failed to create item');
  }
};
```

### 5. Update handleSignOut

```typescript
const handleSignOut = () => {
  authAPI.signout();
  setCurrentUser(null);
  setCurrentPage("marketplace");
  setSelectedItem(null);
  setShowPostDialog(false);
  setShowMessages(false);
  setItems([]);
  toast.success("Signed out successfully");
};
```

### 6. Update handleItemUpdate

```typescript
const handleItemUpdate = async (itemId: string, updates: Partial<Item>) => {
  try {
    const response = await itemsAPI.update(itemId, updates);
    setItems(prev => prev.map(item => 
      item.id === itemId ? response.item : item
    ));
    toast.success('Item updated successfully');
  } catch (error: any) {
    console.error('Failed to update item:', error);
    toast.error(error.message || 'Failed to update item');
  }
};
```

### 7. Update handleItemDelete

```typescript
const handleItemDelete = async (itemId: string) => {
  try {
    await itemsAPI.delete(itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item deleted successfully');
  } catch (error: any) {
    console.error('Failed to delete item:', error);
    toast.error(error.message || 'Failed to delete item');
  }
};
```

## Item Management

### ManageListings.tsx

```typescript
import { useState, useEffect } from 'react';
import { itemsAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function ManageListings({ onBack, currentUser }: ManageListingsProps) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserItems();
  }, []);

  const loadUserItems = async () => {
    try {
      const response = await itemsAPI.getMyItems();
      setItems(response.items);
    } catch (error) {
      console.error('Failed to load items:', error);
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (itemId: string, updates: any) => {
    try {
      const response = await itemsAPI.update(itemId, updates);
      setItems(prev => prev.map(item => 
        item._id === itemId ? response.item : item
      ));
      toast.success('Item updated successfully');
    } catch (error: any) {
      console.error('Update failed:', error);
      toast.error(error.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemsAPI.delete(itemId);
      setItems(prev => prev.filter(item => item._id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error.message || 'Failed to delete item');
    }
  };

  // Rest of component...
}
```

### ItemDetail.tsx

```typescript
import { useState, useEffect } from 'react';
import { itemsAPI, transactionsAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function ItemDetail({ itemId, onBack }: ItemDetailProps) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    try {
      const response = await itemsAPI.getById(itemId);
      setItem(response.item);
    } catch (error) {
      console.error('Failed to load item:', error);
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionComplete = async () => {
    try {
      const response = await transactionsAPI.create({
        itemId: item._id,
        sellerId: item.seller._id,
        amount: item.price
      });

      await transactionsAPI.complete(response.transaction._id);
      
      toast.success('Transaction completed successfully!');
      // Update item availability
      setItem(prev => ({ ...prev, isAvailable: false }));
    } catch (error: any) {
      console.error('Transaction failed:', error);
      toast.error(error.message || 'Failed to complete transaction');
    }
  };

  // Rest of component...
}
```

## Messaging Integration

### MessagingInterface.tsx

```typescript
import { useState, useEffect } from 'react';
import { messagesAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function MessagingInterface({ isOpen, onClose, currentUserId }: MessagingInterfaceProps) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      toast.error('Failed to load conversations');
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await messagesAPI.getConversationMessages(conversationId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.conversationId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      await messagesAPI.sendMessage({
        receiverId: selectedConversation.otherUser._id,
        content: newMessage,
        itemId: selectedConversation.item?._id
      });

      setNewMessage('');
      await loadMessages(selectedConversation.conversationId);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
}
```

### Header.tsx - Unread Count

```typescript
import { useState, useEffect } from 'react';
import { messagesAPI } from '../utils/api';

export function Header({ currentUser, ...props }: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      loadUnreadCount();
      // Poll for new messages every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const loadUnreadCount = async () => {
    try {
      const response = await messagesAPI.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  // Pass unreadCount to messaging button
  // Rest of component...
}
```

## Reviews Integration

### SubmitReview.tsx

```typescript
import { useState } from 'react';
import { reviewsAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function SubmitReview({ transaction, onBack, onSubmit }: SubmitReviewProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState({
    communication: 5,
    itemCondition: 5,
    punctuality: 5
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reviewsAPI.create({
        reviewedUserId: transaction.seller._id,
        transactionId: transaction._id,
        rating,
        comment,
        categories
      });

      toast.success('Review submitted successfully!');
      onSubmit();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
}
```

### ViewRatings.tsx

```typescript
import { useState, useEffect } from 'react';
import { reviewsAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function ViewRatings({ userId, userName, onBack }: ViewRatingsProps) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [userId]);

  const loadReviews = async () => {
    try {
      const response = await reviewsAPI.getUserReviews(userId);
      setReviews(response.reviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const loadStats = async () => {
    try {
      const response = await reviewsAPI.getUserStats(userId);
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
}
```

## Admin Dashboard

### AdminDashboard.tsx

```typescript
import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, usersRes, itemsRes, transactionsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllItems(),
        adminAPI.getAllTransactions()
      ]);

      setStats(statsRes.stats);
      setUsers(usersRes.users);
      setItems(itemsRes.items);
      setTransactions(transactionsRes.transactions);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await adminAPI.deleteItem(itemId);
      setItems(prev => prev.filter(item => item._id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete item:', error);
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      await adminAPI.verifyUser(userId, isVerified);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isVerified } : user
      ));
      toast.success(`User ${isVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error: any) {
      console.error('Failed to verify user:', error);
      toast.error(error.message || 'Failed to verify user');
    }
  };

  // Rest of component...
}
```

## Important Notes

### MongoDB ObjectIds

MongoDB uses `_id` instead of `id`. When working with items from the database:

```typescript
// Access ID like this:
item._id

// Or map it when displaying:
const displayItem = {
  ...item,
  id: item._id
};
```

### Error Handling Pattern

Always use this pattern for API calls:

```typescript
const performAction = async () => {
  setLoading(true);
  try {
    const response = await someAPI.action();
    // Update state
    toast.success('Action successful');
  } catch (error: any) {
    console.error('Action failed:', error);
    toast.error(error.message || 'Action failed');
  } finally {
    setLoading(false);
  }
};
```

### Loading States

Show loading indicators while API calls are in progress:

```typescript
{loading ? (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
) : (
  // Your content
)}
```

### Authentication Check

For protected actions, always check if user is authenticated:

```typescript
const handleAction = async () => {
  if (!currentUser) {
    toast.error('Please sign in to continue');
    return;
  }
  // Proceed with action
};
```

## Testing Checklist

- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Create new item listing
- [ ] Update existing item
- [ ] Delete item
- [ ] Search and filter items
- [ ] Send messages
- [ ] View conversations
- [ ] Submit review
- [ ] View user ratings
- [ ] Complete transaction
- [ ] Admin dashboard access
- [ ] Admin delete items
- [ ] Admin verify users

## Next Steps

1. Test each integration thoroughly
2. Add error boundaries for better error handling
3. Implement proper loading states
4. Add optimistic UI updates
5. Consider using React Query for better cache management
6. Add real-time updates with WebSockets
7. Implement image upload functionality
