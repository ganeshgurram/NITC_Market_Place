# API Reference - Quick Guide

Quick reference for NITC Marketplace API endpoints and frontend API utilities.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated requests require:
```
Authorization: Bearer <jwt_token>
```

Token is automatically managed by `utils/api.ts` using localStorage.

---

## Frontend API Usage

Import the API modules:
```typescript
import { 
  authAPI, 
  itemsAPI, 
  messagesAPI, 
  reviewsAPI, 
  transactionsAPI, 
  usersAPI,
  adminAPI 
} from './utils/api';
```

### Authentication API

```typescript
// Sign Up
const response = await authAPI.signup({
  name: string,
  email: string,
  password: string,
  rollNumber: string,
  department: string,
  semester: string,
  phone: string,
  hostel?: string
});
// Returns: { token, user }

// Sign In
const response = await authAPI.signin({
  email: string,
  password: string
});
// Returns: { token, user }

// Sign Out
authAPI.signout();
// Clears localStorage token

// Get Current User
const response = await authAPI.getCurrentUser();
// Returns: { user }
```

### Items API

```typescript
// Get All Items
const response = await itemsAPI.getAll({
  search?: string,
  department?: string,
  semester?: string,
  type?: string,
  category?: string,
  isAvailable?: boolean
});
// Returns: { items: [] }

// Get Single Item
const response = await itemsAPI.getById(itemId);
// Returns: { item }

// Create Item (Auth Required)
const response = await itemsAPI.create({
  title: string,
  description: string,
  price?: number,
  type: 'sale' | 'rent' | 'free',
  category: 'textbook' | 'lab-equipment' | 'stationery' | 'other',
  department: string,
  semester?: string,
  courseCode?: string,
  condition: 'new' | 'like-new' | 'good' | 'fair',
  images?: string[],
  location: string
});
// Returns: { item }

// Update Item (Auth Required)
const response = await itemsAPI.update(itemId, {
  // Any item fields to update
});
// Returns: { item }

// Delete Item (Auth Required)
await itemsAPI.delete(itemId);
// Returns: { message }

// Get My Items (Auth Required)
const response = await itemsAPI.getMyItems();
// Returns: { items: [] }
```

### Users API

```typescript
// Get User by ID
const response = await usersAPI.getById(userId);
// Returns: { user }

// Update Own Profile (Auth Required)
const response = await usersAPI.updateProfile({
  name?: string,
  phone?: string,
  hostel?: string,
  department?: string,
  semester?: string
});
// Returns: { user }

// Get User's Items
const response = await usersAPI.getUserItems(userId);
// Returns: { items: [] }
```

### Messages API

```typescript
// Get All Conversations (Auth Required)
const response = await messagesAPI.getConversations();
// Returns: { conversations: [] }

// Get Conversation Messages (Auth Required)
const response = await messagesAPI.getConversationMessages(conversationId);
// Returns: { messages: [] }

// Send Message (Auth Required)
const response = await messagesAPI.sendMessage({
  receiverId: string,
  content: string,
  itemId?: string
});
// Returns: { data: message }

// Get Unread Count (Auth Required)
const response = await messagesAPI.getUnreadCount();
// Returns: { count: number }

// Mark Conversation as Read (Auth Required)
await messagesAPI.markConversationAsRead(conversationId);
// Returns: { message }
```

### Reviews API

```typescript
// Create Review (Auth Required)
const response = await reviewsAPI.create({
  reviewedUserId: string,
  transactionId: string,
  rating: number (1-5),
  comment: string,
  categories?: {
    communication?: number (1-5),
    itemCondition?: number (1-5),
    punctuality?: number (1-5)
  }
});
// Returns: { review }

// Get User Reviews
const response = await reviewsAPI.getUserReviews(userId);
// Returns: { reviews: [] }

// Get User Review Stats
const response = await reviewsAPI.getUserStats(userId);
// Returns: { 
//   averageRating, 
//   totalReviews, 
//   ratingDistribution, 
//   categoryAverages 
// }
```

### Transactions API

```typescript
// Create Transaction (Auth Required)
const response = await transactionsAPI.create({
  itemId: string,
  sellerId: string,
  amount?: number
});
// Returns: { transaction }

// Complete Transaction (Auth Required)
const response = await transactionsAPI.complete(transactionId);
// Returns: { transaction }

// Cancel Transaction (Auth Required)
const response = await transactionsAPI.cancel(transactionId);
// Returns: { transaction }

// Get My Transactions (Auth Required)
const response = await transactionsAPI.getMyTransactions('buyer' | 'seller');
// Returns: { transactions: [] }

// Get Transaction by ID (Auth Required)
const response = await transactionsAPI.getById(transactionId);
// Returns: { transaction }
```

### Admin API (Admin Role Required)

```typescript
// Get Dashboard Stats
const response = await adminAPI.getStats();
// Returns: { 
//   stats, 
//   itemsByCategory, 
//   recentItems, 
//   recentTransactions 
// }

// Get All Users
const response = await adminAPI.getAllUsers();
// Returns: { users: [] }

// Get All Items
const response = await adminAPI.getAllItems();
// Returns: { items: [] }

// Delete Item
await adminAPI.deleteItem(itemId);
// Returns: { message }

// Get All Transactions
const response = await adminAPI.getAllTransactions();
// Returns: { transactions: [] }

// Verify User
const response = await adminAPI.verifyUser(userId, true/false);
// Returns: { user }
```

