import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/send-order",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // 1. استقبال البيانات القادمة من دالة placeOrder
    const body = await request.json();

    // 2. إرسال البيانات فوراً إلى رابط n8n (سنضع الرابط هنا لاحقاً)
    const n8nWebhookUrl = "http://127.0.0.1:5678/webhook-test/orders"; 

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return new Response(JSON.stringify({ success: false, error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;