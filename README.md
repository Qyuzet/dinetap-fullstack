# Dinetap AI

AI-Powered Restaurant Ordering Platform - Full-Stack MERN Architecture with Docker Support

## Architecture

This is a full-stack application with separate frontend and backend services:

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth integration
- **State Management**: React hooks and context
- **AI Integration**: Google Gemini API for restaurant generation and customer support
- **Development Port**: 3000
- **Production Port**: 3035

### Backend (Express.js)
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens and session management
- **File Upload**: Multer for image handling
- **Security**: Helmet, CORS, rate limiting
- **AI Services**: Google Gemini API integration
- **Development Port**: 5000
- **Production Port**: 3036

### Database (MongoDB)
- **Database**: MongoDB for data persistence
- **Collections**: Portals, MenuItems, Orders, Users
- **Development**: Local MongoDB instance
- **Production**: Containerized MongoDB (Port 27018)

## Deployment Strategy

### Docker Containerization
The application is deployed using Docker containers with the following setup:
- **Frontend Container**: Next.js application with production build
- **Backend Container**: Express.js API with Node.js runtime
- **Database Container**: MongoDB with persistent volume storage
- **Orchestration**: Docker Compose for multi-container management

### CI/CD Pipeline
- **Repository**: GitHub with automated workflows
- **CI/CD**: GitHub Actions with self-hosted runner
- **Registry**: Docker Hub for container image storage
- **Deployment**: Automated deployment to university VPS server
- **Environment**: Production environment with secure environment variables

## Quick Start (Development)

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

## Features

### Core Functionality
- **AI-Powered Restaurant Generation**: Create restaurants with Gemini AI
- **Digital Ordering System**: Customer-facing ordering interface
- **Restaurant Management**: Complete dashboard for restaurant owners
- **Staff Interfaces**: Dedicated views for kitchen, cashier, and admin
- **Real-time Order Flow**: Orders flow seamlessly between cashier and kitchen
- **AI Assistant**: Customer support chatbot with menu awareness
- **Menu Management**: Full CRUD operations for menu items
- **Order Tracking**: Complete order lifecycle management

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Secure Google OAuth integration
- **File Upload**: Image handling for menu items and restaurant logos
- **API Security**: Rate limiting, CORS, and input validation
- **Error Handling**: Comprehensive error management and logging
- **Health Monitoring**: Container health checks and monitoring

## Development Scripts

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

## Production Deployment

### Docker Deployment (Current)
The application is deployed using Docker containers on a university VPS server:

1. **Automated CI/CD Pipeline**:
   - Push code to GitHub main branch
   - GitHub Actions triggers automated build
   - Docker images built and pushed to Docker Hub
   - Self-hosted runner deploys to university server

2. **Container Configuration**:
   ```bash
   # Frontend: https://e2425-wads-l4ccg4-client.csbihub.id:3035
   # Backend: https://e2425-wads-l4ccg4-client.csbihub.id:3036
   # MongoDB: Internal container network (Port 27018)
   ```

3. **Environment Variables** (managed via GitHub Secrets):
   ```bash
   MONGODB_URI=mongodb://admin:password123@mongodb:27017/dinetap?authSource=admin
   GEMINI_API_KEY=your-gemini-api-key
   NEXTAUTH_SECRET=your-nextauth-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   DOCKER_USERNAME=your-docker-hub-username
   ```

### Alternative Deployment Options
- **Vercel**: For serverless deployment (frontend + API routes)
- **Railway/Heroku**: For traditional hosting
- **AWS/GCP**: For cloud deployment with managed services

## API Documentation

The backend provides RESTful APIs for:

### Core Endpoints
- **Portals**: `/api/portals` - Restaurant portal management
- **Menu Items**: `/api/menu-items` - Menu item CRUD operations
- **Orders**: `/api/orders` - Order management and tracking
- **AI Services**: `/api/ai` - Gemini AI integration for restaurant generation

### Health Check
- **Development**: http://localhost:5000/health
- **Production**: https://e2425-wads-l4ccg4-client.csbihub.id:3036/health

### Authentication
- **Google OAuth**: Integrated via NextAuth.js
- **JWT Tokens**: For API authentication
- **Session Management**: Secure session handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test both frontend and backend thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is part of a university final project for BINUS University.

## Contact

- **Developer**: Riki Awal Syahputra
- **Email**: riqyuzet@gmail.com
- **GitHub**: [@Qyuzet](https://github.com/Qyuzet)
- **University**: BINUS University
