const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection configuration
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MongoDB URI not found in environment variables');
  process.exit(1);
}

// MongoDB connection options optimized for rate limiting
const options = {
  serverSelectionTimeoutMS: 15000, // 15 seconds
  connectTimeoutMS: 15000,
  socketTimeoutMS: 60000, // Close sockets after 60 seconds of inactivity
  maxPoolSize: 5, // Reduced to 5 socket connections to avoid rate limiting
  minPoolSize: 1, // Minimum number of connections
  maxIdleTimeMS: 60000, // Close connections after 60 seconds of inactivity
  retryWrites: true, // Enable retryable writes
  retryReads: true, // Enable retryable reads
  // Note: bufferMaxEntries and bufferCommands are Mongoose options, not MongoDB driver options
};

let client;
let clientPromise;

// Initialize MongoDB connection
const connectToDatabase = async () => {
  if (clientPromise) {
    return clientPromise;
  }

  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    
    console.log('Connecting to MongoDB...');
    await clientPromise;
    console.log('Successfully connected to MongoDB');
    
    return clientPromise;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

// Get database instance with retry logic
const getDatabase = async (retries = 3) => {
  try {
    const client = await connectToDatabase();
    return client.db();
  } catch (error) {
    if (retries > 0 && (error.message.includes('too many requests') || error.message.includes('rate limit'))) {
      console.log(`Rate limited, retrying in 2 seconds... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getDatabase(retries - 1);
    }
    throw error;
  }
};

// Graceful shutdown
const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectToDatabase,
  getDatabase,
  closeConnection
};
