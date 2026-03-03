import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient, DATABASE_ID, COL_PROFILES } from '@/lib/appwrite-admin';

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-signature');
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        if (!signature || !secret) {
            return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
        }

        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const data = JSON.parse(rawBody);
        const eventName = data.meta.event_name;
        const customData = data.meta.custom_data;

        if (!customData || !customData.user_id) {
            return NextResponse.json({ error: 'No user_id in custom data' }, { status: 400 });
        }

        const userId = customData.user_id;
        const adminClient = createAdminClient();

        console.log(`Processing LemonSqueezy Webhook: ${eventName} for user ${userId}`);

        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const status = data.data.attributes.status;
            const { databases } = adminClient;

            // Manual filter to avoid index requirement issues
            const profilesRes = await databases.listDocuments(DATABASE_ID, COL_PROFILES);
            const userProfile = profilesRes.documents.find(doc => doc.userId === userId);

            if (userProfile) {
                if (status === 'active' || status === 'past_due') {
                    await databases.updateDocument(DATABASE_ID, COL_PROFILES, userProfile.$id, {
                        plan: 'pro'
                    });
                    console.log(`Updated user ${userId} to Pro plan.`);
                } else if (status === 'expired' || status === 'cancelled' || status === 'unpaid') {
                    await databases.updateDocument(DATABASE_ID, COL_PROFILES, userProfile.$id, {
                        plan: 'free'
                    });
                    console.log(`Downgraded user ${userId} to Free plan.`);
                }
            } else {
                console.warn(`Profile not found for userId ${userId}`);
            }
        }

        return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Webhook processing failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
