"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, CustomProfile } from "@/components/AuthProvider";

export default function Sidebar() {
    const pathname = usePathname();
    const { user, profile, logout, isLoading } = useAuth();
    const typedProfile = profile as CustomProfile | null;

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { name: "Documents", href: "/dashboard/documents", icon: "folder" },
        { name: "Templates", href: "/dashboard/templates", icon: "content_copy" },
        { name: "Billing", href: "/dashboard/billing", icon: "credit_card" },
        { name: "Settings", href: "/dashboard/settings", icon: "settings" },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary rounded-lg p-1.5 text-white">
                    <span className="material-symbols-outlined block">description</span>
                </div>
                <div>
                    <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-none">DocuForger</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 capitalize">
                        {typedProfile?.plan === "pro" ? "Pro Workspace" : "Free Tier"}
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold relative">
                            {(typedProfile as any)?.avatarUrl ? (
                                <img src={(typedProfile as any).avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{typedProfile?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                                {typedProfile?.name || user?.name || "Loading..."}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email || "loading@docuforge.io"}
                            </p>
                            {typedProfile?.plan && (
                                <span className="inline-block px-1.5 py-0.5 mt-1 text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary rounded-md">
                                    {typedProfile.plan} Plan
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        disabled={isLoading}
                        className="w-full text-xs font-semibold py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Logging out..." : "Log out"}
                    </button>
                </div>
            </div>
        </aside>
    );
}
