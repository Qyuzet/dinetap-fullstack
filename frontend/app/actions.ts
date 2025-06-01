// @ts-nocheck
"use server";

import { apiClient } from "@/lib/api-client";
import { Portal, MenuItem } from "@/types/index";

// Re-export all the functions as server actions using API client
export async function fetchUserPortals(userId: string) {
  return await apiClient.getPortals(userId);
}

export async function fetchPortalById(id: string) {
  return await apiClient.getPortal(id);
}

export async function createNewPortal(
  portalData: Omit<Portal, "id" | "createdAt">
) {
  return await apiClient.createPortal(portalData);
}

export async function updateExistingPortal(
  id: string,
  portalData: Partial<Portal>
) {
  return await apiClient.updatePortal(id, portalData);
}

export async function removePortal(id: string): Promise<boolean> {
  try {
    await apiClient.deletePortal(id);
    return true; // If no error is thrown, deletion was successful
  } catch (error) {
    console.error("Error deleting portal:", error);
    return false; // Return false if there was an error
  }
}

export async function fetchMenuItems(portalId: string) {
  return await apiClient.getMenuItems(portalId);
}

export async function createNewMenuItem(menuItemData: Omit<MenuItem, "id">) {
  return await apiClient.createMenuItem(menuItemData);
}

export async function updateExistingMenuItem(
  id: string,
  menuItemData: Partial<MenuItem>
): Promise<MenuItem | null> {
  try {
    console.log("🔄 Updating menu item:", id, menuItemData);
    const updatedItem = await apiClient.updateMenuItem(id, menuItemData);
    console.log("✅ Menu item updated successfully:", updatedItem);
    return updatedItem;
  } catch (error) {
    console.error("❌ Error updating menu item:", error);
    throw error; // Re-throw to let the calling function handle it
  }
}

export async function removeMenuItem(id: string): Promise<boolean> {
  try {
    await apiClient.deleteMenuItem(id);
    return true; // If no error is thrown, deletion was successful
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return false; // Return false if there was an error
  }
}

export async function getDefaultColorScheme() {
  // Return a default color scheme since this is now handled by the backend
  return {
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1f2937"
  };
}

// AI Restaurant Generation using backend API
export async function generateRestaurantDataWithGemini(prompt: string) {
  return await apiClient.generateRestaurant(prompt);
}
