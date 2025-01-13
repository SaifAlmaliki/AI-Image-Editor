/**
 * Global Type Definitions
 *
 * This module contains TypeScript type definitions for the entire application,
 * covering user management, image transformations, transactions, and URL handling.
 * These types ensure type safety across the application's features.
 *
 * Categories:
 * - User Types: For user creation and updates
 * - Image Types: For image manipulation and storage
 * - Transaction Types: For payment processing
 * - URL Types: For query parameter handling
 * - Component Props: For React component type safety
 */

/* eslint-disable no-unused-vars */

// ====== USER PARAMS
/**
 * Parameters required for creating a new user
 * Maps to Clerk authentication data
 */
declare type CreateUserParams = {
  clerkId: string;      // Unique identifier from Clerk
  email: string;        // User's email address
  username: string;     // Chosen username
  firstName: string;    // User's first name
  lastName: string;     // User's last name
  photo: string;        // URL to profile photo
};

/**
 * Parameters allowed for updating user profile
 * Subset of CreateUserParams (excluding immutable fields)
 */
declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== IMAGE PARAMS
/**
 * Parameters for adding a new image
 * Includes transformation details and metadata
 */
declare type AddImageParams = {
  image: {
    title: string;              // Image title/description
    publicId: string;           // Cloudinary public ID
    transformationType: string; // Type of transformation applied
    width: number;             // Image width in pixels
    height: number;            // Image height in pixels
    config: any;               // Transformation configuration
    secureURL: string;         // Original image URL
    transformationURL: string; // Transformed image URL
    aspectRatio: string | undefined;  // Image aspect ratio
    prompt: string | undefined;       // AI transformation prompt
    color: string | undefined;        // Color transformation data
  };
  userId: string;              // Owner of the image
  path: string;                // Storage path
};

/**
 * Parameters for updating an existing image
 * Extends AddImageParams with image ID
 */
declare type UpdateImageParams = {
  image: {
    _id: string;               // MongoDB document ID
    title: string;
    publicId: string;
    transformationType: string;
    width: number;
    height: number;
    config: any;
    secureURL: string;
    transformationURL: string;
    aspectRatio: string | undefined;
    prompt: string | undefined;
    color: string | undefined;
  };
  userId: string;
  path: string;
};

/**
 * Configuration options for different types of image transformations
 */
declare type Transformations = {
  restore?: boolean;           // Image restoration
  fillBackground?: boolean;    // Background completion
  remove?: {                   // Object removal
    prompt: string;            // What to remove
    removeShadow?: boolean;    // Remove shadows
    multiple?: boolean;        // Remove multiple instances
  };
  recolor?: {                 // Color transformation
    prompt?: string;          // What to recolor
    to: string;               // Target color
    multiple?: boolean;       // Recolor multiple elements
  };
  removeBackground?: boolean; // Background removal
};

// ====== TRANSACTION PARAMS
/**
 * Parameters for initiating a checkout transaction
 */
declare type CheckoutTransactionParams = {
  plan: string;        // Subscription plan identifier
  credits: number;     // Number of credits to purchase
  amount: number;      // Transaction amount
  buyerId: string;     // User making the purchase
};

/**
 * Parameters for creating a transaction record
 */
declare type CreateTransactionParams = {
  stripeId: string;    // Stripe payment identifier
  amount: number;      // Transaction amount
  credits: number;     // Credits purchased
  plan: string;        // Plan purchased
  buyerId: string;     // User who made the purchase
  createdAt: Date;     // Transaction timestamp
};

/**
 * Valid transformation types for type checking
 */
declare type TransformationTypeKey =
  | "restore"
  | "fill"
  | "remove"
  | "recolor"
  | "removeBackground";

// ====== URL QUERY PARAMS
/**
 * Types for handling URL query parameters
 * Used in routing and navigation
 */
declare type FormUrlQueryParams = {
  searchParams: string;    // Current search parameters
  key: string;            // Parameter key to modify
  value: string | number | null; // New value for the parameter
};

/**
 * Types for handling URL query parameters
 * Used in routing and navigation
 */
declare type UrlQueryParams = {
  params: string;        // Current URL parameters
  key: string;           // Parameter key to modify
  value: string | null;  // New value for the parameter
};

/**
 * Types for removing URL query parameters
 * Used in routing and navigation
 */
declare type RemoveUrlQueryParams = {
  searchParams: string;  // Current search parameters
  keysToRemove: string[]; // Keys to remove from the parameters
};

/**
 * Types for handling search parameters
 * Used in routing and navigation
 */
declare type SearchParamProps = {
  params: { id: string; type: TransformationTypeKey };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Types for handling transformation form props
 * Used in React components
 */
declare type TransformationFormProps = {
  action: "Add" | "Update"; // Form action type
  userId: string;          // User ID for the transformation
  type: TransformationTypeKey; // Transformation type
  creditBalance: number;   // User's current credit balance
  data?: IImage | null;    // Image data for the transformation
  config?: Transformations | null; // Transformation configuration
};

/**
 * Types for handling transformed image props
 * Used in React components
 */
declare type TransformedImageProps = {
  image: any;              // Transformed image data
  type: string;            // Transformation type
  title: string;           // Image title
  transformationConfig: Transformations | null; // Transformation configuration
  isTransforming: boolean; // Flag indicating if the image is being transformed
  hasDownload?: boolean;   // Flag indicating if the image has been downloaded
  setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>; // Setter for the isTransforming flag
};