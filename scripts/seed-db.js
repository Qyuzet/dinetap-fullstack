// Simple script to seed the database
// Run with: node scripts/seed-db.js

const fetch = require('node-fetch');

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Call the seed API endpoint
    const response = await fetch('http://localhost:3000/api/seed');
    const data = await response.json();
    
    if (data.success) {
      console.log('Database seeded successfully!');
      console.log(`Created ${data.data.portals} portals and ${data.data.menuItems} menu items.`);
    } else {
      console.error('Failed to seed database:', data.error);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

seedDatabase();
