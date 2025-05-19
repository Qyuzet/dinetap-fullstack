// @ts-nocheck
"use server";

import {
  getUserPortals,
  getPortalById,
  createPortal,
  updatePortal,
  deletePortal,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  generateDefaultColorScheme,
} from "@/lib/db";
import { Portal, MenuItem } from "@/models/Portal";

// Re-export all the functions as server actions
export async function fetchUserPortals(userId: string) {
  return await getUserPortals(userId);
}

export async function fetchPortalById(id: string) {
  return await getPortalById(id);
}

export async function createNewPortal(
  portalData: Omit<Portal, "id" | "createdAt">
) {
  return await createPortal(portalData);
}

export async function updateExistingPortal(
  id: string,
  portalData: Partial<Portal>
) {
  return await updatePortal(id, portalData);
}

export async function removePortal(id: string) {
  return await deletePortal(id);
}

export async function fetchMenuItems(portalId: string) {
  return await getMenuItems(portalId);
}

export async function createNewMenuItem(menuItemData: Omit<MenuItem, "id">) {
  return await createMenuItem(menuItemData);
}

export async function updateExistingMenuItem(
  id: string,
  menuItemData: Partial<MenuItem>
) {
  return await updateMenuItem(id, menuItemData);
}

export async function removeMenuItem(id: string) {
  return await deleteMenuItem(id);
}

export async function getDefaultColorScheme() {
  return generateDefaultColorScheme();
}

// Import the Gemini direct function
import { generateRestaurantDataWithGemini } from "@/lib/gemini-direct";

// Export the Gemini function as a server action
export { generateRestaurantDataWithGemini };
