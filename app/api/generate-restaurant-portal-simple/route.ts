// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const API_KEY = "AIzaSyD9gTF5F-S4kjP8YReD-Unt1zsGGjYz4gU";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { restaurantName, websiteUrl } = body;

    if (!restaurantName) {
      return NextResponse.json(
        { error: "Restaurant name is required" },
        { status: 400 }
      );
    }

    console.log(`Generating portal for restaurant: ${restaurantName}`);

    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Prepare the prompt
    const prompt = `
Generate a restaurant portal design and menu for a restaurant called "${restaurantName}".
${websiteUrl ? `The restaurant's website is: ${websiteUrl}` : ""}

Please provide the following:
1. A brief description of the restaurant (2-3 sentences)
2. A suggested color scheme (primary, secondary, and accent colors in hex format)
3. A list of menu items organized by category

Format your response as JSON with the following structure:
{
  "description": "Brief description of the restaurant",
  "colors": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor"
  },
  "menuItems": [
    {
      "name": "Item name",
      "description": "Item description",
      "price": 12.99,
      "category": "Category name"
    }
  ]
}
`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from response");
      }
      
      const jsonStr = jsonMatch[0];
      const data = JSON.parse(jsonStr);
      
      return NextResponse.json({
        success: true,
        data
      });
    } catch (jsonError) {
      console.error("Error parsing AI response as JSON:", jsonError);
      
      // Return a fallback response
      return NextResponse.json({
        success: true,
        data: {
          description: `${restaurantName} is a welcoming restaurant offering delicious food in a comfortable atmosphere. The menu features a variety of dishes made with fresh, quality ingredients.`,
          colors: {
            primary: "#3B82F6",
            secondary: "#1E40AF",
            accent: "#DBEAFE"
          },
          menuItems: [
            {
              name: "House Salad",
              description: "Fresh mixed greens with house dressing",
              price: 8.99,
              category: "Appetizers"
            },
            {
              name: "Signature Pasta",
              description: "Handmade pasta with chef's special sauce",
              price: 16.99,
              category: "Main Courses"
            },
            {
              name: "Chocolate Dessert",
              description: "Rich chocolate dessert with vanilla ice cream",
              price: 7.99,
              category: "Desserts"
            }
          ]
        }
      });
    }
  } catch (error) {
    console.error("Error generating restaurant portal:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate restaurant portal: " + (error.message || "Unknown error") 
      },
      { status: 500 }
    );
  }
}
