// @ts-nocheck
"use server";

import {
  fetchPortalById,
  fetchMenuItems,
  createNewMenuItem,
  updateExistingMenuItem,
  removeMenuItem,
} from "@/app/actions";

import { Portal, MenuItem } from "@/models/Portal";

export async function getPortalData(id: string): Promise<Portal | null> {
  try {
    return await fetchPortalById(id);
  } catch (error) {
    console.error("Error fetching portal:", error);
    return null;
  }
}

export async function getMenuItemsData(portalId: string): Promise<MenuItem[]> {
  try {
    return await fetchMenuItems(portalId);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

export async function createMenuItemData(
  menuItemData: Omit<MenuItem, "id">
): Promise<MenuItem | null> {
  try {
    const newMenuItem = await createNewMenuItem(menuItemData);
    return newMenuItem;
  } catch (error) {
    console.error("Error creating menu item:", error);
    return null;
  }
}

export async function updateMenuItemData(
  id: string,
  menuItemData: Partial<MenuItem>
): Promise<MenuItem | null> {
  try {
    const updatedMenuItem = await updateExistingMenuItem(id, menuItemData);
    return updatedMenuItem;
  } catch (error) {
    console.error("Error updating menu item:", error);
    return null;
  }
}

export async function deleteMenuItemData(id: string): Promise<boolean> {
  try {
    const success = await removeMenuItem(id);
    return success;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return false;
  }
}
