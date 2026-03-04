import Link from "next/link";

export default function ForgotPasswordPage() {
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
                        <p className="text-slate-500 dark:text-slate-400 text-center">Reset your password to regain access.</p>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden w-full">
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Forgot Password</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter your email address and we&apos;ll send you a link to reset your password.</p>
                            </div>

                            <form className="space-y-5">
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
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4" type="submit">
                                    Send Reset Link
                                    <span className="material-symbols-outlined text-lg">send</span>
                                </button>
                            </form>
                        </div>

                        {/* Footer Link */}
                        <div className="border-t border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-800/50">
                            <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                                Remember your password?
                                <Link className="text-primary font-semibold hover:underline decoration-2 underline-offset-4 ml-1" href="/login">
                                    Back to login
                                </Link>
                            </p>
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
