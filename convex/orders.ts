import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * دالة جلب جميع الطلبات للمشرف
 */
export const getAlldetails = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

/**
 * 1️⃣ الـ Mutation: وظيفته فقط فحص المخزن وتعديل قاعدة البيانات
 */
export const placeOrderMutation = mutation({
  args: {
    customerName: v.string(),
    customerPhone: v.string(),
    totalPrice: v.number(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        title: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // فحص أمان المخزون
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`عذراً، المنتج [${item.title}] نفذت كميته!`);
      }
    }

    // خصم الكميات من المخزن
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: product.stock - item.quantity,
        });
      }
    }

    // تسجيل الطلب
    const orderPayload = {
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      totalPrice: args.totalPrice,
      status: "pending",
      items: args.items,
    };

    return await ctx.db.insert("orders", orderPayload);
  },
});

/**
 * 2️⃣ 🚀 الـ Action: الدالة المركزية التي يستدعيها المتجر للاتصال بـ n8n
 */
export const placeOrder = action({
  args: {
    customerName: v.string(),
    customerPhone: v.string(),
    totalPrice: v.number(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        title: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    loop: v.boolean(),
  },
  handler: async (ctx, args): Promise<string> => {
    // أ. تشغيل الـ Mutation لتحديث قاعدة البيانات والحصول على معرف الطلب
    const orderId = (await ctx.runMutation(api.orders.placeOrderMutation, {
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      totalPrice: args.totalPrice,
      items: args.items,
    })) as string;

    // 💡 ضع رابط النفق الخاص بك هنا بدقة متبوعاً بـ /webhook-test/orders
    const n8nWebhookUrl = "http://127.0.0.1:5678/webhook-test/orders"; 

    // ب. إرسال البيانات فوراً لـ n8n
    try {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerName: args.customerName,
          customerPhone: args.customerPhone,
          totalPrice: args.totalPrice,
          items: args.items,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error("فشل إرسال البيانات إلى n8n:", error);
    }

    return orderId;
  },
});

/**
 * تحديث حالة الطلب
 */
export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});