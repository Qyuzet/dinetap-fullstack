// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const API_KEY = "AIzaSyD9gTF5F-S4kjP8YReD-Unt1zsGGjYz4gU";
const genAI = new GoogleGenerativeAI(API_KEY);

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
    console.log("Chat API request received");

    // Parse the request body
    const body = await request.json().catch((e) => {
      console.error("Failed to parse request body:", e);
      throw new Error("Invalid request body");
    });

    const { messages, portalId, menuItems } = body;

    console.log(`Processing chat request for portalId: ${portalId}`);
    console.log(`Number of messages: ${messages?.length || 0}`);

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages);
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Create a context about the restaurant and its menu
    let systemPrompt =
      "You are a helpful AI assistant for a restaurant. Your name is Dinetap AI. ";

    // Add menu information to the context if available
    if (menuItems && menuItems.length > 0) {
      systemPrompt += "Here is our current menu: \n";
      menuItems.forEach((item) => {
        if (item && item.name && item.price !== undefined) {
          const price =
            typeof item.price === "number" ? item.price.toFixed(2) : item.price;
          systemPrompt += `- ${item.name}: ${
            item.description || "No description available"
          }. Price: $${price}. Category: ${item.category || "General"}.\n`;
        }
      });
      systemPrompt +=
        "\nPlease help customers with questions about our menu, ingredients, recommendations, or any other restaurant-related inquiries. Keep responses brief and helpful.";
    } else {
      systemPrompt +=
        "Please help customers with their questions about our restaurant. Keep responses brief and helpful.";
    }

    try {
      // Get the Gemini model - use a simpler model for better reliability
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings,
      });

      // Prepare the chat history
      const history = [];

      // Add previous messages to history (skip the last one which is the current user message)
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        if (msg.role === "user") {
          history.push({
            role: "user",
            parts: [{ text: msg.content }],
          });
        } else if (msg.role === "assistant") {
          history.push({
            role: "model",
            parts: [{ text: msg.content }],
          });
        }
      }

      // Start a chat session with the system prompt
      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topK: 40,
          topP: 0.95,
        },
      });

      // Send the system prompt first if this is the first message
      if (messages.length <= 2) {
        await chat.sendMessage(systemPrompt);
      }

      // Get the last user message
      const lastUserMessage = messages[messages.length - 1].content;
      console.log("Sending user message to Gemini:", lastUserMessage);

      // Generate a response with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 20000)
      );

      const responsePromise = chat.sendMessage(lastUserMessage);

      // Race between the API call and the timeout
      const result = await Promise.race([responsePromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text();

      console.log("Received response from Gemini");

      return NextResponse.json({ response: text });
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);

      // Try a fallback approach with a direct prompt
      try {
        console.log("Trying fallback approach...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Combine all messages into a single prompt
        let combinedPrompt = systemPrompt + "\n\n";
        combinedPrompt += "Previous conversation:\n";

        for (let i = 0; i < messages.length - 1; i++) {
          const role = messages[i].role === "user" ? "Customer" : "Assistant";
          combinedPrompt += `${role}: ${messages[i].content}\n`;
        }

        combinedPrompt += `\nCustomer: ${
          messages[messages.length - 1].content
        }\n`;
        combinedPrompt += "Assistant: ";

        const result = await model.generateContent(combinedPrompt);
        const text = result.response.text();

        console.log("Fallback approach successful");
        return NextResponse.json({ response: text });
      } catch (fallbackError) {
        console.error("Fallback approach failed:", fallbackError);
        throw geminiError; // Throw the original error for better debugging
      }
    }
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
    } else if (error.message?.includes("blocked due to safety settings")) {
      errorMessage =
        "I couldn't process that request due to content safety policies. Please try a different question.";
      statusCode = 400;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
