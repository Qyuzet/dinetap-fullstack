// @ts-nocheck
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const API_KEY = "AIzaSyD9gTF5F-S4kjP8YReD-Unt1zsGGjYz4gU";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateRestaurantDataWithGemini(restaurantName: string, websiteUrl?: string) {
  try {
    console.log(`Generating restaurant data directly with Gemini for: ${restaurantName}`);
    
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
      
      return {
        success: true,
        data
      };
    } catch (jsonError) {
      console.error("Error parsing Gemini response as JSON:", jsonError);
      
      // Return a fallback response
      return {
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
      };
    }
  } catch (error) {
    console.error("Error generating restaurant data with Gemini:", error);
    
    // Return a fallback response
    return {
      success: true,
      data: {
        description: `${restaurantName} is a welcoming restaurant offering delicious food in a comfortable atmosphere.`,
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
    };
  }
}
