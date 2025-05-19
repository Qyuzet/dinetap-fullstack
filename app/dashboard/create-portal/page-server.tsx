// @ts-nocheck
"use server";

import { createNewPortal, getDefaultColorScheme } from "@/app/actions";
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

export async function generateColorScheme(websiteUrl?: string) {
  // If no website URL is provided, return a default color scheme
  if (!websiteUrl) {
    return await getDefaultColorScheme();
  }

  try {
    // Determine which API to use based on environment
    const isProduction = process.env.NODE_ENV === "production";
    const apiEndpoint = isProduction
      ? "/api/analyze-restaurant-fallback"
      : "/api/analyze-restaurant-simple";

    console.log(
      `Using API endpoint: ${apiEndpoint} (production: ${isProduction})`
    );

    // Call the appropriate restaurant analysis API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }${apiEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: websiteUrl }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to analyze restaurant website:",
        await response.text()
      );
      return await getDefaultColorScheme();
    }

    const data = await response.json();

    if (!data.success) {
      console.error("Restaurant analysis failed:", data.error);
      return await getDefaultColorScheme();
    }

    // Extract color scheme from the analysis
    if (data.analysis?.themeRecommendations) {
      const { primaryColor, secondaryColor, accentColor } =
        data.analysis.themeRecommendations;

      // Return the color scheme
      return {
        primary: primaryColor || "#3B82F6", // Default to blue if not provided
        secondary: secondaryColor || "#1E40AF", // Default to darker blue if not provided
        accent: accentColor || "#DBEAFE", // Default to light blue if not provided
      };
    }

    // Check for well-known restaurant chains as fallback
    const lowerUrl = websiteUrl.toLowerCase();

    // KFC - Red and white color scheme
    if (lowerUrl.includes("kfc") || lowerUrl.includes("kentucky")) {
      return {
        primary: "#E4002B", // KFC red
        secondary: "#A50022", // Darker red
        accent: "#F8F8F8", // Off-white
      };
    }

    // McDonald's - Red and yellow color scheme
    if (lowerUrl.includes("mcdonalds") || lowerUrl.includes("mcdonald")) {
      return {
        primary: "#FFC72C", // McDonald's yellow
        secondary: "#DA291C", // McDonald's red
        accent: "#FFFFFF", // White
      };
    }

    // Pizza Hut - Red color scheme
    if (lowerUrl.includes("pizzahut") || lowerUrl.includes("pizza hut")) {
      return {
        primary: "#ED1C24", // Pizza Hut red
        secondary: "#AA1A20", // Darker red
        accent: "#FFFFFF", // White
      };
    }

    // Starbucks - Green color scheme
    if (lowerUrl.includes("starbucks")) {
      return {
        primary: "#006241", // Starbucks green
        secondary: "#004A31", // Darker green
        accent: "#F2F0EB", // Off-white
      };
    }

    // Default to random color scheme
    return await getDefaultColorScheme();
  } catch (error) {
    console.error("Error analyzing restaurant website:", error);
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
    // Determine which API to use based on environment
    const isProduction = process.env.NODE_ENV === "production";
    const apiEndpoint = isProduction
      ? "/api/analyze-restaurant-fallback"
      : "/api/analyze-restaurant-simple";

    console.log(
      `Using API endpoint: ${apiEndpoint} (production: ${isProduction})`
    );

    // Call the appropriate restaurant analysis API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }${apiEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: websiteUrl }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to analyze restaurant website:",
        await response.text()
      );
      return {
        restaurantName: "",
        description: "",
        menuItems: [],
      };
    }

    const data = await response.json();

    if (!data.success) {
      console.error("Restaurant analysis failed:", data.error);
      return {
        restaurantName: "",
        description: "",
        menuItems: [],
      };
    }

    // Extract restaurant information from the analysis
    const restaurantName = data.analysis.restaurantName || "";
    const description = data.analysis.description || "";

    // Extract menu items from the analysis
    let menuItems = [];

    // First try to use the suggested menu items from the AI
    if (
      data.analysis.suggestedMenuItems &&
      data.analysis.suggestedMenuItems.length > 0
    ) {
      menuItems = data.analysis.suggestedMenuItems.map((item) => ({
        name: item.name,
        description: item.description || "",
        price:
          typeof item.price === "number"
            ? item.price
            : parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0"),
        category: item.category || "Menu Item",
        available: true,
        tags: [],
      }));
    }
    // If no suggested items, use the scraped menu items
    else if (data.menuItems && data.menuItems.length > 0) {
      menuItems = data.menuItems.map((item) => ({
        name: item.name,
        description: item.description || "",
        price: parseFloat(item.price?.replace(/[^0-9.]/g, "") || "0"),
        category: item.category || "Menu Item",
        available: true,
        tags: [],
      }));
    }

    return {
      restaurantName,
      description,
      menuItems,
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
