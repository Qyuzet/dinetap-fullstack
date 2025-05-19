// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Dynamic import for puppeteer to avoid build issues
let puppeteer: any = null;

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

    console.log(`Analyzing restaurant website: ${url}`);

    // Dynamically import puppeteer only when needed
    try {
      if (!puppeteer) {
        puppeteer = await import("puppeteer").then((module) => module.default);
      }
    } catch (importError) {
      console.error("Failed to import puppeteer:", importError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error: Puppeteer is not available in this environment.",
        },
        { status: 500 }
      );
    }

    // Launch the browser
    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
      ],
    });

    try {
      const page = await browser.newPage();

      // Set viewport size
      await page.setViewport({ width: 1920, height: 1080 });

      // Set user agent to avoid detection
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
      );

      // Navigate to the URL
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      // Extract text content from the page
      const textContent = await page.evaluate(() => {
        // Get all text from the page
        const text = document.body.innerText;
        return text.substring(0, 5000); // Limit to 5000 characters
      });

      // Take a screenshot
      const screenshot = await page.screenshot({ encoding: "base64" });

      // Extract restaurant name from the page
      const restaurantName = await page.evaluate(() => {
        // Try to find the restaurant name
        const titleElement = document.querySelector("title");
        if (titleElement) {
          const title = titleElement.innerText;
          // Remove common suffixes like "- Home", "| Official Website", etc.
          return title.replace(/[-|]\s*.*$/, "").trim();
        }

        // Try to find the logo alt text
        const logoImg = document.querySelector(
          "header img, .logo img, #logo img"
        );
        if (logoImg && logoImg.alt) {
          return logoImg.alt.trim();
        }

        // Try to find the largest heading
        const h1 = document.querySelector("h1");
        if (h1) {
          return h1.innerText.trim();
        }

        return "Restaurant";
      });

      // Extract menu items from the page
      const menuItems = await page.evaluate(() => {
        const items = [];

        // Look for elements that might be menu items
        const possibleMenuElements = document.querySelectorAll(
          '.menu-item, .food-item, .dish, [class*="menu-item"], [class*="food-item"], [class*="dish"], .item'
        );

        possibleMenuElements.forEach((el) => {
          // Try to extract name, price, description
          const nameEl = el.querySelector(
            'h3, h4, h5, .name, .title, [class*="name"], [class*="title"]'
          );
          const priceEl = el.querySelector('.price, [class*="price"]');
          const descEl = el.querySelector(
            '.description, [class*="description"], p'
          );

          if (nameEl) {
            const item = {
              name: nameEl.textContent.trim(),
              price: priceEl ? priceEl.textContent.trim() : "",
              description: descEl ? descEl.textContent.trim() : "",
              category: "Menu Item",
            };

            // Only add if we have a name and it's not already in the list
            if (item.name && !items.some((i) => i.name === item.name)) {
              items.push(item);
            }
          }
        });

        // If no menu items found, look for price patterns
        if (items.length === 0) {
          const priceRegex = /\$\d+(\.\d{2})?/;

          // Find all elements with text content containing price patterns
          const allElements = document.querySelectorAll("*");
          const priceElements = Array.from(allElements).filter((el) => {
            const text = el.textContent.trim();
            return (
              priceRegex.test(text) &&
              text.length < 100 &&
              !el.querySelector("*")
            );
          });

          for (const priceEl of priceElements) {
            // Look for name nearby (parent, previous sibling, etc.)
            let nameEl = priceEl.previousElementSibling;
            if (!nameEl || nameEl.textContent.trim().length > 50) {
              // Try parent's first child
              const parent = priceEl.parentElement;
              if (parent) {
                nameEl = Array.from(parent.children).find(
                  (el) => el !== priceEl && el.textContent.trim().length < 50
                );
              }
            }

            if (nameEl) {
              const item = {
                name: nameEl.textContent.trim(),
                price: priceEl.textContent.trim(),
                description: "",
                category: "Menu Item",
              };

              // Only add if we have a name and it's not already in the list
              if (item.name && !items.some((i) => i.name === item.name)) {
                items.push(item);
              }
            }
          }
        }

        return items;
      });

      // Close the browser
      await browser.close();

      // Prepare the prompt for the AI
      let prompt = `Analyze this restaurant website and provide insights for creating a restaurant portal.

Restaurant Name: ${restaurantName}
Website URL: ${url}

Website Text Content:
${textContent}

Menu Items (${menuItems.length} items found):
${menuItems
  .map(
    (item) =>
      `- ${item.name}: ${item.description || "No description"} - Price: ${
        item.price || "Unknown"
      }`
  )
  .join("\n")}

Please provide the following analysis:
1. Restaurant Type/Cuisine: Determine the type of cuisine or restaurant category.
2. Price Range: Estimate the price range ($ = Budget, $$ = Mid-range, $$$ = High-end, $$$$ = Fine dining).
3. Menu Categories: Suggest logical categories for organizing the menu items.
4. Specialty Dishes: Identify what appear to be signature or specialty dishes.
5. Theme Recommendations: Suggest a color scheme and theme that would match this restaurant's style.
6. Keywords: Provide 5-10 keywords that describe this restaurant.
7. Short Description: Write a brief marketing description (2-3 sentences) for this restaurant.

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
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: screenshot } },
            ],
          },
        ],
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

        return NextResponse.json({
          success: true,
          analysis: analysisData,
          screenshot: `data:image/jpeg;base64,${screenshot}`,
          menuItems: menuItems,
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
            menuCategories: [
              "Appetizers",
              "Main Courses",
              "Desserts",
              "Beverages",
            ],
            specialtyDishes: menuItems.slice(0, 3).map((item) => item.name),
            themeRecommendations: {
              primaryColor: "#3B82F6",
              secondaryColor: "#1E40AF",
              accentColor: "#DBEAFE",
              fontStyle: "Modern",
              mood: "Casual",
            },
            keywords: ["Restaurant", "Dining", restaurantName, "Food", "Local"],
            description: `${restaurantName} offers a delightful dining experience with a variety of delicious options.`,
            suggestedMenuItems: menuItems.map((item) => ({
              name: item.name,
              description: item.description || "",
              price: parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0,
              category: "Menu Item",
            })),
          },
          screenshot: `data:image/jpeg;base64,${screenshot}`,
          menuItems: menuItems,
          note: "AI response was not in proper JSON format. Using fallback analysis.",
        });
      }
    } catch (error) {
      console.error("Error in restaurant analysis:", error);

      // Close the browser if it's still open
      if (browser) {
        await browser.close();
      }

      throw error;
    }
  } catch (error) {
    console.error("Error in restaurant analysis API:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to analyze restaurant: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}
