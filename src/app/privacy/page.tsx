import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 font-display">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-10">
                    <Link href="/" className="flex items-center gap-3 mb-8 w-fit hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-primary">arrow_back</span>
                        <span className="font-semibold">Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-slate-500">Last updated: March 4, 2026</p>
                </div>

                <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Information We Collect</h2>
                        <p className="mb-4">
                            When you use DocuForge, we collect information that you provide securely to us, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> Your name and email address when you register using Google OAuth or email.</li>
                            <li><strong>Document Data:</strong> The content of the templates and documents you generate using our service.</li>
                            <li><strong>Usage Information:</strong> Information about how you use our application to improve our services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve the DocuForge service.</li>
                            <li>Process transactions and send related billing information.</li>
                            <li>Authenticate your identity when you log in.</li>
                            <li>Respond to your comments, questions, and customer service requests.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">3. Third-Party Authentication (Google OAuth)</h2>
                        <p>
                            DocuForge allows you to sign up and log in using your Google account. We only request basic profile information (your name and verified email address) from Google to create your account and verify your identity. We do not access your contacts, Google Drive files, or any other private Google data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">4. Data Storage and Security</h2>
                        <p>
                            Your personal data and documents are stored securely using industry-standard encryption protocols. We rely on trusted infrastructure providers to ensure your data is safeguarded against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@docuforge.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
