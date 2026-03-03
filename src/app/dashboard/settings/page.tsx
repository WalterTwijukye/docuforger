"use client";

import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { account, databases, storage, DATABASE_ID, COL_PROFILES, BUCKET_FILES } from "@/lib/appwrite";
import { ID } from "appwrite";

export default function SettingsPage() {
    const { user, profile } = useAuth();

    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    // Toast notification state
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Initialize form with User/Profile data when available
    useEffect(() => {
        if (profile?.name) {
            const parts = profile.name.split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.length > 1 ? parts.slice(1).join(" ") : "");
        } else if (user?.name) {
            const parts = user.name.split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.length > 1 ? parts.slice(1).join(" ") : "");
        }
    }, [user, profile]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user || !profile?.$id) return;

        setIsUploading(true);
        setToastMessage(null);
        try {
            // Upload to Appwrite storage
            const uploadRes = await storage.createFile(BUCKET_FILES, ID.unique(), file);

            // Get URL
            const fileUrl = storage.getFileView(BUCKET_FILES, uploadRes.$id);

            // Update profile document
            await databases.updateDocument(DATABASE_ID, COL_PROFILES, profile.$id, {
                avatarUrl: fileUrl.toString()
            });

            setToastMessage("Profile photo updated successfully! Please refresh.");
        } catch (error) {
            console.error("Failed to upload photo", error);
            setToastMessage("Failed to upload photo.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || (!firstName && !lastName)) return;
        setIsSaving(true);
        setToastMessage(null);

        try {
            const newFullName = `${firstName} ${lastName}`.trim();

            // 1. Update name on Auth Account
            await account.updateName(newFullName);

            // 2. Update name on Profile Document (if we have a profile ID)
            if (profile?.$id) {
                await databases.updateDocument(DATABASE_ID, COL_PROFILES, profile.$id, {
                    name: newFullName
                });
            }

            // Show success toast
            setToastMessage("Profile updated successfully!");
            setTimeout(() => setToastMessage(null), 3000);

        } catch (error) {
            console.error("Failed to update profile", error);
            setToastMessage("Error updating profile. Please try again.");
            setTimeout(() => setToastMessage(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpgrade = async () => {
        setIsCheckoutLoading(true);
        setToastMessage(null);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.$id,
                    email: user?.email,
                    name: profile?.name || user?.name
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create checkout');
            }

            const data = await res.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            setToastMessage(error.message || "Something went wrong initiating checkout.");
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 flex-1 relative">

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5">
                    <span className="material-symbols-outlined text-green-400">check_circle</span>
                    <p className="text-sm font-medium">{toastMessage}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Account Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account profile and preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
                            <p className="text-sm text-slate-500">Update your account&apos;s profile information and email address.</p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Avatar section */}
                            <div className="flex items-center gap-6">
                                <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-primary text-3xl font-bold relative">
                                    {(profile as any)?.avatarUrl ? (
                                        <img src={(profile as any).avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}</span>
                                    )}
                                </div>
                                <div>
                                    <label className="cursor-pointer px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm block text-center">
                                        {isUploading ? "Uploading..." : "Change Photo"}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <form onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">First Name</label>
                                        <input
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Last Name</label>
                                        <input
                                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            type="text"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email address</label>
                                    <input
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-500 cursor-not-allowed"
                                        value={user?.email || ""}
                                        readOnly
                                        type="email"
                                    />
                                    <p className="text-xs text-slate-500 ml-1">Your email address is managed via your administrator.</p>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden border border-red-200 dark:border-red-900/50">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Danger Zone</h3>
                            <p className="text-sm text-slate-500 mb-6">Permanently delete your account and all of your content.</p>

                            <button className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preferences & Billing */}
                <div className="space-y-6">
                    {/* Billing Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Subscription Plan</h3>

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-slate-500">Current Plan</p>
                                    <p className="font-bold text-lg text-slate-900 dark:text-white capitalize group-hover:text-primary transition-colors">
                                        {profile?.plan || 'Free'}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">local_activity</span>
                                </div>
                            </div>

                            {profile?.plan !== 'pro' && profile?.plan !== 'business' && (
                                <button
                                    onClick={handleUpgrade}
                                    disabled={isCheckoutLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
                                >
                                    {isCheckoutLoading ? "Loading..." : "Upgrade to Pro"}
                                    {!isCheckoutLoading && <span className="material-symbols-outlined text-[18px]">workspace_premium</span>}
                                </button>
                            )}

                            {(profile?.plan === 'pro' || profile?.plan === 'business') && (
                                <a
                                    href="https://app.lemonsqueezy.com/my-orders"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center px-4 py-2 mt-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
                                >
                                    Manage Billing
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Notifications</h3>

                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary border-slate-300" defaultChecked />
                                    <div>
                                        <span className="block text-sm font-medium text-slate-900 dark:text-white">Email Notifications</span>
                                        <span className="block text-xs text-slate-500 mt-0.5">Receive news, updates, and limits alerts.</span>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary border-slate-300" defaultChecked />
                                    <div>
                                        <span className="block text-sm font-medium text-slate-900 dark:text-white">Workspace Activity</span>
                                        <span className="block text-xs text-slate-500 mt-0.5">Get notified when someone joins your workspace.</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
