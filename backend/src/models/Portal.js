const { ObjectId } = require('mongodb');

// Portal model structure
const PortalSchema = {
  _id: ObjectId,
  id: String,
  name: String,
  description: String,
  createdAt: Date,
  status: String, // "active" | "inactive" | "draft"
  userId: String,
  colors: {
    primary: String,
    secondary: String,
    accent: String,
  },
  logo: String,
  menuItems: Array,
  settings: {
    currency: String,
    taxRate: Number,
    deliveryFee: Number,
    minOrderForFreeDelivery: Number,
  },
};

// MenuItem model structure
const MenuItemSchema = {
  id: String,
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  tags: Array,
  available: Boolean,
  portalId: String,
};

// Convert MongoDB document to Portal object
function mapPortalDocument(doc) {
  if (!doc) return null;
  
  return {
    _id: doc._id,
    id: doc.id,
    name: doc.name,
    description: doc.description,
    createdAt: new Date(doc.createdAt),
    status: doc.status,
    userId: doc.userId,
    colors: doc.colors,
    logo: doc.logo,
    menuItems: doc.menuItems,
    settings: doc.settings,
  };
}

// Convert MongoDB document to MenuItem object
function mapMenuItemDocument(doc) {
  if (!doc) return null;
  
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    category: doc.category,
    tags: doc.tags,
    available: doc.available,
    portalId: doc.portalId,
  };
}

// Validation functions
function validatePortal(portal) {
  const errors = [];
  
  if (!portal.name || portal.name.trim().length === 0) {
    errors.push('Portal name is required');
  }
  
  if (!portal.description || portal.description.trim().length === 0) {
    errors.push('Portal description is required');
  }
  
  if (!portal.userId || portal.userId.trim().length === 0) {
    errors.push('User ID is required');
  }
  
  if (portal.status && !['active', 'inactive', 'draft'].includes(portal.status)) {
    errors.push('Invalid portal status');
  }
  
  return errors;
}

function validateMenuItem(menuItem) {
  const errors = [];
  
  if (!menuItem.name || menuItem.name.trim().length === 0) {
    errors.push('Menu item name is required');
  }
  
  if (!menuItem.description || menuItem.description.trim().length === 0) {
    errors.push('Menu item description is required');
  }
  
  if (typeof menuItem.price !== 'number' || menuItem.price < 0) {
    errors.push('Valid price is required');
  }
  
  if (!menuItem.category || menuItem.category.trim().length === 0) {
    errors.push('Menu item category is required');
  }
  
  if (!menuItem.portalId || menuItem.portalId.trim().length === 0) {
    errors.push('Portal ID is required');
  }
  
  return errors;
}

module.exports = {
  PortalSchema,
  MenuItemSchema,
  mapPortalDocument,
  mapMenuItemDocument,
  validatePortal,
  validateMenuItem,
};
