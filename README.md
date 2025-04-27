# Dinetap AI

AI-Powered Restaurant Ordering Platform

## Environment Variables

To deploy this project, you need to set the following environment variables in your Vercel project settings:

### MongoDB
- `MONGODB_URI`: Your MongoDB connection string

### NextAuth
- `NEXTAUTH_SECRET`: A random string used to hash tokens and sign cookies
- `NEXTAUTH_URL`: The base URL of your deployed application (e.g., https://your-app.vercel.app)

### Google OAuth
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

## Local Development

For local development, create a `.env.local` file in the root directory with the above variables.

## Deployment

1. Fork or clone this repository
2. Set up the environment variables in your Vercel project settings
3. Deploy to Vercel

## Features

- AI-powered menu design
- Digital ordering system
- Restaurant management dashboard
- Customer-facing portal
- Staff interfaces (kitchen, cashier, admin)
