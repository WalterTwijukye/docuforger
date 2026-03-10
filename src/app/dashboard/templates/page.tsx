"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, CustomProfile } from "@/components/AuthProvider";
import { databases, DATABASE_ID, COL_TEMPLATES } from "@/lib/appwrite";
import { Query } from "appwrite";

export default function TemplatesPage() {
    const { user, profile } = useAuth();
    const typedProfile = profile as CustomProfile | null;
    const userPlan = typedProfile?.plan || 'Free';
    const [activeTab, setActiveTab] = useState("all");
    const [templates, setTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTemplates = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await databases.listDocuments(DATABASE_ID, COL_TEMPLATES, [
                Query.equal("userId", user.$id),
                Query.orderDesc("$createdAt")
            ]);
            setTemplates(res.documents);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        try {
            await databases.deleteDocument(DATABASE_ID, COL_TEMPLATES, id);
            setTemplates(prev => prev.filter(t => t.$id !== id));
        } catch (error) {
            console.error("Failed to delete template", error);
        }
    };

    // Filter logic
    const filteredTemplates = templates.filter(t => {
        if (activeTab === "all") return true;
        // Depending on how you store status, adjust this filter
        // return t.status === activeTab;
        return true;
    });

    const isLimitReached = userPlan === 'Free' && templates.length >= 1;

    return (
        <div className="flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">Templates</h2>
                    <div className="relative w-full max-w-md sm:ml-4">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 text-slate-900 dark:text-white outline-none"
                            placeholder="Search templates..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 pl-2">
                    {isLimitReached ? (
                        <button onClick={() => alert("Free plan is limited to 1 active template. Please upgrade to Pro to create unlimited templates.")} className="flex items-center gap-2 bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed px-3 sm:px-4 py-2 rounded-lg text-sm font-bold shrink-0">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span className="hidden sm:inline">New Template</span>
                        </button>
                    ) : (
                        <Link href="/editor/new" className="flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shrink-0">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span className="hidden sm:inline">New Template</span>
                        </Link>
                    )}
                </div>
            </header>

            {/* Table Controls */}
            <div className="px-4 md:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === "all" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"}`}
                        >
                            All Templates
                        </button>
                    </div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-white">{filteredTemplates.length}</span> templates
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 px-4 md:px-8 pb-8 overflow-y-auto">
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Template Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Modified</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        Loading templates...
                                    </td>
                                </tr>
                            ) : filteredTemplates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">description</span>
                                            <p className="mb-4">No templates found.</p>
                                            <Link href="/editor/new" className="text-primary font-medium hover:underline">
                                                Create your first template
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTemplates.map((template) => {
                                    let varCount = 0;
                                    try {
                                        varCount = JSON.parse(template.variables || "[]").length;
                                    } catch (e) { }

                                    return (
                                        <tr key={template.$id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined">description</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{template.name}</p>
                                                        <p className="text-[11px] text-slate-500">{varCount} Variables</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                    General
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">-- uses</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(template.$updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/editor/${template.$id}`} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Preview Template">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </Link>
                                                    <Link href={`/dashboard/templates/${template.$id}/generate`} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Generate">
                                                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                                    </Link>
                                                    <Link href={`/editor/${template.$id}`} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Edit">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </Link>
                                                    <button onClick={() => handleDelete(template.$id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
