// @ts-nocheck
// Portal service that connects to MongoDB
// Add the 'use server' directive to ensure this only runs on the server
"use server";

import { v4 as uuidv4 } from "uuid";
import clientPromise from "../mongodb";
import {
  Portal,
  MenuItem,
  mapPortalDocument,
  mapMenuItemDocument,
} from "@/models/Portal";

// Get all portals for a user
export async function getUserPortals(userId: string): Promise<Portal[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const portals = await portalsCollection.find({ userId }).toArray();
    return portals.map(mapPortalDocument);
  } catch (error) {
    console.error("Error fetching user portals:", error);
    throw error;
  }
}

// Get a portal by ID
export async function getPortalById(id: string): Promise<Portal | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const portal = await portalsCollection.findOne({ id });
    return portal ? mapPortalDocument(portal) : null;
  } catch (error) {
    console.error("Error fetching portal by ID:", error);
    throw error;
  }
}

// Create a new portal
export async function createPortal(
  portalData: Omit<Portal, "id" | "createdAt">
): Promise<Portal> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const newPortal: Portal = {
      ...portalData,
      id: uuidv4(),
      createdAt: new Date(),
    };

    await portalsCollection.insertOne(newPortal);
    return newPortal;
  } catch (error) {
    console.error("Error creating portal:", error);
    throw error;
  }
}

// Update a portal
export async function updatePortal(
  id: string,
  portalData: Partial<Portal>
): Promise<Portal | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const result = await portalsCollection.findOneAndUpdate(
      { id },
      { $set: portalData },
      { returnDocument: "after" }
    );

    return result ? mapPortalDocument(result) : null;
  } catch (error) {
    console.error("Error updating portal:", error);
    throw error;
  }
}

// Delete a portal
export async function deletePortal(id: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const result = await portalsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting portal:", error);
    throw error;
  }
}

// Get menu items for a portal
export async function getMenuItems(portalId: string): Promise<MenuItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItemsCollection = db.collection("menuItems");

    const menuItems = await menuItemsCollection.find({ portalId }).toArray();
    return menuItems.map(mapMenuItemDocument);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
}

// Create a new menu item
export async function createMenuItem(
  menuItemData: Omit<MenuItem, "id">
): Promise<MenuItem> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItemsCollection = db.collection("menuItems");

    const newMenuItem: MenuItem = {
      ...menuItemData,
      id: uuidv4(),
    };

    await menuItemsCollection.insertOne(newMenuItem);
    return newMenuItem;
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw error;
  }
}

// Update a menu item
export async function updateMenuItem(
  id: string,
  menuItemData: Partial<MenuItem>
): Promise<MenuItem | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItemsCollection = db.collection("menuItems");

    const result = await menuItemsCollection.findOneAndUpdate(
      { id },
      { $set: menuItemData },
      { returnDocument: "after" }
    );

    return result ? mapMenuItemDocument(result) : null;
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
}

// Delete a menu item
export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItemsCollection = db.collection("menuItems");

    const result = await menuItemsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
}

// Generate a default color scheme for a new portal
export function generateDefaultColorScheme() {
  // Array of nice color combinations
  const colorSchemes = [
    { primary: "#3B82F6", secondary: "#1E40AF", accent: "#DBEAFE" }, // Blue
    { primary: "#10B981", secondary: "#047857", accent: "#D1FAE5" }, // Green
    { primary: "#F59E0B", secondary: "#B45309", accent: "#FEF3C7" }, // Amber
    { primary: "#EF4444", secondary: "#B91C1C", accent: "#FEE2E2" }, // Red
    { primary: "#8B5CF6", secondary: "#6D28D9", accent: "#EDE9FE" }, // Purple
    { primary: "#EC4899", secondary: "#BE185D", accent: "#FCE7F3" }, // Pink
    { primary: "#06B6D4", secondary: "#0E7490", accent: "#CFFAFE" }, // Cyan
  ];

  // Return a random color scheme
  return colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
}

// Re-export the Portal and MenuItem types
export type { Portal, MenuItem } from "@/models/Portal";
