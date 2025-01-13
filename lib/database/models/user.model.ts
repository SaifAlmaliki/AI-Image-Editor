/**
 * User Model Definition
 *
 * This module defines the schema for user data in MongoDB, integrating with Clerk
 * for authentication and managing user-specific features of the image generation platform.
 *
 * Features:
 * - Clerk authentication integration
 * - User profile management
 * - Subscription plan tracking
 * - Credit balance system for image transformations
 * - Unique constraint enforcement on critical fields
 */

import { Schema, model, models } from "mongoose";

/**
 * Mongoose Schema for User Model
 * Defines the structure and validation rules for user documents
 */
const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,         // Ensures one-to-one mapping with Clerk user
  },
  email: {
    type: String,
    required: true,
    unique: true,         // Prevents duplicate email addresses
  },
  username: {
    type: String,
    required: true,
    unique: true,         // Ensures username uniqueness
  },
  photo: {
    type: String,
    required: true,       // User's profile photo URL
  },
  firstName: {
    type: String,         // Optional first name
  },
  lastName: {
    type: String,         // Optional last name
  },
  planId: {
    type: Number,
    default: 1,           // Default to free plan (plan ID: 1)
  },
  creditBalance: {
    type: Number,
    default: 10,          // Initial credit balance for new users
  },
});

// Create or retrieve the User model
// Uses Mongoose's models object to prevent model recompilation
const User = models?.User || model("User", UserSchema);

export default User;