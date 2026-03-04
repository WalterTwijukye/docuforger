import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 font-display">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-10">
                    <Link href="/" className="flex items-center gap-3 mb-8 w-fit hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-primary">arrow_back</span>
                        <span className="font-semibold">Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
                    <p className="text-slate-500">Last updated: March 4, 2026</p>
                </div>

                <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the DocuForger service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. Description of Service</h2>
                        <p>
                            DocuForger is a document automation and generation platform. We provide software tools allowing users to create templates, fill out forms, and generate PDF documents. We reserve the right to modify or discontinue the service at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">3. User Accounts</h2>
                        <p>
                            When you create an account with us, whether via email or Google OAuth, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">4. Fair Use and Limits</h2>
                        <p>
                            Free accounts are strictly limited to the document generation quotas outlined on our pricing page (e.g., 3 documents per month). Attempting to bypass these limits or abusing the system will result in account suspension.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">5. Intellectual Property</h2>
                        <p>
                            The Service and its original content, features, and functionality are and will remain the exclusive property of DocuForger and its licensors. However, you retain all rights to the documents and content you generate using the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">6. Limitation of Liability</h2>
                        <p>
                            In no event shall DocuForger, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of the service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
