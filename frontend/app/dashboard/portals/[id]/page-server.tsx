// @ts-nocheck
"use server";

import { fetchPortalById, updateExistingPortal } from "@/app/actions";
import { Portal } from "@/models/Portal";

export async function getPortalData(id: string): Promise<Portal | null> {
  try {
    return await fetchPortalById(id);
  } catch (error) {
    console.error("Error fetching portal:", error);
    return null;
  }
}

export async function updatePortalData(
  id: string,
  portalData: Partial<Portal>
): Promise<Portal | null> {
  try {
    return await updateExistingPortal(id, portalData);
  } catch (error) {
    console.error("Error updating portal:", error);
    return null;
  }
}
