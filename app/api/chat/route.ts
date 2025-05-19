// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI("AIzaSyD9gTF5F-S4kjP8YReD-Unt1zsGGjYz4gU");

// Safety settings to ensure appropriate responses
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json().catch((e) => {
      console.error("Failed to parse request body:", e);
      throw new Error("Invalid request body");
    });

    const { messages, portalId, menuItems } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Create a context about the restaurant and its menu
    let systemContext =
      "You are a helpful AI assistant for a restaurant. Your name is Dinetap AI. ";

    // Add menu information to the context if available
    if (menuItems && menuItems.length > 0) {
      systemContext += "Here is our current menu: \n";
      menuItems.forEach((item) => {
        if (item && item.name && item.price !== undefined) {
          const price =
            typeof item.price === "number" ? item.price.toFixed(2) : item.price;
          systemContext += `- ${item.name}: ${
            item.description || "No description available"
          }. Price: $${price}. Category: ${item.category || "General"}.\n`;
        }
      });
      systemContext +=
        "\nPlease help customers with questions about our menu, ingredients, recommendations, or any other restaurant-related inquiries. Keep responses brief and helpful.";
    } else {
      systemContext +=
        "Please help customers with their questions about our restaurant. Keep responses brief and helpful.";
    }

    // Format messages for Gemini
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Add system message at the beginning
    formattedMessages.unshift({
      role: "model",
      parts: [{ text: systemContext }],
    });

    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      safetySettings,
    });

    // Start a chat session
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1), // All messages except the last one
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topK: 40,
        topP: 0.95,
      },
    });

    // Get the last user message
    const lastMessage = formattedMessages[formattedMessages.length - 1];

    // Generate a response with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 15000)
    );

    const responsePromise = chat.sendMessage(lastMessage.parts[0].text);

    // Race between the API call and the timeout
    const result = await Promise.race([responsePromise, timeoutPromise]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat API:", error);

    // Provide more specific error messages based on the error type
    let errorMessage =
      "I'm sorry, I encountered an error. Please try again later.";
    let statusCode = 500;

    if (error.message === "Request timed out") {
      errorMessage =
        "The request took too long to process. Please try a shorter message or try again later.";
      statusCode = 504;
    } else if (error.message?.includes("API key")) {
      errorMessage =
        "There's an issue with the AI service configuration. Please contact support.";
      statusCode = 401;
    } else if (error.message === "Invalid request body") {
      errorMessage = "Your request couldn't be processed. Please try again.";
      statusCode = 400;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
