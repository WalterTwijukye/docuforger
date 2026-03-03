import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient, DATABASE_ID, COL_PROFILES } from "@/lib/appwrite-admin";

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-signature");

        if (!signature || !WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Invalid signature or missing secret." }, { status: 401 });
        }

        // Verify the signature securely
        const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
        const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature, "utf8");

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
        }

        const data = JSON.parse(rawBody);
        const eventName = data.meta.event_name;
        const obj = data.data.attributes;

        console.log(`Webhook received: ${eventName}`);

        // Handle events we care about
        if (
            eventName === "subscription_created" ||
            eventName === "subscription_updated" ||
            eventName === "subscription_cancelled" ||
            eventName === "subscription_expired"
        ) {
            const userId = data.meta.custom_data?.user_id;

            if (!userId) {
                console.error("No user_id found in custom_data");
                return NextResponse.json({ error: "Missing custom_data" }, { status: 400 });
            }

            // Map variant IDs to our plans (should be configured server-side/env)
            const isPro = obj.variant_id.toString() === process.env.LEMON_SQUEEZY_PRO_VARIANT_ID;
            const isEnterprise = obj.variant_id.toString() === process.env.LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID;

            let planName = "Free";
            if (obj.status === "active" || obj.status === "past_due" || obj.status === "on_trial") {
                if (isPro) planName = "Pro";
                else if (isEnterprise) planName = "Enterprise";
            }

            // If cancelled/expired, and not active, it defaults back to 'Free'

            // Update user in Appwrite securely 
            const { databases } = createAdminClient();

            await databases.updateDocument(DATABASE_ID, COL_PROFILES, userId, {
                plan: planName,
                // store subscription ID for later syncing or cancellation if needed:
                // lemonSqueezySubscriptionId: obj.first_subscription_item.subscription_id
            });

            console.log(`Updated user ${userId} to plan ${planName}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
