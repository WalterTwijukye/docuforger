"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const intent = searchParams.get('intent');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await account.createEmailPasswordSession(email, password);
            // Redirect to dashboard (AuthProvider handles session context refresh)
            if (intent === 'pro') {
                window.location.href = "/dashboard?intent=pro";
            } else {
                window.location.href = "/dashboard";
            }
        } catch (err: any) {
            setError(err.message || "Invalid credentials. Please try again.");
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: OAuthProvider) => {
        setIsLoading(true);
        setError(null);

        try {
            const successUrl = intent === 'pro'
                ? `${window.location.origin}/dashboard?intent=pro`
                : `${window.location.origin}/dashboard`;

            account.createOAuth2Session(
                provider, // provider
                successUrl, // success
                `${window.location.origin}/login` // failure
            );
        } catch (error: any) {
            setError(error.message || "OAuth login failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col relative w-full">
            <div className="flex flex-col grow items-center justify-center p-4 z-10">
                <div className="w-full max-w-[440px]">
                    {/* Header/Logo Area */}
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/" className="flex items-center gap-3 mb-2 hover:opacity-90 transition-opacity">
                            <div className="p-2 bg-primary rounded-lg text-white">
                                <span className="material-symbols-outlined text-3xl">description</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">DocuForger</h1>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-center">Streamline your document workflow with ease.</p>
                    </div>

                    {/* Main Login Card */}
                    <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please enter your credentials to access your account.</p>
                            </div>

                            {error && (
                                <div className="mb-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
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
                                        <Link className="text-sm font-medium text-primary hover:underline" href="/forgot-password">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                        <input
                                            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="••••••••"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Sign In Button */}
                                <button disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2" type="submit">
                                    {isLoading ? "Signing In..." : "Sign In"}
                                    {!isLoading && <span className="material-symbols-outlined text-lg">login</span>}
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
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleOAuthLogin(OAuthProvider.Google)}
                                    className="w-full flex justify-center items-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-white shadow-sm"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <p className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm mb-8">
                            Don&apos;t have an account?
                            <Link
                                className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1"
                                href={intent === 'pro' ? "/signup?intent=pro" : "/signup"}
                            >
                                Sign up for free
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center font-display text-slate-500">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
