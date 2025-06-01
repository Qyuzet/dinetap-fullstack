// @ts-nocheck
'use server';

import { createNewMenuItem } from '@/app/actions';
import { MenuItem } from '@/models/Portal';
import { v4 as uuidv4 } from 'uuid';

export async function saveMenuItems(menuItems: Omit<MenuItem, 'id'>[]): Promise<boolean> {
  try {
    // Process each menu item and save it to the database
    const savePromises = menuItems.map(async (item) => {
      // Add a unique ID to each menu item
      const menuItemWithId = {
        ...item,
        id: uuidv4(),
      };
      
      // Save the menu item to the database
      await createNewMenuItem(menuItemWithId);
    });
    
    // Wait for all menu items to be saved
    await Promise.all(savePromises);
    
    return true;
  } catch (error) {
    console.error('Error saving menu items:', error);
    return false;
  }
}
