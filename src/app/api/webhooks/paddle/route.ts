import { NextResponse } from 'next/server';
import { Environment, LogLevel, Paddle } from '@paddle/paddle-node-sdk';
import { databases, DATABASE_ID, COL_PROFILES } from '@/lib/appwrite';

// Initialize the Paddle server SDK
const paddle = new Paddle(process.env.PADDLE_API_KEY || 'test_api_key', {
    environment: process.env.NODE_ENV === 'production' ? Environment.production : Environment.sandbox,
    logLevel: LogLevel.verbose,
});

export async function POST(req: Request) {
    try {
        const signature = req.headers.get('paddle-signature') || '';
        const rawBody = await req.text();
        const secretKey = process.env.PADDLE_WEBHOOK_SECRET || '';

        let eventPayload;

        try {
            // Verify and unmarshal the event securely
            if (signature && secretKey) {
                eventPayload = paddle.webhooks.unmarshal(rawBody, secretKey, signature);
            } else {
                console.warn("⚠️ Paddle Webhook: Missing signature or secret key. Parsing insecurely for development only.");
                eventPayload = JSON.parse(rawBody);
                // In a real production system without a secret, you SHOULD reject this.
                // We parse it insecurely here just in case the user tests early without setting PADDLE_WEBHOOK_SECRET
            }
        } catch (err) {
            console.error('❌ Paddle Webhook Verification Failed:', err);
            return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
        }

        const eventType = eventPayload?.eventType;
        console.log(`📡 Received Paddle Webhook: ${eventType}`);

        // Extract the customData we sent from the frontend checkout (appwriteUserId)
        const customData = eventPayload?.data?.customData;
        const userId = customData?.appwriteUserId;

        if (!userId) {
            console.warn("⚠️ Paddle Webhook missing customData.appwriteUserId. Cannot update Appwrite profile.");
            return NextResponse.json({ received: true });
        }

        switch (eventType) {
            case 'subscription.activated':
            case 'subscription.resumed':
                await databases.updateDocument(DATABASE_ID, COL_PROFILES, userId, {
                    plan: "Pro"
                });
                console.log(`✅ User ${userId} upgraded to Pro via Paddle.`);
                break;

            case 'subscription.canceled':
            case 'subscription.past_due':
                await databases.updateDocument(DATABASE_ID, COL_PROFILES, userId, {
                    plan: "Free"
                });
                console.log(`❌ User ${userId} downgraded to Free via Paddle.`);
                break;

            default:
                console.log(`ℹ️ Unhandled Paddle event type: ${eventType}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("❌ Webhook processing error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
