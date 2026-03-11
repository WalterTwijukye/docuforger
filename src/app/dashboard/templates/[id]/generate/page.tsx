"use client";

import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { databases, storage, DATABASE_ID, COL_TEMPLATES, COL_DOCUMENTS, BUCKET_DOCUMENTS, COL_USAGE } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

export default function GenerateDocumentPage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [template, setTemplate] = useState<any>(null);
    const [variables, setVariables] = useState<any[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [documentTitle, setDocumentTitle] = useState("");
    const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx'>('pdf');

    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!user || !id) return;

        const fetchTemplate = async () => {
            try {
                const doc = await databases.getDocument(DATABASE_ID, COL_TEMPLATES, id);
                setTemplate(doc);
                setDocumentTitle(`${doc.name} - ${new Date().toLocaleDateString()}`);
                if (doc.variables) {
                    const parsedVars = Array.isArray(doc.variables)
                        ? doc.variables.map((v: any) => {
                            try { return typeof v === 'string' ? JSON.parse(v) : v; }
                            catch { return { name: v, type: 'text', default: '' }; }
                        })
                        : JSON.parse(doc.variables);
                    setVariables(parsedVars);

                    // Initialize form data with defaults
                    const initialData: Record<string, string> = {};
                    parsedVars.forEach((v: any) => {
                        initialData[v.name] = v.default || "";
                    });
                    setFormData(initialData);
                }
            } catch (error) {
                console.error("Failed to load template", error);
                router.push("/dashboard/templates");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplate();
    }, [id, user, router]);

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !template) return;

        setIsGenerating(true);
        try {
            // --- USAGE CHECK ---
            const currentMonth = new Date().toISOString().slice(0, 7);
            const usageRes = await databases.listDocuments(DATABASE_ID, COL_USAGE, [
                Query.equal("userId", user.$id),
                Query.equal("month", currentMonth)
            ]);

            const usageDoc = usageRes.documents.length > 0 ? usageRes.documents[0] : null;
            const currentDocs = usageDoc ? usageDoc.documentsCount : 0;
            const userPlan = profile ? (profile as any).plan : 'Free';

            if ((userPlan === 'Free' || userPlan === 'free') && currentDocs >= 3) {
                alert("You have reached your free plan limit of 3 documents per month. Please upgrade to Pro to generate unlimited documents.");
                router.push('/dashboard/settings');
                setIsGenerating(false);
                return;
            }
            // -------------------
            // 1. Generate content by replacing variables
            let generatedContent = template.content;
            Object.entries(formData).forEach(([key, value]) => {
                const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                generatedContent = generatedContent.replace(regex, value);
            });

            let file: File;

            if (outputFormat === 'pdf') {
                const doc = new jsPDF();
                const margin = 15;
                const maxLineWidth = 180;
                const textLines = doc.splitTextToSize(generatedContent, maxLineWidth);
                doc.text(textLines, margin, margin + 10);
                const pdfBlob = doc.output('blob');
                file = new File([pdfBlob], `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`, { type: 'application/pdf' });
            } else {
                const doc = new Document({
                    sections: [{
                        properties: {},
                        children: generatedContent.split('\n').map((text: string) => new Paragraph({ text })),
                    }],
                });
                const blob = await Packer.toBlob(doc);
                file = new File([blob], `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.docx`, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            }

            // 3. Upload to Appwrite Storage
            const uploadRes = await storage.createFile(BUCKET_DOCUMENTS, ID.unique(), file);

            // 4. Get File URL (using view for simplicity)
            const fileUrl = storage.getFileView(BUCKET_DOCUMENTS, uploadRes.$id);

            // 5. Create Document Record in Database
            await databases.createDocument(DATABASE_ID, COL_DOCUMENTS, ID.unique(), {
                userId: user.$id,
                templateId: template.$id,
                title: documentTitle,
                variables: JSON.stringify(formData),
                fileId: uploadRes.$id,
            });

            // 6. Update Usage Record
            if (usageDoc) {
                await databases.updateDocument(DATABASE_ID, COL_USAGE, usageDoc.$id, {
                    documentsCount: currentDocs + 1,
                });
            } else {
                await databases.createDocument(DATABASE_ID, COL_USAGE, ID.unique(), {
                    userId: user.$id,
                    month: currentMonth,
                    documentsCount: 1,
                });
            }

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                router.push("/dashboard/documents");
            }, 2000);

        } catch (error) {
            console.error("Failed to generate document:", error);
            alert("Failed to generate document.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading template...</div>;
    }

    if (!template) {
        return <div className="p-8 text-center text-slate-500">Template not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 relative">
            {/* Toast Notification Overlay */}
            {showToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-white dark:bg-slate-900 p-4 shadow-xl ring-1 ring-black/5">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">Document generated successfully!</p>
                                <p className="text-xs font-normal leading-normal text-slate-500 dark:text-slate-400">Redirecting to Documents...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <Link href="/dashboard/templates" className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Generate Document</h2>
                    <nav className="flex items-center text-sm font-medium mt-1">
                        <span className="text-slate-500">Templates</span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-600 dark:text-slate-400">{template.name}</span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-primary font-bold">Generate</span>
                    </nav>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Template Variables</h3>
                            <p className="text-sm text-slate-500 mt-1">Fill in the required fields to populate the document.</p>
                        </div>
                        <form onSubmit={handleGenerate} className="p-6 space-y-6">
                            {variables.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">This template has no variables to fill.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-2 pb-6 mb-2 border-b border-slate-100 dark:border-slate-800">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 flex items-center justify-between">
                                            <span>Document Name</span>
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={documentTitle}
                                            onChange={(e) => setDocumentTitle(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-semibold"
                                            placeholder={`Enter document name...`}
                                        />
                                    </div>
                                    <div className="space-y-2 pb-6 mb-2 border-b border-slate-100 dark:border-slate-800">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 flex items-center justify-between">
                                            <span>Output Format</span>
                                        </label>
                                        <select
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value as 'pdf' | 'docx')}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
                                        >
                                            <option value="pdf">PDF Document (.pdf)</option>
                                            <option value="docx">Word Document (.docx)</option>
                                        </select>
                                    </div>
                                    {variables.map((v) => (
                                        <div key={v.name} className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1 flex items-center justify-between">
                                                <span className="capitalize">{v.name.replace(/_/g, ' ')}</span>
                                                <span className="text-[10px] text-slate-400 font-normal">{v.type || "text"}</span>
                                            </label>
                                            <input
                                                required
                                                type={v.type === 'Date' ? 'date' : v.type?.includes('Number') ? 'number' : 'text'}
                                                value={formData[v.name] || ""}
                                                onChange={(e) => handleInputChange(v.name, e.target.value)}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                                placeholder={`Enter ${v.name.replace(/_/g, ' ')}...`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-6">
                                <button type="button" className="px-5 py-2.5 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300">
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    disabled={isGenerating}
                                    className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md flex items-center gap-2 transition-all ${isGenerating ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">{isGenerating ? 'sync' : 'play_arrow'}</span>
                                    {isGenerating ? 'Generating...' : `Generate ${outputFormat.toUpperCase()}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Document Details</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500">Template</span>
                                <span className="font-semibold text-slate-900 dark:text-white text-right max-w-[150px] truncate" title={template.name}>{template.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500">Output Format</span>
                                <span className="font-semibold text-slate-900 dark:text-white text-right">TXT (Temp)</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-500">Variables</span>
                                <span className="font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-full">{variables.length} Required</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-start gap-3 border border-slate-200 dark:border-slate-700">
                            <span className="material-symbols-outlined text-primary text-xl">info</span>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Audit Trail Enabled</p>
                                <p className="text-xs text-slate-500">This generation will be logged and the final document will be stored securely in your workspace.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
