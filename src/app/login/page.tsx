"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";

export default function LoginPage() {
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
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">DocuForge</h1>
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
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCymEta1Y4FnABRL8q3OtWx21Kk6lVXMa8K0fFdOQWxLDlV6_CBRyjurIvzVjwdsBghpcKmQTitRuwUU3Z2YbI5iLI4EDhDnDRU9aZS85_jytNeg-5iKJDurgANJIxuM07SJbSfgmY6koEZX2XBpuen8Qjb79-GEGeFUMoB60B5pTmPfRbTSOs6XFa0Kl9afqUGHzLpGsWOoABGmWLUsXvWptG3o22_CwuNzbOQSgsJfUAGh1m97CPyT57WB2UngjmS42gQih05Jmae" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <svg className="w-5 h-5 text-[#181717] dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">GitHub</span>
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
