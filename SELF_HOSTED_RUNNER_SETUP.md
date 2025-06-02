# Self-Hosted GitHub Actions Runner Setup

Follow these steps to set up a self-hosted GitHub Actions runner on the BINUS server.

## Step 1: Access the Server

1. Visit: https://csbiweb-ssh.csbihub.id/
2. Enter your BINUS email (binus.ac.id or binus.edu)
3. Click "Send me a code"
4. Check your email for verification code
5. Enter verification code and sign in
6. Enter your server username and password:
   - User: `usergc18`
   - Password: `e3BnijmS`

## Step 2: Setup Docker Rootless

Run these commands in the server terminal:

```bash
# Install Docker rootless
dockerd-rootless-setuptool.sh install

# Press CTRL + C after setup finishes

# Configure Docker service
systemctl --user daemon-reexec
systemctl --user daemon-reload
systemctl --user enable --now docker.service
systemctl --user status docker.service
systemctl --user restart docker

# Test Docker
docker ps
```

## Step 3: Setup GitHub Actions Runner

1. Go to your GitHub repository
2. Click Settings → Actions → Runners
3. Click "New self-hosted runner"
4. Select Linux x64
5. Copy the commands and run them on the server:

```bash
# Create runner directory
mkdir actions-runner && cd actions-runner

# Download runner (use the exact URL from GitHub)
curl -o actions-runner-linux-x64-2.324.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.324.0/actions-runner-linux-x64-2.324.0.tar.gz

# Verify download (use the exact hash from GitHub)
echo "YOUR_HASH_FROM_GITHUB  actions-runner-linux-x64-2.324.0.tar.gz" | shasum -a 256 -c

# Extract
tar xzf ./actions-runner-linux-x64-2.324.0.tar.gz

# Configure (use your actual token from GitHub)
./config.sh --url https://github.com/Qyuzet/dinetap-fullstack --token YOUR_TOKEN_FROM_GITHUB
```

## Step 4: Configure Runner Registration

When prompted, enter:
- Runner group: (press Enter)
- Runner name: `csbiweb` (or press Enter)
- Additional labels: (press Enter)
- Work folder: (press Enter)

## Step 5: Install and Start Runner Service

```bash
# Install service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

## Step 6: Verify Setup

1. Go back to GitHub repository → Settings → Actions → Runners
2. You should see your runner with status "Idle"
3. The runner is now ready to receive jobs

## Step 7: Create Environment File on Server

```bash
# Navigate to your project directory
cd /home/usergc18/dinetap-fullstack

# Create environment file
cp .env.example .env

# Edit with your actual values
nano .env
```

Update the .env file with:
```
DOCKER_USERNAME=your_dockerhub_username
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GEMINI_API_KEY=your_actual_gemini_api_key
NEXTAUTH_SECRET=your_actual_nextauth_secret
```

## Troubleshooting

**If Docker commands fail:**
- Make sure you're in the correct user session
- Restart Docker: `systemctl --user restart docker`
- Check Docker status: `systemctl --user status docker.service`

**If runner doesn't appear:**
- Check runner service: `sudo ./svc.sh status`
- Restart runner: `sudo ./svc.sh restart`
- Check logs in the actions-runner directory

**If deployment fails:**
- Check container logs: `docker compose logs`
- Verify environment variables: `cat .env`
- Check Docker images: `docker images`
