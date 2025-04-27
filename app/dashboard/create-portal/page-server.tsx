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
  // Check for well-known restaurant chains and use their brand colors
  if (websiteUrl) {
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
  }

  // Default to random color scheme
  return await getDefaultColorScheme();
}
