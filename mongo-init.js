// MongoDB initialization script
db = db.getSiblingDB('dinetap');

// Create collections
db.createCollection('users');
db.createCollection('portals');
db.createCollection('orders');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.portals.createIndex({ "slug": 1 }, { unique: true });
db.orders.createIndex({ "portalId": 1 });
db.orders.createIndex({ "createdAt": 1 });

// Insert sample data
db.users.insertOne({
  name: "Admin User",
  email: "admin@dinetap.com",
  role: "admin",
  createdAt: new Date()
});

print('Database initialized successfully!');
