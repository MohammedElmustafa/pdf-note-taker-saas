import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Mutation: Add or update notes for a given fileId.
 * - If no record exists, insert a new one.
 * - If a record exists, patch the existing notes field.
 */
export const AddNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string()
  },
  handler: async (ctx, args) => {
    // Query existing notes records for this fileId
    const records = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("fileId"), args.fileId))
      .collect();

    if (records.length === 0) {
      // No existing record: insert new
      await ctx.db.insert("notes", {
        fileId: args.fileId,
        notes: args.notes,
        createdBy: args.createdBy
      });
      return "Inserted new record.";
    } else {
      // Existing record: update notes field
      await ctx.db.patch(records[0]._id, {
        notes: args.notes
      });
      return "Updated existing record.";
    }
  }
});

/**
 * Query: Retrieve notes content for a given fileId.
 * Returns the notes field or null if not found.
 */
export const GetNotes = query({
  args: {
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("notes")
      .filter(q => q.eq(q.field("fileId"), args.fileId))
      .collect();

    // Return the notes content or undefined
    return result[0]?.notes;
  }
});
