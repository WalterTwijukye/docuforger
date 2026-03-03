import { NextResponse } from 'next/server';
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
});

export async function POST(request: Request) {
    try {
        const { userId, email, name } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID_PRO;

        if (!storeId || !variantId) {
            return NextResponse.json({ error: 'Lemon Squeezy credentials missing in environment variables.' }, { status: 500 });
        }

        const checkout = await createCheckout(storeId, variantId, {
            checkoutOptions: {
                embed: false,
                media: true,
                logo: true,
            },
            checkoutData: {
                email: email,
                name: name,
                custom: {
                    user_id: userId,
                },
            },
            productOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
                receiptButtonText: 'Go to Dashboard',
                receiptThankYouNote: 'Thank you for upgrading to DocuForge Pro!'
            }
        });

        if (checkout.error) {
            console.error("Lemon Squeezy checkout create error:", checkout.error);
            return NextResponse.json({ error: checkout.error.message }, { status: 500 });
        }

        return NextResponse.json({ checkoutUrl: checkout.data?.data.attributes.url });

    } catch (error: any) {
        console.error('Checkout creation failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
