// @ts-nocheck
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test backend connection
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const healthUrl = backendUrl.replace('/api', '/health');
    
    console.log('Testing backend connection to:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }
    
    const backendHealth = await response.json();
    
    return NextResponse.json({
      success: true,
      message: "Frontend health check passed",
      backend: backendHealth,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
