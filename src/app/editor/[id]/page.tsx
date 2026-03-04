"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, CustomProfile } from "@/components/AuthProvider";
import { databases, DATABASE_ID, COL_TEMPLATES } from "@/lib/appwrite";
import { ID } from "appwrite";

export default function TemplateEditorPage() {
    const { user, profile } = useAuth();
    const typedProfile = profile as CustomProfile | null;
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [activeTab, setActiveTab] = useState("editor");
    const [isLoading, setIsLoading] = useState(id !== "new");
    const [isSaving, setIsSaving] = useState(false);

    const [title, setTitle] = useState("New Template");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");
    const [variables, setVariables] = useState<any[]>([]);

    useEffect(() => {
        if (id === "new" || !user) return;

        const fetchTemplate = async () => {
            setIsLoading(true);
            try {
                const doc = await databases.getDocument(DATABASE_ID, COL_TEMPLATES, id);
                setTitle(doc.name || "Untitled");
                setContent(doc.content || "");
                setCategory(doc.category || "General");

                try {
                    if (doc.variables) {
                        const parsedVars = Array.isArray(doc.variables)
                            ? doc.variables.map((v: any) => {
                                try { return typeof v === 'string' ? JSON.parse(v) : v; }
                                catch { return { name: v, type: 'text', default: '' }; }
                            })
                            : JSON.parse(doc.variables);
                        setVariables(parsedVars);
                    }
                } catch (e) {
                    console.error("Failed to parse variables", e);
                }

            } catch (error) {
                console.error("Failed to load template", error);
                alert("Could not load template.");
                router.push("/dashboard/templates");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplate();
    }, [id, user, router]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const data = {
                name: title,
                content: content,
                variables: variables.map(v => typeof v === 'string' ? v : JSON.stringify(v)),
                userId: user.$id,
                category: category,
            };

            if (id === "new") {
                const res = await databases.createDocument(DATABASE_ID, COL_TEMPLATES, ID.unique(), data);
                alert("Template created successfully!");
                router.push(`/editor/${res.$id}`);
            } else {
                await databases.updateDocument(DATABASE_ID, COL_TEMPLATES, id, data);
                alert("Template saved successfully!");
            }
        } catch (error) {
            console.error("Failed to save template", error);
            alert("Failed to save template.");
        } finally {
            setIsSaving(false);
        }
    };

    // Simple variable extraction (very basic)
    const extractVariables = (text: string) => {
        const regex = /\{\{([^}]+)\}\}/g;
        let match;
        const found = new Set<string>();
        while ((match = regex.exec(text)) !== null) {
            found.add(match[1].trim());
        }

        // Merge with existing
        const newVars = Array.from(found).map(name => {
            const existing = variables.find(v => v.name === name);
            return existing || { name, type: "text", default: "" };
        });

        setVariables(newVars);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        // Debounce this in a real app
        extractVariables(newContent);
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">Loading template...</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Sidebar Navigation */}
            <aside className="w-16 md:w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-all duration-300">
                <div className="p-4 md:p-6 flex justify-center md:justify-start">
                    <Link href="/dashboard" className="flex items-center gap-2 text-primary mb-1">
                        <span className="material-symbols-outlined text-3xl font-bold">description</span>
                        <h1 className="text-xl font-bold tracking-tight hidden md:block text-slate-900 dark:text-white">DocuForger</h1>
                    </Link>
                </div>

                <nav className="flex-1 px-2 md:px-4 space-y-1 mt-4">
                    <Link href="/dashboard" className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium hidden md:block">Dashboard</span>
                    </Link>
                    <Link href="/dashboard/templates" className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors">
                        <span className="material-symbols-outlined">description</span>
                        <span className="text-sm font-medium hidden md:block">Templates</span>
                    </Link>
                    <Link href="/dashboard/documents" className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">folder</span>
                        <span className="text-sm font-medium hidden md:block">Documents</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-center md:justify-start gap-3 px-0 md:px-2 py-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {typedProfile?.name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0 hidden md:block">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {typedProfile?.name || "User"}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">{typedProfile?.plan || "Free"} Account</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
                    <div className="flex items-center gap-4 min-w-0">
                        <nav className="flex items-center text-sm font-medium truncate">
                            <Link className="text-slate-500 hover:text-primary transition-colors hidden sm:inline" href="/dashboard/templates">Templates</Link>
                            <span className="mx-2 text-slate-300 hidden sm:inline">/</span>
                            <span className="text-slate-900 dark:text-slate-100 truncate">{title || "Untitled"}</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:block">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                        <button className="px-3 md:px-4 py-2 text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors hidden sm:block">
                            Preview
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-3 md:px-4 py-2 text-xs md:text-sm font-bold text-white rounded-lg transition-all flex items-center gap-2 ${isSaving ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                        >
                            <span className="material-symbols-outlined text-lg hidden sm:block">{isSaving ? 'sync' : 'save'}</span>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </header>

                {/* Secondary Nav / Tabs */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 overflow-x-auto no-scrollbar shrink-0">
                    <div className="flex gap-6 md:gap-8 min-w-max">
                        <button
                            onClick={() => setActiveTab("editor")}
                            className={`py-4 border-b-2 text-sm font-bold transition-colors ${activeTab === "editor" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            Editor
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-background-dark p-4 md:p-6 gap-6">

                    {/* Editor Panel */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px]">
                        {/* Editor Toolbar */}
                        <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1 overflow-x-auto">
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-xl">format_bold</span></button>
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-xl">format_italic</span></button>
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-xl">format_list_bulleted</span></button>
                            <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-xl">link</span></button>
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-xl">image</span></button>
                            <div className="flex-1"></div>
                        </div>

                        {/* Actual Editor Container */}
                        <div className="flex-1 relative p-6 md:p-8 overflow-y-auto flex flex-col">
                            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
                                <input
                                    className="w-full text-2xl font-bold border-none focus:ring-0 bg-transparent mb-6 text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    placeholder="Template Title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="flex-1 min-h-[400px]">
                                    <textarea
                                        className="w-full h-full min-h-[400px] resize-none border-none focus:ring-0 bg-transparent text-slate-700 dark:text-slate-300 outline-none p-0 leading-relaxed font-mono text-sm"
                                        placeholder="Start typing your template here... Use {{variable_name}} to add variables."
                                        value={content}
                                        onChange={handleContentChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Variables & Settings */}
                    <div className="w-full lg:w-80 flex flex-col gap-6 overflow-y-auto shrink-0">
                        {/* Template Settings Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 shrink-0">
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="material-symbols-outlined text-primary text-lg">settings_suggest</span>
                                Template Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full text-sm rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-primary focus:border-primary text-slate-900 dark:text-white p-2 outline-none"
                                    >
                                        <option value="General">General</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Proposal">Proposal</option>
                                        <option value="Invoice">Invoice</option>
                                        <option value="HR">HR</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Variables Card */}
                        <div className="flex-1 min-h-[300px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <span className="material-symbols-outlined text-primary text-lg">data_object</span>
                                    Detected Variables
                                </h3>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{variables.length}</span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 min-h-0">
                                <div className="space-y-1">
                                    {variables.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-slate-500">
                                            No variables detected. Add {`{{variable}}`} in your text.
                                        </div>
                                    ) : (
                                        variables.map((v, i) => (
                                            <div key={i} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono font-bold text-primary">{`{{${v.name}}}`}</span>
                                                    <span className="text-[10px] text-slate-400">Type: {v.type}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
