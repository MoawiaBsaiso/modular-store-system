import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a short-lived upload URL for the client to PUT the file directly
// to Convex Storage. The client calls this first, uploads the file, then
// passes the returned storageId to saveImage.
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Persist the storageId and return the public URL so the product form
// can include it in the images array.
export const getImageUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
