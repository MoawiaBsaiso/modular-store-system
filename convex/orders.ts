import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getAlldetails = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

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
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`عذراً، المنتج [${item.title}] نفذت كميته!`);
      }
    }

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: product.stock - item.quantity,
        });
      }
    }

    return await ctx.db.insert("orders", {
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      totalPrice: args.totalPrice,
      status: "pending",
      items: args.items,
    });
  },
});

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
    // 1. Save order to database
    const orderId = (await ctx.runMutation(api.orders.placeOrderMutation, {
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      totalPrice: args.totalPrice,
      items: args.items,
    })) as string;

    // 2. Send email notification via Resend
    // Set RESEND_API_KEY and NOTIFICATION_EMAIL in Convex Dashboard → Settings → Environment Variables
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (resendApiKey && notificationEmail) {
      try {
        const itemsList = args.items
          .map(i => `• ${i.title} × ${i.quantity} — ₪${(i.price * i.quantity).toFixed(2)}`)
          .join("\n");

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Salis Store <onboarding@resend.dev>",
            to: notificationEmail,
            subject: `طلب جديد من ${args.customerName} — ₪${args.totalPrice}`,
            text: [
              "طلب جديد على متجر Salis",
              "─────────────────────",
              `الاسم: ${args.customerName}`,
              `الهاتف: ${args.customerPhone}`,
              `الإجمالي: ₪${args.totalPrice}`,
              "",
              "المنتجات:",
              itemsList,
              "",
              `رقم الطلب: ${orderId}`,
            ].join("\n"),
          }),
        });
      } catch (error) {
        // Non-blocking — order is already saved even if email fails
        console.error("Email notification failed:", error);
      }
    }

    // 3. n8n webhook — uncomment when ready
    // const n8nUrl = process.env.N8N_WEBHOOK_URL;
    // if (n8nUrl) {
    //   try {
    //     await fetch(n8nUrl, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ orderId, ...args, timestamp: Date.now() }),
    //     });
    //   } catch (error) {
    //     console.error("n8n webhook failed:", error);
    //   }
    // }

    return orderId;
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});
