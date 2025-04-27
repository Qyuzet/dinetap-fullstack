// @ts-nocheck
"use server";

import { fetchUserPortals, removePortal } from "@/app/actions";
import { Portal } from "@/models/Portal";

export async function getUserPortalsData(userId: string): Promise<Portal[]> {
  try {
    const portals = await fetchUserPortals(userId);
    return portals;
  } catch (error) {
    console.error("Error fetching user portals:", error);
    return [];
  }
}

export async function deletePortalData(id: string): Promise<boolean> {
  try {
    return await removePortal(id);
  } catch (error) {
    console.error("Error deleting portal:", error);
    return false;
  }
}
