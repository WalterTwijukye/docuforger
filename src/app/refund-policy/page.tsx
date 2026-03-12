import Link from "next/link";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-20">
            {/* Simple Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">description</span>
                        <span className="text-2xl font-black tracking-tight"><span className="text-primary">Docu</span>Forger</span>
                    </Link>
                    <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 pt-16 mt-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-8">Refund Policy</h1>
                    <p className="text-slate-500 mb-12 italic">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. General Policy</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                            At DocuForge, we strive to ensure our software fully meets your needs before any payment is required. We offer a completely free tier so users can test our template generation and document automation capabilities extensively. Because of this, once a subscription is initiated, we do not generally offer refunds for the current billing cycle.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Subscription Cancellations</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                            You can cancel your subscription at any time directly from the Billing section of your dashboard. When you cancel, your account will remain active and you will retain access to your Pro features until the end of your current billing period. We do not provide prorated refunds or credits for partially used subscription periods.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Exceptional Circumstances</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                            We understand that extraordinary circumstances may occur. If you believe you were billed in error (e.g., fraudulent card use, duplicate billing errors on our platform), we will investigate and issue a full refund immediately upon verification.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            To request a refund review under these circumstances, please contact our support team at <a href="mailto:docuforger@gmail.com" className="text-primary hover:underline">docuforger@gmail.com</a> within 7 days of the charge.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Paddle (Merchant of Record)</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                            Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
                        </p>
                    </section>

                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500 text-center">
                            If you have any questions about this policy, please <a href="mailto:docuforger@gmail.com" className="text-primary hover:underline">contact us</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
