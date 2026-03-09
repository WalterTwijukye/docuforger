"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth, CustomProfile } from "@/components/AuthProvider";
import { useEffect, useState, Suspense } from "react";
import { databases, DATABASE_ID, COL_USAGE, COL_TEMPLATES, COL_DOCUMENTS } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { STANDARD_TEMPLATES } from "@/lib/standard-templates";

function DashboardContent() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const typedProfile = profile as CustomProfile | null;
    const [stats, setStats] = useState({ documents: 0, templates: 0 });
    const [recentDocs, setRecentDocs] = useState<any[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchDashboardData = async () => {
            try {
                // 1. Fetch current month usage
                const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
                const usageRes = await databases.listDocuments(DATABASE_ID, COL_USAGE, [
                    Query.equal("userId", user.$id),
                    Query.equal("month", currentMonth)
                ]);

                const docsCount = usageRes.documents.length > 0 ? usageRes.documents[0].documentsCount : 0;

                // 2. Fetch total active templates
                const templatesRes = await databases.listDocuments(DATABASE_ID, COL_TEMPLATES, [
                    Query.equal("userId", user.$id)
                ]);

                setStats({ documents: docsCount, templates: templatesRes.total });

                // 3. Fetch recent documents
                const recentDocsRes = await databases.listDocuments(DATABASE_ID, COL_DOCUMENTS, [
                    Query.equal("userId", user.$id),
                    Query.orderDesc("$createdAt"),
                    Query.limit(4)
                ]);

                setRecentDocs(recentDocsRes.documents);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };

        fetchDashboardData();
    }, [user]);



    const handleActionStandardTemplate = async (templateData: any, action: 'preview' | 'generate') => {
        if (!user) return;
        setIsLoadingStats(true); // Re-using loading state for visual feedback
        try {
            // First check if the user already has this standard template saved
            const existingRes = await databases.listDocuments(DATABASE_ID, COL_TEMPLATES, [
                Query.equal("userId", user.$id),
                Query.equal("name", templateData.name)
            ]);

            let templateId = "";

            if (existingRes.documents.length > 0) {
                // User already has it, use existing ID
                templateId = existingRes.documents[0].$id;
            } else {
                // User doesn't have it, create it first
                const regex = /\{\{([^}]+)\}\}/g;
                let match;
                const found = new Set<string>();
                while ((match = regex.exec(templateData.content)) !== null) {
                    found.add(match[1].trim());
                }

                const variables = Array.from(found).map(name => ({
                    name,
                    type: "text",
                    default: ""
                }));

                const data = {
                    name: templateData.name,
                    content: templateData.content,
                    variables: variables.map(v => JSON.stringify(v)),
                    userId: user.$id,
                    category: templateData.category,
                };

                const newDoc = await databases.createDocument(DATABASE_ID, COL_TEMPLATES, ID.unique(), data);
                templateId = newDoc.$id;
                setStats(prev => ({ ...prev, templates: prev.templates + 1 }));
            }

            // Redirect based on action
            if (action === 'preview') {
                router.push(`/editor/${templateId}`);
            } else {
                router.push(`/dashboard/templates/${templateId}/generate`);
            }

        } catch (error) {
            console.error(`Failed to handle standard template ${action}`, error);
            alert("Something went wrong. Please try again.");
            setIsLoadingStats(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {typedProfile?.name?.split(" ")[0] || "there"}! Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/templates" className="px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span>
                        New Template
                    </Link>
                    <Link href="/dashboard/templates" className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">description</span>
                        Generate Document
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat 1 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">description</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Monthly Documents</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            {isLoadingStats ? "..." : stats.documents} <span className="text-sm font-medium text-slate-400">/ {typedProfile?.plan === 'free' ? '3' : typedProfile?.plan === 'pro' ? '100' : '∞'}</span>
                        </h3>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-blue-600 bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">content_copy</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Templates</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            {isLoadingStats ? "..." : stats.templates}
                        </h3>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-orange-600 bg-orange-100 dark:bg-orange-900/40 p-2 rounded-lg">timer</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Current Plan</p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 capitalize">{typedProfile?.plan || "..."}</h3>
                    </div>
                </div>

                {/* Stat 4 - Disabled for now */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden opacity-75">
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center cursor-not-allowed">
                        <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">Coming Soon</span>
                    </div>
                    <div className="flex items-center justify-between opacity-50">
                        <span className="material-symbols-outlined text-purple-600 bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">group</span>
                    </div>
                    <div className="opacity-50">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Team Members</p>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Invite Team &rarr;</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Documents */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Documents</h3>
                        <Link href="/dashboard/documents" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[200px] flex flex-col">
                        <table className="w-full text-left flex-1">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {isLoadingStats ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading documents...</td>
                                    </tr>
                                ) : recentDocs.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">description</span>
                                            <p>No documents generated yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    recentDocs.map((doc) => (
                                        <tr key={doc.$id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-red-500 text-2xl">picture_as_pdf</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{doc.title}.pdf</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(doc.$createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Activity */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Popular Templates</h3>
                    <div className="space-y-3">
                        {STANDARD_TEMPLATES.map((template, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col gap-3 hover:border-primary transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{template.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                                    <button
                                        onClick={() => handleActionStandardTemplate(template, 'preview')}
                                        className="text-slate-500 hover:text-primary text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => handleActionStandardTemplate(template, 'generate')}
                                        className="text-white bg-primary text-xs font-bold hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        Generate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-2">Need a custom template?</h4>
                            <p className="text-white/80 text-sm mb-4">You can easily build custom parameter structures with our automated editor.</p>
                            <Link href="/dashboard/templates">
                                <button className="w-full bg-white text-primary font-bold py-2 rounded-lg hover:shadow-lg transition-all text-sm">Open Editor</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 p-6 lg:p-10 flex items-center justify-center">
                <div className="text-slate-500 font-medium">Loading Dashboard...</div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
