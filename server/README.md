# NITC Marketplace Backend

This is the Express.js backend for the NITC Marketplace application, with MongoDB as the database.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Student and admin roles
- **Item Management**: CRUD operations for marketplace items
- **Messaging System**: Real-time messaging between users
- **Review System**: User ratings and reviews
- **Transaction Management**: Track sales and rentals
- **Admin Dashboard**: Administrative controls and statistics

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/nitc-marketplace
JWT_SECRET=your_secure_secret_key_here
PORT=5000
NODE_ENV=development
```

## Running MongoDB

### Local MongoDB

If you have MongoDB installed locally:
```bash
mongod
```

### MongoDB with Docker

If you prefer using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with your Atlas connection string

## Starting the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update own profile (requires auth)
- `GET /api/users/:id/items` - Get user's items

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (requires auth)
- `PUT /api/items/:id` - Update item (requires auth)
- `DELETE /api/items/:id` - Delete item (requires auth)
- `GET /api/items/user/my-items` - Get own items (requires auth)

### Messages
- `GET /api/messages/conversations` - Get all conversations (requires auth)
- `GET /api/messages/conversation/:conversationId` - Get messages in conversation (requires auth)
- `POST /api/messages` - Send message (requires auth)
- `GET /api/messages/unread/count` - Get unread count (requires auth)
- `PUT /api/messages/conversation/:conversationId/read` - Mark as read (requires auth)

### Reviews
- `POST /api/reviews` - Create review (requires auth)
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/user/:userId/stats` - Get review statistics

### Transactions
- `POST /api/transactions` - Create transaction (requires auth)
- `PUT /api/transactions/:id/complete` - Complete transaction (requires auth)
- `PUT /api/transactions/:id/cancel` - Cancel transaction (requires auth)
- `GET /api/transactions/my-transactions` - Get own transactions (requires auth)
- `GET /api/transactions/:id` - Get transaction by ID (requires auth)

### Admin (requires admin role)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/items` - Get all items
- `DELETE /api/admin/items/:id` - Delete any item
- `GET /api/admin/transactions` - Get all transactions
- `PUT /api/admin/users/:id/verify` - Verify/unverify user

## Default Admin Credentials

For testing purposes, you can use these credentials:
- Email: `admin@nitc.ac.in`
- Password: `admin123`

**Note**: Change these credentials in production!

## Database Models

### User
- name, email, password (hashed)
- rollNumber, department, semester
- phone, hostel
- role (student/admin)
- rating, reviewCount

### Item
- title, description, price
- type (sale/rent/free)
- category (textbook/lab-equipment/stationery/other)
- department, semester, courseCode
- condition, images, location
- seller (ref: User)
- isAvailable, views

### Message
- conversationId
- sender, receiver (ref: User)
- content, itemId (ref: Item)
- isRead

### Review
- reviewedUser, reviewer (ref: User)
- transaction (ref: Transaction)
- rating (1-5), comment
- categories (communication, itemCondition, punctuality)

### Transaction
- item (ref: Item)
- seller, buyer (ref: User)
- amount, status (pending/completed/cancelled)
- completedDate

## Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error responses follow this format:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Testing the API

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- cURL

Example with cURL:
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@nitc.ac.in",
    "password": "password123",
    "rollNumber": "B200001CS",
    "department": "Computer Science & Engineering",
    "semester": "3",
    "phone": "9876543210"
  }'

# Get all items
curl http://localhost:5000/api/items
```

## Development Tips

1. **Hot Reload**: Use `npm run dev` for automatic server restart on file changes
2. **Database GUI**: Use [MongoDB Compass](https://www.mongodb.com/products/compass) to visualize your data
3. **API Testing**: Import the API endpoints into Postman for easy testing
4. **Logging**: Check console logs for debugging information

## Security Considerations

1. **Change JWT_SECRET**: Use a strong, random secret in production
2. **Environment Variables**: Never commit `.env` file to version control
3. **Password Policy**: Implement stronger password requirements in production
4. **Rate Limiting**: Consider adding rate limiting for API endpoints
5. **Input Validation**: All inputs are validated using express-validator
6. **CORS**: Configure CORS appropriately for production

## Deployment

### Deploy to Heroku

1. Create a Heroku account and install Heroku CLI
2. Create a new Heroku app:
```bash
heroku create nitc-marketplace-api
```

3. Add MongoDB addon:
```bash
heroku addons:create mongolab:sandbox
```

4. Set environment variables:
```bash
heroku config:set JWT_SECRET=your_secret_key
```

5. Deploy:
```bash
git push heroku main
```

### Deploy to Railway

1. Create a Railway account
2. Create a new project from GitHub
3. Add MongoDB database
4. Set environment variables in Railway dashboard
5. Deploy automatically on git push

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change PORT in .env file
- Or kill the process using port 5000:
```bash
# On Linux/Mac
lsof -ti:5000 | xargs kill -9

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Authentication Errors
- Check JWT_SECRET is set correctly
- Ensure token is being sent in Authorization header
- Token format: `Bearer <token>`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License
