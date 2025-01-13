/**
 * Clerk Webhook Handler
 *
 * This module handles webhook events from Clerk authentication service,
 * synchronizing user data between Clerk and our MongoDB database.
 * It processes user creation, updates, and deletion events.
 *
 * Features:
 * - Webhook signature verification using Svix
 * - User data synchronization
 * - Clerk metadata management
 * - Error handling and validation
 * - Secure event processing
 */

/* eslint-disable camelcase */
import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

/**
 * POST handler for Clerk webhook events
 * Processes user lifecycle events (create, update, delete)
 */
export async function POST(req: Request) {
  // Validate webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Extract Svix webhook headers for verification
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Validate required headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Parse and prepare webhook payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Initialize Svix webhook verifier
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify webhook signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Extract event data
  const { id } = evt.data;
  const eventType = evt.type;

  // Handle user creation event
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    // Prepare user data for database
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };

    // Create user in our database
    const newUser = await createUser(user);

    // Update Clerk metadata with our database ID
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "OK", user: newUser });
  }

  // Handle user update event
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;

    // Prepare updated user data
    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };

    // Update user in our database
    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }

  // Handle user deletion event
  if (eventType === "user.deleted") {
    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}