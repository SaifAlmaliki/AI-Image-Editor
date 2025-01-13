/**
 * User Actions Module
 *
 * This module provides server-side actions for managing user data in the application.
 * It implements CRUD operations and credit management for users, integrating with
 * Clerk authentication and MongoDB through Mongoose.
 *
 * Features:
 * - User creation and management
 * - Credit balance operations
 * - Clerk ID-based user lookup
 * - Error handling and response formatting
 * - Cache revalidation for UI updates
 */

"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

/**
 * Creates a new user in the database
 * @param user User data from Clerk authentication
 * @returns Newly created user object
 */
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser)); // Serialize for safe transmission
  } catch (error) {
    handleError(error);
  }
}

/**
 * Retrieves a user by their Clerk ID
 * @param userId Clerk authentication ID
 * @returns User object if found
 * @throws Error if user not found
 */
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

/**
 * Updates user information in the database
 * @param clerkId Clerk authentication ID
 * @param user Updated user data
 * @returns Updated user object
 * @throws Error if update fails
 */
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      user,
      { new: true } // Return updated document
    );

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

/**
 * Deletes a user from the database
 * @param clerkId Clerk authentication ID
 * @returns Deleted user object or null
 * @throws Error if user not found
 */
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user and revalidate UI cache
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/"); // Update UI to reflect deletion

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Updates user's credit balance
 * @param userId MongoDB user ID
 * @param creditFee Amount to modify credits by (positive or negative)
 * @returns Updated user object with new credit balance
 * @throws Error if credit update fails
 */
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }}, // Increment/decrement credits
      { new: true }
    )

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}