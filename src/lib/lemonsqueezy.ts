import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY!;
const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID!;

export function setupLemonSqueezy() {
    lemonSqueezySetup({
        apiKey: LEMON_SQUEEZY_API_KEY,
        onError: (error) => console.error("Lemon Squeezy Error: ", error),
    });
}

// Maps our plan names to variant IDs from LemonSqueezy 
// These should ideally be env vars or fetched, but placed here for simplicity
const VARIANT_IDS: Record<string, string> = {
    "Pro": process.env.LEMON_SQUEEZY_PRO_VARIANT_ID || "12345",
    "Enterprise": process.env.LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID || "67890"
};

export async function getCheckoutUrl(plan: string, userId: string, userEmail: string) {
    setupLemonSqueezy();

    const variantId = VARIANT_IDS[plan];
    if (!variantId) {
        throw new Error(`Invalid plan or variant ID missing for: ${plan}`);
    }

    try {
        const checkout = await createCheckout(STORE_ID, variantId, {
            checkoutOptions: {
                embed: false,
                media: true,
                logo: true,
            },
            checkoutData: {
                email: userEmail,
                custom: {
                    user_id: userId,
                },
            },
            productOptions: {
                enabledVariants: [parseInt(variantId)],
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=success`,
                receiptButtonText: 'Return to DocuForge',
                receiptThankYouNote: 'Thank you for upgrading to DocuForge!'
            }
        });

        return checkout.data?.data.attributes.url;
    } catch (error) {
        console.error("Failed to generate checkout URL", error);
        throw error;
    }
}
