/**
 * Transaction Model Definition
 *
 * This module defines the schema for financial transactions in MongoDB,
 * tracking purchases of credits and subscription plans through Stripe.
 * It maintains a record of all financial interactions within the platform.
 *
 * Features:
 * - Stripe payment integration
 * - Credit purchase tracking
 * - Subscription plan records
 * - User purchase history
 * - Timestamp tracking
 */

import { Schema, model, models } from "mongoose";

/**
 * Mongoose Schema for Transaction Model
 * Defines the structure and validation rules for payment transactions
 */
const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,      // Automatically set timestamp when transaction is created
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,           // Unique Stripe payment identifier to prevent duplicate transactions
  },
  amount: {
    type: Number,
    required: true,         // Payment amount in smallest currency unit (e.g., cents)
  },
  plan: {
    type: String,          // Subscription plan identifier (if applicable)
  },
  credits: {
    type: Number,          // Number of credits purchased (if applicable)
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",           // Reference to the User who made the purchase
  },
});

// Create or retrieve the Transaction model
// Uses Mongoose's models object to prevent model recompilation
const Transaction = models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;