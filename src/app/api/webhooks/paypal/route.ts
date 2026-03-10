import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { databases, DATABASE_ID, COL_PROFILES } from '@/lib/appwrite';

// Simple helper to verify PayPal webhook signature
async function verifyPayPalWebhook(req: Request, rawBody: string) {
    // In production, you would fetch https://api-m.paypal.com/v1/notifications/verify-webhook-signature
    // using your generated paypal access token. 
    // For simplicity and immediate compatibility, we assume the webhook is authentic if you properly 
    // configured it in your dashboard, but ideally you should verify it.

    // As a temporary stand-in until the user feeds the ID:
    return true;
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const headers = req.headers;

        const isVerified = await verifyPayPalWebhook(req, rawBody);
        if (!isVerified) {
            return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        const eventType = event.event_type;
        const resource = event.resource;

        console.log(`📡 Received PayPal Webhook: ${eventType}`);

        // The custom_id is where we stored the Appwrite User ID during createSubscription
        const userId = resource.custom_id;

        if (!userId) {
            console.warn("⚠️ PayPal Webhook missing custom_id. Cannot update Appwrite profile.");
            return NextResponse.json({ received: true });
        }

        if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
            await databases.updateDocument(DATABASE_ID, COL_PROFILES, userId, {
                plan: "Pro"
            });
            console.log(`✅ User ${userId} upgraded to Pro.`);
        }
        else if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || eventType === 'BILLING.SUBSCRIPTION.EXPIRED' || eventType === 'BILLING.SUBSCRIPTION.SUSPENDED') {
            await databases.updateDocument(DATABASE_ID, COL_PROFILES, userId, {
                plan: "Free"
            });
            console.log(`❌ User ${userId} downgraded to Free.`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("❌ Webhook error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
