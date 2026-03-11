"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Document, Packer, Paragraph } from "docx";
import { useAuth } from "@/components/AuthProvider";
import { databases, storage, DATABASE_ID, COL_DOCUMENTS, COL_TEMPLATES, BUCKET_DOCUMENTS } from "@/lib/appwrite";
import { Query } from "appwrite";

export default function DocumentsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("all");
    const [documents, setDocuments] = useState<any[]>([]);
    const [templateMap, setTemplateMap] = useState<Record<string, { name: string, content: string }>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchDocuments = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await databases.listDocuments(DATABASE_ID, COL_DOCUMENTS, [
                Query.equal("userId", user.$id),
                Query.orderDesc("$createdAt")
            ]);
            setDocuments(res.documents);

            // Fetch template names for mapping
            const tIds = Array.from(new Set(res.documents.map(d => d.templateId).filter(Boolean)));
            if (tIds.length > 0) {
                try {
                    const tRes = await databases.listDocuments(DATABASE_ID, COL_TEMPLATES, [
                        Query.equal("$id", tIds)
                    ]);
                    const tMap: Record<string, { name: string, content: string }> = {};
                    tRes.documents.forEach(t => { tMap[t.$id] = { name: t.name, content: t.content }; });
                    setTemplateMap(tMap);
                } catch (e) {
                    console.error("Failed to fetch template names", e);
                }
            }

        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [user]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            await databases.deleteDocument(DATABASE_ID, COL_DOCUMENTS, id);
            setDocuments(prev => prev.filter(d => d.$id !== id));
        } catch (error) {
            console.error("Failed to delete document:", error);
        }
    };

    const handleDownloadWord = async (doc: any) => {
        const template = templateMap[doc.templateId];
        if (!template || !template.content) {
            alert("Original template content not available. Cannot generate Word document.");
            return;
        }

        let generatedContent = template.content;
        try {
            const formData = JSON.parse(doc.variables || "{}");
            Object.entries(formData).forEach(([key, value]) => {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                generatedContent = generatedContent.replace(regex, value as string);
            });

            const docxFile = new Document({
                sections: [{
                    properties: {},
                    children: generatedContent.split('\n').map((text: string) => new Paragraph({ text })),
                }],
            });

            const blob = await Packer.toBlob(docxFile);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${doc.title || 'Document'}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate Word document:", error);
            alert("Error generating Word document.");
        }
    };

    // Very basic client side filter placeholder
    const filteredDocs = documents.filter(d => {
        if (activeTab === "all") return true;
        // Logic for drafts/sent could go here depending on schema
        return true;
    });

    return (
        <div className="flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Header */}
            <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">Documents</h2>
                    <div className="relative w-full max-w-md sm:ml-4">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 text-slate-900 dark:text-white outline-none"
                            placeholder="Search documents..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 pl-2">
                    <Link href="/dashboard/templates" className="flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shrink-0">
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span className="hidden sm:inline">New Document</span>
                    </Link>
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
                            All Docs
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        Last 30 days
                        <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-white">{filteredDocs.length}</span> documents
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 px-4 md:px-8 pb-8 overflow-y-auto">
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Template Used</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Loading documents...
                                    </td>
                                </tr>
                            ) : filteredDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50 block">description</span>
                                            <p className="mb-4">No documents generated yet.</p>
                                            <Link href="/dashboard/templates" className="text-primary font-medium hover:underline">
                                                Generate your first document
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <tr key={doc.$id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined">picture_as_pdf</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">{doc.title}.pdf</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary truncate max-w-[150px]">
                                                {doc.templateId && templateMap[doc.templateId] ? templateMap[doc.templateId].name : "Custom"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {new Date(doc.$createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                    title="Preview PDF"
                                                    onClick={() => window.open(storage.getFileView(BUCKET_DOCUMENTS, doc.fileId).toString(), '_blank')}
                                                    disabled={!doc.fileId}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                <button
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Download PDF"
                                                    onClick={() => window.open(storage.getFileDownload(BUCKET_DOCUMENTS, doc.fileId).toString(), '_blank')}
                                                    disabled={!doc.fileId}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                                                </button>
                                                <button
                                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                                    title="Download Word (.docx)"
                                                    onClick={() => handleDownloadWord(doc)}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">description</span>
                                                </button>
                                                <Link
                                                    href={`/dashboard/templates/${doc.templateId}/generate`}
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                    title="Edit / Regenerate from Template"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </Link>
                                                <button
                                                    onClick={(e) => handleDelete(doc.$id, e)}
                                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredDocs.length > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">1</button>
                        </div>
                        <button className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            Next
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
