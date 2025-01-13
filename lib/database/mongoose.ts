/**
 * MongoDB Connection Manager
 *
 * This module manages the MongoDB connection using Mongoose, implementing a singleton pattern
 * to reuse the database connection across multiple requests in a Next.js application.
 *
 * Key features:
 * - Connection caching to prevent multiple unnecessary database connections
 * - Global connection state management
 * - Type-safe implementation using TypeScript
 * - Error handling for missing MongoDB URL
 */

import mongoose, { Mongoose } from 'mongoose';

// Load MongoDB connection string from environment variables
const MONGODB_URL = process.env.MONGODB_URL;

// Type definition for the cached connection state
interface MongooseConnection {
  conn: Mongoose | null;              // Active connection instance
  promise: Promise<Mongoose> | null;  // Connection promise for handling async connection
}

// Get cached connection from global scope or initialize if not exists
let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null
  }
}

/**
 * Establishes and manages a connection to MongoDB
 * @returns Promise<Mongoose> - A promise that resolves to the Mongoose connection
 * @throws Error if MONGODB_URL is not defined in environment variables
 */
export const connectToDatabase = async () => {
  // Return existing connection if available
  if(cached.conn) return cached.conn;

  // Validate MongoDB URL
  if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  // Create new connection if none exists
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'imaginify',  // Database name
      bufferCommands: false // Disable mongoose buffering
    })

  // Wait for connection to establish and cache it
  cached.conn = await cached.promise;

  return cached.conn;
}