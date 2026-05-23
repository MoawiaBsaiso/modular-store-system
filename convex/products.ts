import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 1. دالة الجلب (Query): لقراءة جميع المنتجات من قاعدة البيانات وعرضها حياً
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

/**
 * 2. دالة الإضافة (Mutation): لاستقبال بيانات المنتج الجديد وتخزينها سحابياً
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    images: v.array(v.string()),
    category: v.string(),
    stock: v.number(),
    sku: v.string(),
  },
  handler: async (ctx, args) => {
    const productId = await ctx.db.insert("products", {
      title: args.title,
      description: args.description,
      price: args.price,
      compareAtPrice: args.compareAtPrice,
      images: args.images,
      category: args.category,
      stock: args.stock,
      sku: args.sku,
    });
    return productId;
  },
});