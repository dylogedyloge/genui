import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    noteId: v.id("note"),
    message: v.string(),
    by: v.union(v.literal("user"), v.literal("bot")),
  },
  handler: async (ctx, { noteId, message, by }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Save the message in the chats table
    await ctx.db.insert("chats", {
      noteId,
      data: message,
      userId,
      by,
    });
  },
});

// Define the getMessages query
export const getMessages = query({
  args: { noteId: v.id("note") },
  handler: async (ctx, args) => {
    // Get the current user's identity
    const identity = await ctx.auth.getUserIdentity();
    
    // If no identity is found, throw a more informative error
    if (!identity) {
      console.error("No user identity found for getMessages query");
      throw new Error("You must be logged in to view messages");
    }

    // Get the user's ID from the identity
    const userId = identity.subject;

    // Verify that the note belongs to the current user
    const note = await ctx.db.get(args.noteId);
    
    if (!note) {
      console.error(`Note with ID ${args.noteId} not found`);
      throw new Error("Chat session not found");
    }

    if (note.userId !== userId) {
      console.error(`User ${userId} tried to access note ${args.noteId} they don't own`);
      throw new Error("You are not authorized to view these messages");
    }

    // Fetch messages for the specific note
    const messages = await ctx.db
      .query("chats")
      .withIndex("by_note", (q) => q.eq("noteId", args.noteId))
      .collect();

    return messages;
  },
});