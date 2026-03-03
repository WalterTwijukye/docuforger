import { NextResponse } from "next/server";
import { getCheckoutUrl } from "@/lib/lemonsqueezy";
import { createAdminClient, DATABASE_ID, COL_PROFILES } from "@/lib/appwrite-admin";
import { Query } from "appwrite";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { planId, userId, userEmail } = body;

        if (!planId || !userId || !userEmail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify the user exists securely
        const { databases } = createAdminClient();
        const profiles = await databases.listDocuments(DATABASE_ID, COL_PROFILES, [
            Query.equal('$id', userId)
        ]);

        if (profiles.documents.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const checkoutUrl = await getCheckoutUrl(planId, userId, userEmail);

        if (!checkoutUrl) {
            return NextResponse.json({ error: "Failed to generate checkout URL" }, { status: 500 });
        }

        return NextResponse.json({ url: checkoutUrl });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
