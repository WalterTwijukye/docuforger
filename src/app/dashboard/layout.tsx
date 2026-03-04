import { Metadata } from "next";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
    title: "Dashboard | DocuForge",
    description: "Manage your documents and templates in DocuForge.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
            {/* SideNav */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* We can place a mobile header here later if needed */}
                <div className="md:hidden p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary rounded-lg p-1 text-white">
                            <span className="material-symbols-outlined text-sm">description</span>
                        </div>
                        <h1 className="text-slate-900 dark:text-white font-bold text-base leading-none">DocuForger</h1>
                    </div>
                    <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
