# Dinetap AI Backend

Backend API server for the Dinetap AI restaurant ordering platform.

## Features

- **RESTful API** for restaurant portal management
- **MongoDB** database integration
- **AI-powered** restaurant data generation using Google Gemini
- **Order management** system with real-time status updates
- **Menu management** with categories and search functionality
- **Rate limiting** and security middleware
- **Input validation** and error handling
- **CORS** configuration for frontend integration

## Tech Stack

- **Node.js** with Express.js framework
- **MongoDB** with native driver
- **Google Gemini AI** for restaurant data generation
- **Express Validator** for input validation
- **Helmet** for security headers
- **Morgan** for request logging
- **CORS** for cross-origin requests

## API Endpoints

### Portals
- `GET /api/portals` - Get user portals
- `GET /api/portals/:id` - Get specific portal
- `POST /api/portals` - Create new portal
- `PUT /api/portals/:id` - Update portal
- `DELETE /api/portals/:id` - Delete portal
- `GET /api/portals/:id/menu` - Get portal menu
- `GET /api/portals/:id/categories` - Get menu categories

### Menu Items
- `GET /api/menu/:id` - Get menu item
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item
- `PATCH /api/menu/:id/availability` - Update availability

### Orders
- `GET /api/orders` - Get orders for portal
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/payment` - Update payment status
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/stats/:portalId` - Get order statistics

### AI Services
- `POST /api/ai/analyze-restaurant` - Analyze restaurant with AI
- `POST /api/ai/generate-portal` - Generate complete portal
- `POST /api/ai/suggest-menu-items` - Get menu suggestions
- `POST /api/ai/create-suggested-items` - Create items from suggestions

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
```

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run build` - No build step required for Node.js

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── Portal.js            # Portal data model
│   │   └── Order.js             # Order data model
│   ├── services/
│   │   ├── portalService.js     # Portal business logic
│   │   ├── menuService.js       # Menu business logic
│   │   ├── orderService.js      # Order business logic
│   │   └── aiService.js         # AI integration
│   ├── routes/
│   │   ├── portals.js           # Portal API routes
│   │   ├── menu.js              # Menu API routes
│   │   ├── orders.js            # Order API routes
│   │   └── ai.js                # AI API routes
│   └── server.js                # Main server file
├── package.json
├── .env
├── .gitignore
└── README.md
```

### API Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if applicable)
  "errors": [] // Validation errors (if applicable)
}
```

### Error Handling

The API includes comprehensive error handling:

- **Validation errors** (400) - Invalid input data
- **Not found errors** (404) - Resource not found
- **Server errors** (500) - Internal server errors
- **Rate limiting** (429) - Too many requests

### Security Features

- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation** on all endpoints
- **Error sanitization** in production

## Database Schema

### Portals Collection
```javascript
{
  _id: ObjectId,
  id: String,
  name: String,
  description: String,
  userId: String,
  colors: {
    primary: String,
    secondary: String,
    accent: String
  },
  status: String, // "active" | "inactive" | "draft"
  settings: {
    currency: String,
    taxRate: Number,
    deliveryFee: Number,
    minOrderForFreeDelivery: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Menu Items Collection
```javascript
{
  id: String,
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  tags: Array,
  available: Boolean,
  portalId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  id: String,
  portalId: String,
  customer: {
    name: String,
    email: String,
    phone: String,
    table: String
  },
  items: Array,
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  total: Number,
  status: String,
  paymentMethod: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,
  estimatedReadyTime: Date
}
```

## Deployment

### Production Deployment

1. **Set environment variables** for production
2. **Update CORS origins** for your frontend domain
3. **Configure MongoDB** connection for production
4. **Set up process manager** (PM2 recommended)
5. **Configure reverse proxy** (Nginx recommended)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
