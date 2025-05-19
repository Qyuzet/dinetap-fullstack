// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI("AIzaSyD9gTF5F-S4kjP8YReD-Unt1zsGGjYz4gU");

export async function POST(request: NextRequest) {
  try {
    const { messages, portalId, menuItems } = await request.json();

    // Create a context about the restaurant and its menu
    let systemContext = "You are a helpful AI assistant for a restaurant. ";
    
    // Add menu information to the context if available
    if (menuItems && menuItems.length > 0) {
      systemContext += "Here is our current menu: \n";
      menuItems.forEach((item) => {
        systemContext += `- ${item.name}: ${item.description || "No description available"}. Price: $${item.price.toFixed(2)}. Category: ${item.category}.\n`;
      });
      systemContext += "\nPlease help customers with questions about our menu, ingredients, recommendations, or any other restaurant-related inquiries.";
    } else {
      systemContext += "Please help customers with their questions about our restaurant.";
    }

    // Format messages for Gemini
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Add system message at the beginning
    formattedMessages.unshift({
      role: "model",
      parts: [{ text: systemContext }]
    });

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Start a chat session
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1), // All messages except the last one
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    // Get the last user message
    const lastMessage = formattedMessages[formattedMessages.length - 1];
    
    // Generate a response
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
