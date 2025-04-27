// @ts-nocheck
"use server";

import { fetchPortalById, fetchMenuItems } from "@/app/actions";
import { Portal, MenuItem } from "@/models/Portal";

export async function getPortalData(id: string): Promise<{
  portal: Portal | null;
  menuItems: MenuItem[];
}> {
  try {
    const portal = await fetchPortalById(id);
    const menuItems = portal ? await fetchMenuItems(id) : [];

    return {
      portal,
      menuItems,
    };
  } catch (error) {
    console.error("Error fetching portal data:", error);
    return {
      portal: null,
      menuItems: [],
    };
  }
}
