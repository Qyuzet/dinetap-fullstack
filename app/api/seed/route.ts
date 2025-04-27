// @ts-nocheck
import { NextResponse } from "next/server";
// This is an API route, so we don't need 'use server' here
import clientPromise from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// Sample data for seeding the database
const samplePortals = [
  {
    id: uuidv4(),
    name: "Solaria Restaurant",
    description: "Indonesian cuisine restaurant with a modern twist",
    createdAt: new Date(),
    status: "active",
    userId: "user_1",
    colors: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#DBEAFE",
    },
  },
  {
    id: uuidv4(),
    name: "Spice Garden",
    description: "Authentic Indian cuisine with a variety of spice levels",
    createdAt: new Date(),
    status: "active",
    userId: "user_1",
    colors: {
      primary: "#EF4444",
      secondary: "#B91C1C",
      accent: "#FEE2E2",
    },
  },
];

// Generate sample menu items for each portal
function generateMenuItems(portalId: string) {
  const menuItems = [
    {
      id: uuidv4(),
      name: "Nasi Goreng Special",
      description: "Indonesian fried rice with chicken, shrimp, and vegetables",
      price: 12.99,
      image:
        "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Main Courses",
      tags: ["popular", "spicy"],
      available: true,
      portalId,
    },
    {
      id: uuidv4(),
      name: "Sate Ayam",
      description: "Grilled chicken skewers with peanut sauce",
      price: 9.99,
      image:
        "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Appetizers",
      tags: ["popular"],
      available: true,
      portalId,
    },
    {
      id: uuidv4(),
      name: "Gado-Gado",
      description: "Indonesian salad with vegetables, eggs, and peanut sauce",
      price: 8.99,
      image:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Appetizers",
      tags: ["vegetarian"],
      available: true,
      portalId,
    },
    {
      id: uuidv4(),
      name: "Soto Ayam",
      description: "Indonesian chicken soup with vermicelli, eggs, and herbs",
      price: 10.99,
      image:
        "https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Soups",
      tags: [],
      available: true,
      portalId,
    },
    {
      id: uuidv4(),
      name: "Es Cendol",
      description:
        "Indonesian iced dessert with green rice flour jelly and coconut milk",
      price: 5.99,
      image:
        "https://images.pexels.com/photos/1132558/pexels-photo-1132558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Desserts",
      tags: ["vegetarian", "sweet"],
      available: true,
      portalId,
    },
  ];

  return menuItems;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Clear existing data
    await db.collection("portals").deleteMany({});
    await db.collection("menuItems").deleteMany({});

    console.log("Cleared existing data");

    // Insert portals
    await db.collection("portals").insertMany(samplePortals);

    console.log("Inserted portals:", samplePortals.length);

    // Generate and insert menu items for each portal
    const menuItems = samplePortals.flatMap((portal) =>
      generateMenuItems(portal.id)
    );
    await db.collection("menuItems").insertMany(menuItems);

    console.log("Inserted menu items:", menuItems.length);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        portals: samplePortals.length,
        menuItems: menuItems.length,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
