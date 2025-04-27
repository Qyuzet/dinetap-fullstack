// @ts-nocheck
import { MongoClient, MongoClientOptions } from "mongodb";

// Check if we're running on the server side
const isServer = typeof window === "undefined";

// Check for MongoDB URI
let uri = process.env.MONGODB_URI;

// For build process, provide a dummy URI if not available
if (!uri) {
  console.warn(
    "MongoDB URI not found in environment variables. Using dummy URI for build process."
  );
  uri = "mongodb://localhost:27017/dinetap";
}
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
