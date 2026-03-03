"use client";

import Link from "next/link";
import { useAuth, CustomProfile } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { databases, DATABASE_ID, COL_USAGE } from "@/lib/appwrite";
import { Query } from "appwrite";

// Simple mapping of plan to limits (should ideally be server-side or config)
const PLAN_LIMITS: Record<string, number> = {
    "Free": 10,
    "Pro": 500,
    "Enterprise": 9999,
};

// Simple mapping of plan to prices
const PLAN_PRICES: Record<string, string> = {
    "Free": "$0",
    "Pro": "$7",
    "Enterprise": "Custom",
};

export default function BillingPage() {
    const { user, profile } = useAuth();
    const typedProfile = profile as CustomProfile | null;

    const [usageCount, setUsageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const currentPlan = typedProfile?.plan || "Free";
    const limit = PLAN_LIMITS[currentPlan] || 10;
    const price = PLAN_PRICES[currentPlan] || "$0";
    const usagePercentage = Math.min(100, Math.round((usageCount / limit) * 100));

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async (planName: string) => {
        if (!user) return;
        setIsCheckingOut(true);

        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: planName,
                    userId: user.$id,
                    userEmail: user.email,
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to start checkout");
            }

            const { url } = await res.json();
            if (url) {
                window.location.href = url; // Redirect to LemonSqueezy checkout
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to initiate checkout. Please try again later.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchUsage = async () => {
            try {
                // Get current month start
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

                const usageDocs = await databases.listDocuments(
                    DATABASE_ID,
                    COL_USAGE,
                    [
                        Query.equal('userId', user.$id),
                        Query.greaterThanEqual('$createdAt', startOfMonth)
                    ]
                );

                // Assuming one record per month per user, or sum them up if multiple
                if (usageDocs.documents.length > 0) {
                    setUsageCount(usageDocs.documents[0].count || 0);
                } else {
                    setUsageCount(0);
                }
            } catch (error) {
                console.error("Failed to load usage", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsage();
    }, [user]);

    if (isLoading) {
        return <div className="p-10 text-center text-slate-500">Loading billing info...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Billing &amp; Subscription</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your plan, usage, and billing information.</p>
                </div>
                <div className="flex gap-3">
                    {currentPlan !== "Free" && (
                        <button className="px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                            Cancel Subscription
                        </button>
                    )}
                    <button
                        onClick={() => handleCheckout("Pro")}
                        disabled={isCheckingOut || currentPlan === "Pro" || currentPlan === "Enterprise"}
                        className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-lg">upgrade</span>
                        {isCheckingOut ? "Loading..." : "Upgrade Plan"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Plans & Usage */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Current Plan Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold">Current Plan</h3>
                                    <p className="text-sm text-slate-500">You are currently subscribed to the {currentPlan} Plan.</p>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${currentPlan !== 'Free' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                    Active
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-500 text-sm font-medium">Monthly Cost</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{price}</span>
                                        {currentPlan !== "Enterprise" && <span className="text-slate-500 font-medium">/month</span>}
                                    </div>
                                    {currentPlan !== "Free" && (
                                        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">event</span>
                                            Next billing date: --
                                        </p>
                                    )}
                                </div>
                                <div className="flex-1 w-full space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-semibold">Monthly Usage</span>
                                            <span className="text-slate-500">{usageCount} / {currentPlan === "Enterprise" ? "Unlimited" : limit} documents</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all ${usagePercentage > 90 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${currentPlan === "Enterprise" ? 100 : usagePercentage}%` }}></div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {currentPlan === "Enterprise" ? "You have unlimited document generation." : `${usagePercentage}% of your monthly document limit used.`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing History (Placeholder for Lemon Squeezy integration) */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden opacity-50 relative">
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <span className="bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-lg font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-800 backdrop-blur-sm">Integration Coming Soon</span>
                        </div>
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center blur-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white">Billing History</h3>
                            <button className="text-primary text-sm font-semibold hover:underline">Download All</button>
                        </div>
                        <div className="overflow-x-auto blur-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-6 py-4 text-sm font-medium">Oct 24, 2023</td>
                                        <td className="px-6 py-4 text-sm">$7.00</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Paid</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">PDF</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payment & Methods */}
                <div className="space-y-6">
                    {/* Payment Method */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 opacity-50 relative">
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <span className="bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-lg font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-800 backdrop-blur-sm">Managed via Lemon Squeezy</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 blur-sm">Payment Method</h3>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between mb-4 blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded outline-none border border-slate-200 dark:border-slate-700"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Visa ending in ****</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Promo */}
                    {currentPlan !== "Enterprise" && (
                        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold mb-2 leading-tight">Need more capacity?</h4>
                                <p className="text-white/80 text-sm mb-6">Upgrade to our Pro or Enterprise plan for unlimited documents, custom templates, and more.</p>
                                <button
                                    onClick={() => handleCheckout("Pro")}
                                    disabled={isCheckingOut}
                                    className="w-full bg-white text-primary font-bold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    {isCheckingOut ? "Loading..." : "Explore Plans"}
                                </button>
                            </div>
                            {/* Abstract decoration */}
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute -top-12 -left-12 w-32 h-32 bg-black/10 rounded-full blur-3xl"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
