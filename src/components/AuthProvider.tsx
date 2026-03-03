"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { account, COL_PROFILES, DATABASE_ID, databases } from "@/lib/appwrite";
import { Models } from "appwrite";
import { useRouter, usePathname } from "next/navigation";

export interface CustomProfile extends Models.Document {
    name?: string;
    plan?: string;
    userId?: string;
}

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    profile: CustomProfile | null;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isLoading: true,
    logout: async () => { },
    refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [profile, setProfile] = useState<CustomProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const isPublicRoute = ["/", "/login", "/signup", "/forgot-password", "/reset-password"].includes(
        pathname || ""
    );

    const fetchUserAndProfile = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);

            // Fetch custom profile details from DB
            const profileList = await databases.listDocuments(DATABASE_ID, COL_PROFILES, []);

            const userProfile = profileList.documents.find((doc) => doc.userId === currentUser.$id) || null;
            setProfile(userProfile);
        } catch (error) {
            setUser(null);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await account.deleteSession("current");
        } catch (error) {
            console.error("Logout failed or already offline:", error);
        } finally {
            setUser(null);
            setProfile(null);
            setIsLoading(false);
            router.push("/");
        }
    };

    // Auto-logout after 30 mins of inactivity
    useEffect(() => {
        if (!user) return;

        let lastActivity = Date.now();
        const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

        const updateActivity = () => {
            lastActivity = Date.now();
        };

        const checkInactivity = setInterval(() => {
            if (Date.now() - lastActivity > TIMEOUT_MS) {
                console.log("Session expired due to inactivity.");
                logout();
            }
        }, 60000); // check every minute

        const events = ["mousemove", "keydown", "scroll", "click"];
        events.forEach(event => window.addEventListener(event, updateActivity));

        return () => {
            clearInterval(checkInactivity);
            events.forEach(event => window.removeEventListener(event, updateActivity));
        };
    }, [user, router]); // include router to satisfy hooks, though logout uses it

    // Force re-login if internet disconnects
    useEffect(() => {
        if (!user) return;

        const handleOffline = () => {
            console.log("Network disconnected. Forcing re-login to protect session.");
            // We only clear local state and push to home if offline, 
            // since API calls to deleteSession might fail.
            setUser(null);
            setProfile(null);
            router.push("/");
        };

        window.addEventListener("offline", handleOffline);
        return () => window.removeEventListener("offline", handleOffline);
    }, [user, router]);

    useEffect(() => {
        fetchUserAndProfile();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            if (!user && !isPublicRoute) {
                // Redirect to login if unauthenticated on private route
                router.push("/login");
            } else if (user && isPublicRoute && pathname !== "/") {
                // Redirect to dashboard if authenticated and on auth pages (but allow landing page)
                router.push("/dashboard");
            }
        }
    }, [user, isLoading, isPublicRoute, pathname, router]);

    // Original logout definition was moved up

    const refreshProfile = async () => {
        await fetchUserAndProfile();
    };

    return (
        <AuthContext.Provider value={{ user, profile, isLoading, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
