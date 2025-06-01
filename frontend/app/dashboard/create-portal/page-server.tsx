// @ts-nocheck
"use server";

import {
  createNewPortal,
  getDefaultColorScheme,
  generateRestaurantDataWithGemini,
} from "@/app/actions";
import { Portal } from "@/models/Portal";

export async function createPortalData(
  portalData: Omit<Portal, "id" | "createdAt">
): Promise<Portal | null> {
  try {
    return await createNewPortal(portalData);
  } catch (error) {
    console.error("Error creating portal:", error);
    return null;
  }
}

// Simplified function to generate a color scheme and menu items
async function generateRestaurantData(
  restaurantName: string,
  websiteUrl?: string
) {
  try {
    console.log(
      `Generating restaurant data for: ${restaurantName}, URL: ${
        websiteUrl || "none"
      }`
    );

    // Use a try-catch block specifically for the fetch operation
    try {
      // Use absolute URL with the correct base URL
      let baseUrl;

      // Try different environment variables that might be available in Vercel
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
      } else if (process.env.NEXT_PUBLIC_APP_URL) {
        baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      } else if (process.env.APP_URL) {
        baseUrl = process.env.APP_URL;
      } else {
        // Fallback to hardcoded production URL or localhost
        baseUrl =
          process.env.NODE_ENV === "production"
            ? "https://dinetap-ai.vercel.app"
            : "http://localhost:3000";
      }

      console.log(`Using base URL: ${baseUrl}`);

      // Call the backend API directly for real website color extraction
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      console.log(`🎨 Calling backend for color extraction: ${backendUrl}/ai/analyze-restaurant`);

      const response = await fetch(
        `${backendUrl}/ai/analyze-restaurant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ restaurantName, websiteUrl }),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to generate restaurant data:",
          await response.text()
        );
        throw new Error(`API returned status ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        console.error("Failed to generate restaurant data:", result.error);
        throw new Error(result.error || "API returned unsuccessful response");
      }

      const data = result.data;
      console.log("🎨 Received data from backend:", data);

      // Extract colors (backend returns them directly)
      const colors = {
        primary: data.colors?.primary || "#3B82F6",
        secondary: data.colors?.secondary || "#1E40AF",
        accent: data.colors?.accent || "#DBEAFE",
      };

      console.log("🎨 Extracted colors:", colors);

      // Extract menu items
      const menuItems = (data.menuItems || []).map((item) => ({
        name: item.name,
        description: item.description || "",
        price:
          typeof item.price === "number"
            ? item.price
            : parseFloat(String(item.price).replace(/[^0-9.]/g, "") || "0"),
        category: item.category || "Menu Item",
        available: true,
        tags: [],
      }));

      console.log(
        `Successfully generated data for ${restaurantName} with ${menuItems.length} menu items`
      );

      return {
        colors,
        description: data.description || "",
        menuItems,
      };
    } catch (fetchError) {
      console.error("Fetch error in generateRestaurantData:", fetchError);

      // Try using Gemini API directly
      console.log("Trying to generate data directly with Gemini API");
      try {
        const geminiResult = await generateRestaurantDataWithGemini(
          restaurantName,
          websiteUrl
        );

        if (geminiResult.success && geminiResult.data) {
          console.log(
            `Successfully generated data with Gemini for ${restaurantName}`
          );

          // Extract colors
          const colors = {
            primary: geminiResult.data.colors?.primary || "#3B82F6",
            secondary: geminiResult.data.colors?.secondary || "#1E40AF",
            accent: geminiResult.data.colors?.accent || "#DBEAFE",
          };

          // Extract menu items
          const menuItems = (geminiResult.data.menuItems || []).map((item) => ({
            name: item.name,
            description: item.description || "",
            price:
              typeof item.price === "number"
                ? item.price
                : parseFloat(String(item.price).replace(/[^0-9.]/g, "") || "0"),
            category: item.category || "Menu Item",
            available: true,
            tags: [],
          }));

          return {
            colors,
            description: geminiResult.data.description || "",
            menuItems,
          };
        }
      } catch (geminiError) {
        console.error("Error using Gemini directly:", geminiError);
      }

      // If Gemini also fails, use hardcoded fallback data
      console.log("Using hardcoded fallback data");

      // Generate a description based on restaurant name
      const description = `${restaurantName} offers a delightful dining experience with a variety of delicious options in a comfortable atmosphere.`;

      // Use default color scheme
      const colors = await getDefaultColorScheme();

      // Generate some basic menu items
      const menuItems = [
        {
          name: "House Salad",
          description: "Fresh mixed greens with house dressing",
          price: 8.99,
          category: "Appetizers",
          available: true,
          tags: [],
        },
        {
          name: "Signature Pasta",
          description: "Handmade pasta with chef's special sauce",
          price: 16.99,
          category: "Main Courses",
          available: true,
          tags: [],
        },
        {
          name: "Chocolate Dessert",
          description: "Rich chocolate dessert with vanilla ice cream",
          price: 7.99,
          category: "Desserts",
          available: true,
          tags: [],
        },
      ];

      return {
        colors,
        description,
        menuItems,
      };
    }
  } catch (error) {
    console.error("Error in generateRestaurantData:", error);
    return {
      colors: await getDefaultColorScheme(),
      description: `${restaurantName} restaurant.`,
      menuItems: [],
    };
  }
}

