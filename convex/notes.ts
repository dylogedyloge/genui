import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  handler: async (ctx) => {
    try {
      // More detailed authentication check
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        console.error("No authentication identity found");
        throw new Error("Not authenticated");
      }

      const userId = identity.subject;
      if (!userId) {
        console.error("No user ID found in identity");
        throw new Error("User ID is missing");
      }

      console.log(`Creating note for user: ${userId}`);

      // Create a new note (chat session)
      const noteId = await ctx.db.insert("note", {
        title: `Chat ${new Date().toLocaleString()}`,
        userId: userId,
        createdAt: Date.now(),
      });

      console.log(`Note created with ID: ${noteId}`);

      // Optional: Create initial system message
      await ctx.db.insert("chats", {
        noteId,
        data: "How can I help you today?",
        userId: userId,
        by: "bot"
      });

      return noteId;
    } catch (error) {
      console.error("Error in create mutation:", error);
      throw error; // Re-throw to propagate the error
    }
  },
});
export const getNotes = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Fetch all notes (chat sessions) for the logged-in user
    const notes = await ctx.db
      .query("note")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc") // Sort by creation time
      .collect();

    return notes;
  },
});