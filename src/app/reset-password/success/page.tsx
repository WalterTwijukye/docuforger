import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordSuccessPage() {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">description</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DocuForger</h1>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background-light to-primary/10 dark:from-primary/10 dark:via-background-dark dark:to-primary/5">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-800 p-8 md:p-12 text-center relative z-10">
                    <div className="mb-8 flex justify-center">
                        <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl font-bold">check_circle</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                            Password Reset Successful
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                            Your password has been successfully updated. You can now use your new password to log in to your account.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link className="block w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all duration-200 shadow-md shadow-primary/20" href="/login">
                            Back to Login
                        </Link>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Need help? <Link className="text-primary hover:underline font-medium ml-1" href="/support">Contact Support</Link>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="w-full py-6 text-center text-slate-400 dark:text-slate-500 text-sm border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark/30">
                <p>© 2024 DocuForger Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
