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
 * 2. دالة الجلب بالـ ID: لجلب منتج واحد بمعرّفه
 * نستخدمها في صفحة المنتج المفردة /products/[id]
 *
 * شرح مهم عن Convex IDs:
 * كل document في Convex عنده _id من نوع Id<"products">
 * وهو ليس string عادي — Convex يتحقق منه تلقائياً
 * v.id("products") يقول لـ Convex: "هاد الـ argument لازم يكون ID صحيح من جدول products"
 */
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

/**
 * 3. دالة الإضافة (Mutation): لاستقبال بيانات المنتج الجديد وتخزينها سحابياً
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