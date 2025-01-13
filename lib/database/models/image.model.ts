/**
 * Image Model Definition
 *
 * This module defines the schema and interface for storing image data in MongoDB.
 * It handles both original and transformed images, storing metadata about the
 * transformations and the image properties.
 *
 * Features:
 * - Stores original and transformed image URLs
 * - Tracks image dimensions and properties
 * - Maintains transformation configurations
 * - Links images to their authors
 * - Implements timestamps for creation and updates
 */

import { Document, Schema, model, models } from "mongoose";

/**
 * Image Document Interface
 * Extends Mongoose Document to provide type safety for image properties
 */
export interface IImage extends Document {
  title: string;                // Name or description of the image
  transformationType: string;   // Type of transformation applied (e.g., restore, removeBackground)
  publicId: string;            // Cloudinary public ID for the image
  secureURL: string;           // Secure URL to access the image
  width?: number;              // Image width in pixels
  height?: number;             // Image height in pixels
  config?: object;             // Configuration used for transformation
  transformationUrl?: string;  // URL of the transformed image
  aspectRatio?: string;        // Image aspect ratio
  color?: string;              // Dominant or relevant color information
  prompt?: string;             // Prompt used for AI transformation
  author: {                    // User who created/owns the image
    _id: string;
    firstName: string;
    lastName: string;
  }
  createdAt?: Date;           // Timestamp of creation
  updatedAt?: Date;           // Timestamp of last update
}

/**
 * Mongoose Schema for Image Model
 * Defines the structure and validation rules for image documents
 */
const ImageSchema = new Schema({
  title: { type: String, required: true },
  transformationType: { type: String, required: true },
  publicId: { type: String, required: true },
  secureURL: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  config: { type: Object },
  transformationUrl: { type: String },
  aspectRatio: { type: String },
  color: { type: String },
  prompt: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },  // Reference to User model
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create or retrieve the Image model
// Uses Mongoose's models object to prevent model recompilation
const Image = models?.Image || model('Image', ImageSchema);

export default Image;