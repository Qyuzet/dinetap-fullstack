# Dinetap AI

AI-Powered Restaurant Ordering Platform - Full-Stack MERN Architecture with Docker Support

## 🏗️ Architecture

This is a full-stack application with separate frontend and backend services:

- **Frontend**: Next.js 14 with TypeScript (Port 3000)
- **Backend**: Node.js Express API (Port 5000)
- **Database**: MongoDB
- **AI**: Google Gemini integration

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dinetap-ai)

## 🏃‍♂️ Quick Start (Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Google Gemini API key

### 1. Clone Repository
```bash
git clone <repository-url>
cd dinetap-ai
```

### 2. Install All Dependencies
```bash
npm run install:all
```

### 3. Setup Environment Variables
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit with your configuration
```

### 4. Start Development
```bash
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 📁 Project Structure

```
dinetap-a/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic
│   │   └── utils/    # Utilities
│   └── package.json
├── frontend/         # Next.js application
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── lib/          # Frontend utilities
│   └── package.json
├── start-fullstack.sh # Start both services
└── stop-fullstack.sh  # Stop both services
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dinetap
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🎯 Features

- **AI-Powered Restaurant Generation**: Create restaurants with Gemini AI
- **Digital Ordering System**: Customer-facing ordering interface
- **Restaurant Management**: Complete dashboard for restaurant owners
- **Staff Interfaces**: Dedicated views for kitchen, cashier, and admin
- **Real-time Order Flow**: Orders flow seamlessly between cashier and kitchen
- **AI Assistant**: Customer support chatbot with menu awareness
- **Menu Management**: Full CRUD operations for menu items
- **Order Tracking**: Complete order lifecycle management

## 🛠️ Development Scripts

### Available Commands
```bash
npm run dev              # Start both backend + frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build            # Build for production
npm run start            # Start production
npm run install:all      # Install all dependencies
npm run clean            # Clean all node_modules
npm run lint             # Check code quality
npm run test             # Run tests
```

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. **Push to GitHub**
2. **Connect to Vercel**
3. **Set Environment Variables** in Vercel dashboard:
   ```bash
   # Required for both frontend and backend
   MONGODB_URI=your-mongodb-connection-string
   GEMINI_API_KEY=your-gemini-api-key
   NEXTAUTH_SECRET=your-nextauth-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
4. **Deploy** - Vercel will automatically build and deploy both frontend and backend

### Manual Deployment
- **Backend**: Railway, Heroku, or any Node.js hosting
- **Frontend**: Vercel, Netlify, or any Next.js hosting
- Update environment variables accordingly

## 📖 API Documentation

The backend provides RESTful APIs for:
- **Portals**: `/api/portals`
- **Menu Items**: `/api/menu-items`
- **Orders**: `/api/orders`
- **AI Services**: `/api/ai`

Visit http://localhost:5000/health for API status.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request