export async function generateColorScheme(websiteUrl?: string) {
  // If no website URL is provided, return a default color scheme
  if (!websiteUrl) {
    return await getDefaultColorScheme();
  }

  try {
    // Extract restaurant name from URL
    let restaurantName = "";
    try {
      const urlObj = new URL(websiteUrl);
      const hostname = urlObj.hostname;
      // Remove www. and .com/.net/etc
      restaurantName = hostname
        .replace(/^www\./i, "")
        .replace(
          /\.(com|net|org|co|io|restaurant|food|menu|cafe|bar|pub|bistro).*$/i,
          ""
        )
        .split(".")
        .join(" ")
        .split("-")
        .join(" ")
        .split("_")
        .join(" ");

      // Capitalize first letter of each word
      restaurantName = restaurantName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } catch (error) {
      console.error("Error extracting restaurant name from URL:", error);
      restaurantName = "Restaurant";
    }

    // Generate restaurant data
    const data = await generateRestaurantData(restaurantName, websiteUrl);

    // Return the color scheme
    return data.colors;
  } catch (error) {
    console.error("Error generating color scheme:", error);
    return await getDefaultColorScheme();
  }
}

// Function to analyze a restaurant website and extract menu items
export async function analyzeRestaurantWebsite(websiteUrl: string) {
  if (!websiteUrl) {
    return {
      restaurantName: "",
      description: "",
      menuItems: [],
    };
  }

  try {
    // Extract restaurant name from URL
    let restaurantName = "";
    try {
      const urlObj = new URL(websiteUrl);
      const hostname = urlObj.hostname;
      // Remove www. and .com/.net/etc
      restaurantName = hostname
        .replace(/^www\./i, "")
        .replace(
          /\.(com|net|org|co|io|restaurant|food|menu|cafe|bar|pub|bistro).*$/i,
          ""
        )
        .split(".")
        .join(" ")
        .split("-")
        .join(" ")
        .split("_")
        .join(" ");

      // Capitalize first letter of each word
      restaurantName = restaurantName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } catch (error) {
      console.error("Error extracting restaurant name from URL:", error);
      restaurantName = "Restaurant";
    }

    // Generate restaurant data
    const data = await generateRestaurantData(restaurantName, websiteUrl);

    return {
      restaurantName,
      description: data.description,
      menuItems: data.menuItems,
    };
  } catch (error) {
    console.error("Error analyzing restaurant website:", error);
    return {
      restaurantName: "",
      description: "",
      menuItems: [],
    };
  }
}
