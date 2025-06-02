#!/bin/bash

# Manual Deployment Script for BINUS Server
# Use this if GitHub Actions cannot connect to the server

echo "=== Dinetap Manual Deployment Script ==="
echo "This script will deploy your application to the BINUS server"
echo ""

# Server details
SERVER_HOST="10.25.143.17"
SERVER_USER="usergc18"
SERVER_PASS="e3BnijmS"
PROJECT_DIR="/home/usergc18/dinetap-fullstack"

echo "Server: $SERVER_HOST"
echo "User: $SERVER_USER"
echo "Project Directory: $PROJECT_DIR"
echo ""

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo "Installing sshpass..."
    sudo apt-get update && sudo apt-get install -y sshpass
fi

echo "=== Step 1: Testing SSH Connection ==="
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "echo 'SSH connection successful'"

if [ $? -ne 0 ]; then
    echo "❌ SSH connection failed!"
    echo "Please check:"
    echo "1. Server is accessible: ping $SERVER_HOST"
    echo "2. SSH port 22 is open: nc -zv $SERVER_HOST 22"
    echo "3. Credentials are correct"
    exit 1
fi

echo "✅ SSH connection successful!"
echo ""

echo "=== Step 2: Deploying to Server ==="
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" << 'EOF'
    # Navigate to project directory
    cd /home/usergc18/dinetap-fullstack || mkdir -p /home/usergc18/dinetap-fullstack && cd /home/usergc18/dinetap-fullstack
    
    echo "Current directory: $(pwd)"
    
    # Pull latest code
    if [ -d ".git" ]; then
        echo "Updating existing repository..."
        git pull origin main
    else
        echo "Cloning repository..."
        git clone https://github.com/Qyuzet/dinetap-fullstack.git .
        git checkout main
    fi
    
    # Create environment file
    if [ ! -f ".env.example" ]; then
        echo "❌ .env.example not found!"
        exit 1
    fi
    
    cp .env.example .env
    echo "✅ Environment file created"
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    # Stop existing containers
    docker-compose down || true
    
    # Build and start containers
    echo "Building and starting containers..."
    docker-compose up -d --build
    
    # Check container status
    echo "Container status:"
    docker-compose ps
    
    echo "✅ Deployment completed!"
    echo ""
    echo "Access your application at:"
    echo "Frontend: https://e2425-wads-l4ccg4-client.csbihub.id:3035"
    echo "Backend: https://e2425-wads-l4ccg4-server.csbihub.id:3036"
EOF

echo ""
echo "=== Deployment Summary ==="
echo "✅ Manual deployment completed!"
echo ""
echo "To check logs:"
echo "sshpass -p '$SERVER_PASS' ssh $SERVER_USER@$SERVER_HOST 'cd $PROJECT_DIR && docker-compose logs -f'"
echo ""
echo "To restart services:"
echo "sshpass -p '$SERVER_PASS' ssh $SERVER_USER@$SERVER_HOST 'cd $PROJECT_DIR && docker-compose restart'"
