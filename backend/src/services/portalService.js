const { getDatabase } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { mapPortalDocument, validatePortal } = require('../models/Portal');

class PortalService {
  constructor() {
    this.collectionName = 'portals';
  }

  async getUserPortals(userId) {
    try {
      const db = await getDatabase();
      const portalsCollection = db.collection(this.collectionName);

      const portals = await portalsCollection.find({ userId }).toArray();
      return portals.map(mapPortalDocument);
    } catch (error) {
      console.error('Error fetching user portals:', error);
      throw new Error('Failed to fetch user portals');
    }
  }

  async getPortalById(id) {
    try {
      const db = await getDatabase();
      const portalsCollection = db.collection(this.collectionName);

      const portal = await portalsCollection.findOne({ id });
      return mapPortalDocument(portal);
    } catch (error) {
      console.error('Error fetching portal by ID:', error);
      throw new Error('Failed to fetch portal');
    }
  }

  async createPortal(portalData) {
    try {
      // Validate portal data
      const validationErrors = validatePortal(portalData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const db = await getDatabase();
      const portalsCollection = db.collection(this.collectionName);

      const newPortal = {
        ...portalData,
        id: uuidv4(),
        createdAt: new Date(),
        status: portalData.status || 'draft',
      };

      const result = await portalsCollection.insertOne(newPortal);
      
      if (!result.insertedId) {
        throw new Error('Failed to create portal');
      }

      return mapPortalDocument(newPortal);
    } catch (error) {
      console.error('Error creating portal:', error);
      throw error;
    }
  }

  async updatePortal(id, portalData) {
    try {
      const db = await getDatabase();
      const portalsCollection = db.collection(this.collectionName);

      // Add updatedAt timestamp
      const updateData = {
        ...portalData,
        updatedAt: new Date(),
      };

      const result = await portalsCollection.updateOne(
        { id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Portal not found');
      }

      // Get the updated portal
      const updatedPortal = await portalsCollection.findOne({ id });
      return mapPortalDocument(updatedPortal);
    } catch (error) {
      console.error('Error updating portal:', error);
      throw error;
    }
  }

  async deletePortal(id) {
    try {
      const db = await getDatabase();
      const portalsCollection = db.collection(this.collectionName);

      const result = await portalsCollection.deleteOne({ id });
      
      if (result.deletedCount === 0) {
        throw new Error('Portal not found');
      }

      return true;
    } catch (error) {
      console.error('Error deleting portal:', error);
      throw error;
    }
  }

  async getPortalsByStatus(status) {
    try {
      const db = await getDatabase();
      const portalsCollection = db.collection(this.collectionName);

      const portals = await portalsCollection.find({ status }).toArray();
      return portals.map(mapPortalDocument);
    } catch (error) {
      console.error('Error fetching portals by status:', error);
      throw new Error('Failed to fetch portals by status');
    }
  }

  async searchPortals(searchTerm, userId = null) {
    try {
      const db = await getDatabase();
      const portalsCollection = db.collection(this.collectionName);

      const searchQuery = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };

      if (userId) {
        searchQuery.userId = userId;
      }

      const portals = await portalsCollection.find(searchQuery).toArray();
      return portals.map(mapPortalDocument);
    } catch (error) {
      console.error('Error searching portals:', error);
      throw new Error('Failed to search portals');
    }
  }
}

module.exports = new PortalService();
