const { getDatabase } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { mapMenuItemDocument, validateMenuItem } = require('../models/Portal');
const { executeWithRetry, throttle } = require('../utils/dbUtils');

class MenuService {
  constructor() {
    this.collectionName = 'menuItems';
  }

  async getMenuItems(portalId) {
    return await executeWithRetry(async () => {
      try {
        console.log('🔍 Fetching menu items for portal:', portalId);

        // Add throttling to reduce database load
        await throttle(50);

        const db = await getDatabase();
        const menuItemsCollection = db.collection(this.collectionName);

        const menuItems = await menuItemsCollection.find({ portalId }).toArray();
        console.log(`📋 Found ${menuItems.length} menu items for portal ${portalId}`);

        const mappedItems = menuItems.map(mapMenuItemDocument);
        console.log('✅ Menu items mapped successfully');

        return mappedItems;
      } catch (error) {
        console.error('❌ Error fetching menu items:', error);
        throw new Error('Failed to fetch menu items');
      }
    });
  }

  async getMenuItemById(id) {
    try {
      const db = await getDatabase();
      const menuItemsCollection = db.collection(this.collectionName);

      const menuItem = await menuItemsCollection.findOne({ id });
      return mapMenuItemDocument(menuItem);
    } catch (error) {
      console.error('Error fetching menu item by ID:', error);
      throw new Error('Failed to fetch menu item');
    }
  }

  async createMenuItem(menuItemData) {
    return await executeWithRetry(async () => {
      try {
        console.log('🍽️ Creating menu item:', menuItemData);

        // Validate menu item data
        const validationErrors = validateMenuItem(menuItemData);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        // Add throttling to reduce database load
        await throttle(100);

        const db = await getDatabase();
        const menuItemsCollection = db.collection(this.collectionName);

        const newMenuItem = {
          ...menuItemData,
          id: uuidv4(),
          available: menuItemData.available !== undefined ? menuItemData.available : true,
          tags: menuItemData.tags || [],
          createdAt: new Date(),
        };

        console.log('💾 Inserting menu item into database:', newMenuItem);
        const result = await menuItemsCollection.insertOne(newMenuItem);

        if (!result.insertedId) {
          throw new Error('Failed to create menu item - no insertedId returned');
        }

        console.log('✅ Menu item created successfully with ID:', result.insertedId);
        const createdItem = mapMenuItemDocument(newMenuItem);
        console.log('📋 Mapped menu item:', createdItem);

        return createdItem;
      } catch (error) {
        console.error('❌ Error creating menu item:', error);
        throw error;
      }
    });
  }

  async updateMenuItem(id, menuItemData) {
    try {
      const db = await getDatabase();
      const menuItemsCollection = db.collection(this.collectionName);

      // Add updatedAt timestamp
      const updateData = {
        ...menuItemData,
        updatedAt: new Date(),
      };

      const result = await menuItemsCollection.updateOne(
        { id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Menu item not found');
      }

      // Get the updated menu item
      const updatedMenuItem = await menuItemsCollection.findOne({ id });
      return mapMenuItemDocument(updatedMenuItem);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  }

  async deleteMenuItem(id) {
    try {
      const db = await getDatabase();
      const menuItemsCollection = db.collection(this.collectionName);

      const result = await menuItemsCollection.deleteOne({ id });
      
      if (result.deletedCount === 0) {
        throw new Error('Menu item not found');
      }

      return true;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  }

  async getMenuItemsByCategory(portalId, category) {
    try {
      const db = await getDatabase();
      const menuItemsCollection = db.collection(this.collectionName);

      const menuItems = await menuItemsCollection
        .find({ portalId, category })
        .toArray();
      
      return menuItems.map(mapMenuItemDocument);
    } catch (error) {
      console.error('Error fetching menu items by category:', error);
      throw new Error('Failed to fetch menu items by category');
    }
  }

  async searchMenuItems(portalId, searchTerm) {
    try {
      const db = await getDatabase();
      const menuItemsCollection = db.collection(this.collectionName);

      const searchQuery = {
        portalId,
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      };

      const menuItems = await menuItemsCollection.find(searchQuery).toArray();
      return menuItems.map(mapMenuItemDocument);
    } catch (error) {
      console.error('Error searching menu items:', error);
      throw new Error('Failed to search menu items');
    }
  }

  async updateMenuItemAvailability(id, available) {
    try {
      const db = await getDatabase();
      const menuItemsCollection = db.collection(this.collectionName);

      const result = await menuItemsCollection.updateOne(
        { id },
        { 
          $set: { 
            available,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('Menu item not found');
      }

      const updatedMenuItem = await menuItemsCollection.findOne({ id });
      return mapMenuItemDocument(updatedMenuItem);
    } catch (error) {
      console.error('Error updating menu item availability:', error);
      throw error;
    }
  }

  async getMenuCategories(portalId) {
    try {
      const db = await getDatabase();
      const menuItemsCollection = db.collection(this.collectionName);

      const categories = await menuItemsCollection
        .distinct('category', { portalId });
      
      return categories.sort();
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      throw new Error('Failed to fetch menu categories');
    }
  }
}

module.exports = new MenuService();
