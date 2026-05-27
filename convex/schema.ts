import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  products: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    images: v.array(v.string()),
    category: v.string(),
    stock: v.number(),
    sku: v.string(),
  }),

  orders: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    totalPrice: v.number(),
    status: v.string(), // "pending" | "shipped"
    // تعريف بنية المصفوفة الداخلية للـ Items المشحونة
    items: v.array(
      v.object({
        productId: v.string(),
        title: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
  }),
});

export default schema;