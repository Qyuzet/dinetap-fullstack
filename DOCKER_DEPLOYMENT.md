# 🐳 Docker Deployment Guide

## Quick Start

### Local Development with Docker
```bash
# Build and start all services
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Production Deployment

#### Option A: Manual Deployment (Recommended)

If GitHub Actions cannot connect to the university server, use the manual deployment script:

```bash
# Make script executable
chmod +x deploy-manual.sh

# Run deployment
./deploy-manual.sh
```

#### Option B: Direct SSH Deployment

#### 1. Server Setup (SSH to your server)
```bash
ssh usergc18@10.25.143.17
# Password: e3BnijmS
```

#### 2. Install Docker & Docker Compose
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again
exit
```

#### 3. Clone and Deploy
```bash
# SSH back to server
ssh usergc18@10.25.143.17

# Clone repository
git clone https://github.com/Qyuzet/dinetap-fullstack.git
cd dinetap-fullstack

# Create environment file
cp .env.example .env

# Edit environment variables with your actual credentials
nano .env

# Start services
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

## Service URLs

### Development
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017

### Production (Your Server)
- Frontend: https://e2425-wads-l4ccg4-client.csbihub.id:3035
- Backend API: https://e2425-wads-l4ccg4-server.csbihub.id:3036/api
- Internal MongoDB: mongodb://mongodb:27017

## Environment Variables

You need to set these in your .env file:

```bash
# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Gemini AI (Get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Docker Commands

```bash
# Build images
docker-compose build

# Start services (detached)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart specific service
docker-compose restart [service_name]

# Remove everything (including volumes)
docker-compose down -v --rmi all

# Check running containers
docker ps

# Execute command in container
docker exec -it dinetap-backend bash
docker exec -it dinetap-frontend sh
```

## CI/CD Pipeline

The GitHub Actions workflow will:
1. Run tests
2. Build Docker images
3. Push to Docker Hub
4. Deploy to your server

### Setup GitHub Secrets:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password
- `REMOTE_HOST`: 10.25.143.17
- `REMOTE_USER`: usergc18
- `REMOTE_PASSWORD`: e3BnijmS

## Troubleshooting

### Check service health
```bash
docker-compose ps
curl http://localhost:5000/health
curl http://localhost:3000
```

### View specific service logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Restart services
```bash
docker-compose restart
```

### Clean restart
```bash
docker-compose down
docker-compose up -d
```

## Port Configuration for Your Server

Update these ports in docker-compose.yml for your server:

```yaml
# Frontend service
ports:
  - "3035:3000"  # Your assigned client port

# Backend service  
ports:
  - "3036:5000"  # Your assigned server port
```

## Final Steps

1. **Update .env file** with your actual credentials
2. **Configure ports** to match your server assignment
3. **Test locally** with `docker-compose up`
4. **Deploy to server** using the deployment guide
5. **Setup CI/CD** with GitHub secrets
