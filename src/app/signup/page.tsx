"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account, databases, DATABASE_ID, COL_PROFILES } from "@/lib/appwrite";
import { ID, OAuthProvider } from "appwrite";

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const intent = searchParams.get('intent');

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        try {
            // We use window.location.origin to dynamically get the current URL (e.g., http://localhost:3000)
            const successUrl = intent === 'pro'
                ? `${window.location.origin}/dashboard?intent=pro`
                : `${window.location.origin}/dashboard`;

            account.createOAuth2Session(
                OAuthProvider.Google, // provider
                successUrl, // success
                `${window.location.origin}/signup` // failure
            );
        } catch (error) {
            console.error("Google login failed", error);
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Create Appwrite Account
            const userAccount = await account.create(ID.unique(), email, password, name);

            // 2. Log them in immediately
            await account.createEmailPasswordSession(email, password);

            // 3. Create the Database Profile mapping
            await databases.createDocument(DATABASE_ID, COL_PROFILES, userAccount.$id, {
                userId: userAccount.$id,
                email: email,
                name: name,
                plan: "Free",
            });

            // Redirect to dashboard (AuthProvider will handle state refresh transparently)
            if (intent === 'pro') {
                window.location.href = "/dashboard?intent=pro";
            } else {
                window.location.href = "/dashboard";
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong during sign up.");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative w-full">
            <div className="flex flex-col grow items-center justify-center p-4 z-10 w-full">
                <div className="w-full max-w-[440px]">
                    {/* Header/Logo Area */}
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/" className="flex items-center gap-3 mb-2 hover:opacity-90 transition-opacity">
                            <div className="p-2 bg-primary rounded-lg text-white">
                                <span className="material-symbols-outlined text-3xl">description</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">DocuForger</h1>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-center">Create an account and start automating.</p>
                    </div>

                    {/* Main Signup Card */}
                    <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden w-full">
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Get Started</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill in the details below to create your free account.</p>
                            </div>

                            {error && (
                                <div className="mb-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSignup} className="space-y-5">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                        <input
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="Jane Doe"
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email address</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                                        <input
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="name@company.com"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                        <input
                                            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="••••••••"
                                            type="password"
                                            required
                                            minLength={8}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Sign Up Button */}
                                <button disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2" type="submit">
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                    {!isLoading && <span className="material-symbols-outlined text-lg">person_add</span>}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Logins */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full"
                                >
                                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCymEta1Y4FnABRL8q3OtWx21Kk6lVXMa8K0fFdOQWxLDlV6_CBRyjurIvzVjwdsBghpcKmQTitRuwUU3Z2YbI5iLI4EDhDnDRU9aZS85_jytNeg-5iKJDurgANJIxuM07SJbSfgmY6koEZX2XBpuen8Qjb79-GEGeFUMoB60B5pTmPfRbTSOs6XFa0Kl9afqUGHzLpGsWOoABGmWLUsXvWptG3o22_CwuNzbOQSgsJfUAGh1m97CPyT57WB2UngjmS42gQih05Jmae" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Continue with Google</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <p className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm mb-8">
                            Already have an account?
                            <Link
                                className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1"
                                href={intent === 'pro' ? "/login?intent=pro" : "/login"}
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="fixed top-0 right-0 z-0 opacity-10 blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2">
                <div className="w-[600px] h-[600px] bg-primary rounded-full"></div>
            </div>
            <div className="fixed bottom-0 left-0 z-0 opacity-10 blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2">
                <div className="w-[400px] h-[400px] bg-primary rounded-full"></div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center font-display text-slate-500">Loading...</div>}>
            <SignupContent />
        </Suspense>
    );
}
