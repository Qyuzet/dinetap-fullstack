# Frontend Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build arguments
ARG MONGODB_URI
ARG GEMINI_API_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET

# Set environment variables for build
ENV MONGODB_URI=$MONGODB_URI
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=https://e2425-wads-l4ccg4-client.csbihub.id
ENV NEXT_PUBLIC_API_URL=https://e2425-wads-l4ccg4-server.csbihub.id/api

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check - just check if the server is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]
