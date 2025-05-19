// @ts-nocheck
import { MongoClient } from "mongodb";
import { Portal, MenuItem } from "@/models/Portal";
import { v4 as uuidv4 } from "uuid";

// This approach is better for Next.js as it doesn't rely on 'use server' directives
// which can cause issues with the build process

// Check for MongoDB URI
let uri = process.env.MONGODB_URI;

// For build process, provide a dummy URI if not available
if (!uri) {
  console.warn(
    "MongoDB URI not found in environment variables in db.ts. Using dummy URI for build process."
  );
  uri = "mongodb://localhost:27017/dinetap";
}

// MongoDB client
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// MongoDB connection options with shorter timeouts for Vercel
const options = {
  serverSelectionTimeoutMS: 10000, // Reduce from default 30000ms to 10000ms
  connectTimeoutMS: 10000, // Reduce connection timeout
  socketTimeoutMS: 20000, // Reduce socket timeout
};

// Check if we're in development mode
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Log connection status
clientPromise
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Database operations
export async function getUserPortals(userId: string): Promise<Portal[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const portals = await portalsCollection.find({ userId }).toArray();
    return portals as unknown as Portal[];
  } catch (error) {
    console.error("Error fetching user portals:", error);
    return [];
  }
}

export async function getPortalById(id: string): Promise<Portal | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const portal = await portalsCollection.findOne({ id });
    return portal as unknown as Portal;
  } catch (error) {
    console.error("Error fetching portal by ID:", error);
    return null;
  }
}

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

export async function updatePortal(
  id: string,
  portalData: Partial<Portal>
): Promise<Portal | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    await portalsCollection.updateOne({ id }, { $set: portalData });

    // Get the updated portal
    const updatedPortal = await portalsCollection.findOne({ id });
    return updatedPortal as unknown as Portal;
  } catch (error) {
    console.error("Error updating portal:", error);
    return null;
  }
}

export async function deletePortal(id: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const portalsCollection = db.collection("portals");

    const result = await portalsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting portal:", error);
    return false;
  }
}

export async function getMenuItems(portalId: string): Promise<MenuItem[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItemsCollection = db.collection("menuItems");

    const menuItems = await menuItemsCollection.find({ portalId }).toArray();
    return menuItems as unknown as MenuItem[];
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

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

export async function updateMenuItem(
  id: string,
  menuItemData: Partial<MenuItem>
): Promise<MenuItem | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItemsCollection = db.collection("menuItems");

    await menuItemsCollection.updateOne({ id }, { $set: menuItemData });

    // Get the updated menu item
    const updatedMenuItem = await menuItemsCollection.findOne({ id });
    return updatedMenuItem as unknown as MenuItem;
  } catch (error) {
    console.error("Error updating menu item:", error);
    return null;
  }
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItemsCollection = db.collection("menuItems");

    const result = await menuItemsCollection.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return false;
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

// Export the clientPromise for direct access if needed
export default clientPromise;
