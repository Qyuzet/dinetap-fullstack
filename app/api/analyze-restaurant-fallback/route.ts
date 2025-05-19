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
    // Parse the request body
    const body = await request.json().catch((e) => {
      console.error("Failed to parse request body:", e);
      throw new Error("Invalid request body");
    });

    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    console.log(`Analyzing restaurant website (fallback): ${url}`);

    // Extract restaurant name from URL
    let restaurantName = "";
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      // Remove www. and .com/.net/etc
      restaurantName = hostname
        .replace(/^www\./i, "")
        .replace(/\.(com|net|org|co|io|restaurant|food|menu|cafe|bar|pub|bistro).*$/i, "")
        .split(".")
        .join(" ")
        .split("-")
        .join(" ")
        .split("_")
        .join(" ");
      
      // Capitalize first letter of each word
      restaurantName = restaurantName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } catch (error) {
      console.error("Error extracting restaurant name from URL:", error);
      restaurantName = "Restaurant";
    }

    // Prepare the prompt for the AI
    let prompt = `Analyze this restaurant website and provide insights for creating a restaurant portal.
    
Restaurant Name: ${restaurantName}
Website URL: ${url}

I don't have direct access to the website content, but based on the URL and restaurant name, please:

1. Generate a plausible restaurant analysis with the following information:
   - Restaurant Type/Cuisine: Determine the likely type of cuisine or restaurant category.
   - Price Range: Estimate the price range ($ = Budget, $$ = Mid-range, $$$ = High-end, $$$$ = Fine dining).
   - Menu Categories: Suggest logical categories for organizing menu items.
   - Theme Recommendations: Suggest a color scheme and theme that would match this restaurant's style.
   - Keywords: Provide 5-10 keywords that describe this restaurant.
   - Short Description: Write a brief marketing description (2-3 sentences) for this restaurant.

2. Generate a sample menu with at least 10 items that would be appropriate for this type of restaurant.

Format your response as JSON with the following structure:
{
  "restaurantName": "string",
  "cuisineType": "string",
  "priceRange": "string",
  "menuCategories": ["string"],
  "specialtyDishes": ["string"],
  "themeRecommendations": {
    "primaryColor": "hex",
    "secondaryColor": "hex",
    "accentColor": "hex",
    "fontStyle": "string",
    "mood": "string"
  },
  "keywords": ["string"],
  "description": "string",
  "suggestedMenuItems": [
    {
      "name": "string",
      "description": "string",
      "price": number,
      "category": "string"
    }
  ]
}`;

    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings,
    });

    // Generate a response with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 30000)
    );

    const responsePromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    // Race between the API call and the timeout
    const result = await Promise.race([responsePromise, timeoutPromise]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case the model adds extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from response");
      }
      
      const jsonStr = jsonMatch[0];
      const analysisData = JSON.parse(jsonStr);
      
      // Generate a placeholder screenshot (base64 encoded 1x1 transparent pixel)
      const placeholderImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      
      return NextResponse.json({
        success: true,
        analysis: analysisData,
        screenshot: `data:image/png;base64,${placeholderImage}`,
        menuItems: analysisData.suggestedMenuItems || [],
        note: "Using fallback analysis without website scraping."
      });
    } catch (jsonError) {
      console.error("Error parsing AI response as JSON:", jsonError);
      console.log("Raw response:", text);
      
      // Return a fallback analysis
      return NextResponse.json({
        success: true,
        analysis: {
          restaurantName: restaurantName,
          cuisineType: "Contemporary",
          priceRange: "$$",
          menuCategories: ["Appetizers", "Main Courses", "Desserts", "Beverages"],
          specialtyDishes: ["Signature Dish", "Chef's Special", "House Favorite"],
          themeRecommendations: {
            primaryColor: "#3B82F6",
            secondaryColor: "#1E40AF",
            accentColor: "#DBEAFE",
            fontStyle: "Modern",
            mood: "Casual"
          },
          keywords: ["Restaurant", "Dining", restaurantName, "Food", "Local"],
          description: `${restaurantName} offers a delightful dining experience with a variety of delicious options.`,
          suggestedMenuItems: [
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
        },
        screenshot: `data:image/png;base64,${placeholderImage}`,
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
        ],
        note: "AI response was not in proper JSON format. Using fallback analysis."
      });
    }
  } catch (error) {
    console.error("Error in restaurant analysis API:", error);

    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to analyze restaurant: " + (error.message || "Unknown error") 
      },
      { status: 500 }
    );
  }
}
