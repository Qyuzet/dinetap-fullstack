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

// Simplified function to generate a color scheme and menu items
async function generateRestaurantData(
  restaurantName: string,
  websiteUrl?: string
) {
  try {
    // Call our simplified API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/generate-restaurant-portal-simple`,
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
      return {
        colors: await getDefaultColorScheme(),
        description: "",
        menuItems: [],
      };
    }

    const result = await response.json();

    if (!result.success) {
      console.error("Failed to generate restaurant data:", result.error);
      return {
        colors: await getDefaultColorScheme(),
        description: "",
        menuItems: [],
      };
    }

    const data = result.data;

    // Extract colors
    const colors = {
      primary: data.colors?.primary || "#3B82F6",
      secondary: data.colors?.secondary || "#1E40AF",
      accent: data.colors?.accent || "#DBEAFE",
    };

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

    return {
      colors,
      description: data.description || "",
      menuItems,
    };
  } catch (error) {
    console.error("Error generating restaurant data:", error);
    return {
      colors: await getDefaultColorScheme(),
      description: "",
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
