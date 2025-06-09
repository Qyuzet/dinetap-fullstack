# Dinetap AI - Restaurant Portal Generation Platform

A comprehensive AI-powered platform for creating customized restaurant ordering portals with intelligent design generation, menu management, and seamless customer experience.

## Overview

Dinetap AI revolutionizes restaurant digital presence by automatically generating branded ordering portals through AI-powered website analysis or manual configuration. The platform creates complete restaurant ecosystems with customer ordering interfaces, cashier management systems, and kitchen order tracking.

### Key Capabilities

- **AI-Powered Portal Generation**: Analyze restaurant websites to extract branding, colors, and menu items
- **Manual Portal Creation**: Custom portal setup with design preferences and manual menu management
- **Multi-Interface System**: Dedicated views for customers, cashiers, and kitchen staff
- **Real-time Order Management**: Live order tracking with status updates and notifications
- **Intelligent Design System**: AI-generated color schemes and responsive layouts
- **Comprehensive Analytics**: Order patterns, customer preferences, and operational insights

## Features

### Core Features

- **Portal Management**
  - AI-powered website analysis and portal generation
  - Manual portal creation with design preferences
  - Real-time color scheme customization
  - Responsive design for all devices

- **Menu Management**
  - AI-generated menu items from website analysis
  - Manual menu item creation and editing
  - Category-based organization
  - Image support with fallback system
  - Availability and pricing management

- **Order Processing**
  - Customer ordering interface with cart management
  - Real-time order status tracking
  - Payment integration support
  - Order history and analytics

- **Multi-User Interfaces**
  - Customer portal for ordering
  - Cashier interface for order management
  - Kitchen display for order preparation
  - Admin dashboard for portal management

### Advanced Features

- **AI Integration**
  - Google Gemini AI for content generation
  - Intelligent color scheme extraction
  - Menu item suggestions and optimization
  - Chat assistant for customer support

- **Performance Optimization**
  - Rate limiting and connection pooling
  - Image optimization and caching
  - Database query optimization
  - Retry logic for reliability

- **Security & Reliability**
  - NextAuth.js authentication
  - Input validation and sanitization
  - Error handling and logging
  - Graceful degradation

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Authentication**: NextAuth.js
- **State Management**: React Context
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **AI Integration**: Google Generative AI (Gemini)
- **Authentication**: JWT tokens
- **Validation**: Express Validator
- **Rate Limiting**: Express Rate Limit

### Infrastructure
- **Deployment**: Docker containers
- **CI/CD**: GitHub Actions
- **Hosting**: BINUS University servers
- **Database**: MongoDB Atlas cloud
- **Image Storage**: Next.js Image optimization

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - Customer UI   │    │ - API Routes    │    │ - Portals       │
│ - Cashier UI    │    │ - AI Services   │    │ - Menu Items    │
│ - Kitchen UI    │    │ - Auth System   │    │ - Orders        │
│ - Admin Panel   │    │ - Rate Limiting │    │ - Users         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│  External APIs  │◄─────────────┘
                        │                 │
                        │ - Google Gemini │
                        │ - NextAuth      │
                        │ - Image APIs    │
                        └─────────────────┘
```

## Installation

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Google Cloud Platform account (for Gemini AI)
- Docker and Docker Compose

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Qyuzet/dinetap-fullstack.git
cd dinetap-fullstack
```

2. **Install dependencies**
```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

3. **Environment Configuration**

Create `.env` files in both frontend and backend directories:

**Frontend (.env.local)**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Dinetap AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dinetap
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. **Start development servers**
```bash
# Start backend (in backend directory)
npm run dev

# Start frontend (in frontend directory)
npm run dev
```

## Deployment

### Docker Deployment

The application is containerized for easy deployment:

1. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

### BINUS University Server Deployment

The application is deployed on BINUS university servers with:

- **Frontend**: https://e2425-wads-l4ccg4-client.csbihub.id
- **Backend**: https://e2425-wads-l4ccg4-server.csbihub.id
- **CI/CD**: GitHub Actions for automated deployment
- **Monitoring**: Health checks and logging

## API Documentation

### Portal Management Endpoints

#### Get User Portals
```http
GET /api/portals?userId={userId}
```

#### Create Portal
```http
POST /api/portals
Content-Type: application/json

{
  "name": "Restaurant Name",
  "description": "Restaurant Description",
  "userId": "user@example.com",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF",
    "accent": "#DBEAFE"
  }
}
```

### Menu Management Endpoints

#### Get Menu Items
```http
GET /api/portals/{portalId}/menu
```

#### Create Menu Item
```http
POST /api/menu
Content-Type: application/json

{
  "name": "Menu Item Name",
  "description": "Item Description",
  "price": 12.99,
  "category": "Main Course",
  "portalId": "portal-id",
  "available": true
}
```

### AI Endpoints

#### Generate Portal from Website
```http
POST /api/ai/generate-portal
Content-Type: application/json

{
  "websiteUrl": "https://restaurant-website.com",
  "restaurantName": "Restaurant Name"
}
```

## Usage Guide

### Creating a Portal

#### Method 1: Website Analysis
1. Navigate to "Create Portal" in the dashboard
2. Select "Website Analysis" tab
3. Enter your restaurant's website URL
4. Provide restaurant name
5. Click "Create from Website"
6. AI will analyze the website and generate portal with colors and menu items

#### Method 2: Manual Setup
1. Navigate to "Create Portal" in the dashboard
2. Select "Manual Setup" tab
3. Enter restaurant name and description
4. Provide design preferences (colors, style, etc.)
5. Click "Create Portal"
6. AI will generate colors based on your preferences
7. Add menu items manually in the portal management interface

### Managing Menu Items

1. **Access Portal Management**: Go to Dashboard > Select Portal > Menu Items tab
2. **Add Items**: Click "Add Menu Item" and fill in details
3. **Edit Items**: Click edit icon on existing items
4. **Categories**: Organize items by categories (Appetizers, Main Courses, etc.)
5. **Availability**: Toggle item availability on/off
6. **Images**: Add images or use fallback images

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Make changes**: Implement your feature or fix
4. **Test thoroughly**: Ensure all tests pass
5. **Commit changes**: `git commit -m "Add new feature"`
6. **Push to branch**: `git push origin feature/new-feature`
7. **Create Pull Request**: Submit PR for review

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- **Email**: riqyuzet@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/Qyuzet/dinetap-fullstack/issues)

## Acknowledgments

- **BINUS University**: For providing deployment infrastructure
- **Google Gemini AI**: For AI-powered content generation
- **Next.js Team**: For the excellent React framework
- **MongoDB**: For reliable database services

---

**Dinetap AI** - Transforming restaurant digital presence through intelligent automation.