---

## Direct HTTP Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@nitc.ac.in",
  "password": "password123",
  "rollNumber": "B200001CS",
  "department": "Computer Science & Engineering",
  "semester": "3",
  "phone": "9876543210",
  "hostel": "H3"
}

Response: { token, user }
```

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@nitc.ac.in",
  "password": "password123"
}

Response: { token, user }
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response: { user }
```

### Items

#### Get All Items
```http
GET /api/items?search=math&department=CSE&type=sale
Response: { items: [] }
```

#### Get Single Item
```http
GET /api/items/:id
Response: { item }
```

#### Create Item
```http
POST /api/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced Mathematics",
  "description": "Great condition",
  "price": 800,
  "type": "sale",
  "category": "textbook",
  "department": "Computer Science & Engineering",
  "semester": "3",
  "courseCode": "MA2001",
  "condition": "like-new",
  "location": "Hostel H3"
}

Response: { item }
```

#### Update Item
```http
PUT /api/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 750,
  "isAvailable": false
}

Response: { item }
```

#### Delete Item
```http
DELETE /api/items/:id
Authorization: Bearer <token>

Response: { message }
```

### Messages

#### Get Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <token>

Response: { conversations: [] }
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "userId123",
  "content": "Is this available?",
  "itemId": "itemId123"
}

Response: { data: message }
```

### Reviews

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewedUserId": "userId123",
  "transactionId": "transactionId123",
  "rating": 5,
  "comment": "Great seller!",
  "categories": {
    "communication": 5,
    "itemCondition": 5,
    "punctuality": 4
  }
}

Response: { review }
```

#### Get User Reviews
```http
GET /api/reviews/user/:userId
Response: { reviews: [] }
```

### Transactions

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemId": "itemId123",
  "sellerId": "sellerId123",
  "amount": 800
}

Response: { transaction }
```

#### Complete Transaction
```http
PUT /api/transactions/:id/complete
Authorization: Bearer <token>

Response: { transaction }
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error title",
  "message": "Detailed error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `500` - Server Error

### Common Errors

```json
// Validation Error
{
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}

// Authentication Error
{
  "error": "No authentication token provided"
}

// Authorization Error
{
  "error": "Not authorized to update this item"
}

// Not Found
{
  "error": "Item not found"
}
```

---

## Data Models

### User
```typescript
{
  _id: string,
  name: string,
  email: string,
  rollNumber: string,
  department: string,
  semester: string,
  phone: string,
  hostel?: string,
  role: 'student' | 'admin',
  rating: number,
  reviewCount: number,
  isVerified: boolean,
  createdAt: Date
}
```

### Item
```typescript
{
  _id: string,
  title: string,
  description: string,
  price?: number,
  type: 'sale' | 'rent' | 'free',
  category: 'textbook' | 'lab-equipment' | 'stationery' | 'other',
  department: string,
  semester?: string,
  courseCode?: string,
  condition: 'new' | 'like-new' | 'good' | 'fair',
  images: string[],
  location: string,
  seller: User,
  isAvailable: boolean,
  views: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```typescript
{
  _id: string,
  conversationId: string,
  sender: User,
  receiver: User,
  content: string,
  itemId?: Item,
  isRead: boolean,
  createdAt: Date
}
```

### Review
```typescript
{
  _id: string,
  reviewedUser: User,
  reviewer: User,
  transaction: Transaction,
  rating: number (1-5),
  comment: string,
  categories: {
    communication?: number,
    itemCondition?: number,
    punctuality?: number
  },
  createdAt: Date
}
```

### Transaction
```typescript
{
  _id: string,
  item: Item,
  seller: User,
  buyer: User,
  amount: number,
  status: 'pending' | 'completed' | 'cancelled',
  completedDate?: Date,
  createdAt: Date
}
```

---

## Quick Tips

### Error Handling Pattern
```typescript
try {
  const response = await itemsAPI.create(itemData);
  // Success
  toast.success('Item created!');
} catch (error: any) {
  // Error
  console.error(error);
  toast.error(error.message || 'Failed');
}
```

### Loading Pattern
```typescript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const response = await itemsAPI.getAll();
    setData(response.items);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Authentication Check
```typescript
if (!localStorage.getItem('authToken')) {
  // User not authenticated
  toast.error('Please sign in');
  return;
}
```

---

## Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@nitc.ac.in","password":"test123","rollNumber":"B200001CS","department":"CSE","semester":"3","phone":"1234567890"}'

# Sign in and save token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nitc.ac.in","password":"test123"}' | jq -r '.token')

# Get items
curl http://localhost:5000/api/items

# Create item (with auth)
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Book","description":"Test","type":"sale","category":"textbook","department":"CSE","condition":"good","location":"H3","price":500}'
```

---

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/nitc-marketplace
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Need More Help?

- Full integration examples: `INTEGRATION_EXAMPLES.md`
- Setup guide: `BACKEND_SETUP.md`
- Integration guide: `BACKEND_INTEGRATION.md`
- Getting started: `GETTING_STARTED.md`
