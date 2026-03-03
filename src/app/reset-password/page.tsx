import Link from "next/link";

export default function ResetPasswordPage() {
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
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">DocuForge</h1>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-center">Set your new password below.</p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden w-full">
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Reset Password</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please enter a strong new password for your account.</p>
                            </div>

                            <form className="space-y-5">
                                {/* New Password Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">New Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                        <input
                                            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="••••••••"
                                            type="password"
                                            required
                                            minLength={8}
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                        <input
                                            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                            placeholder="••••••••"
                                            type="password"
                                            required
                                            minLength={8}
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Link href="/reset-password/success" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4" type="submit">
                                    Set New Password
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                </Link>
                            </form>
                        </div>
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
