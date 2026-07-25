"use client"

import { 
    getToken, 
    getUser, 
    setToken as setStoredToken, 
    setUser as setStoredUser, 
    clearAuth 
} from "@/lib/auth"
import axiosInstance from "@/lib/axios"
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState, useContext } from "react"

export interface AuthcontextType {
    user: {
        id: string;
        username: string;
        email: string;
        createdAt?: string;
    } | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoggedIn: boolean;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthcontextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthcontextType['user']>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setTokenState] = useState<string | null>(null);
    const router=useRouter()
    useEffect(() => {
        const storedToken = getToken();
        const storedUser = getUser(null);
        if (storedToken && storedUser) {
            setTokenState(storedToken);
            try {
                setUser(JSON.parse(storedUser));
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const { data } = await axiosInstance.post("/api/auth/login", { email, password });
            if (data.success) {
                setTokenState(data.token);
                setUser(data.user);
                setStoredToken(data.token);
                setStoredUser(data.user);
                setIsLoggedIn(true);
                router.push("/dashboard")
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (err: any) {
            setIsLoggedIn(false);
            setUser(null);
            setTokenState(null);
            clearAuth();
            throw err;
        }
    }, [router]);

    const register = useCallback(async (username: string, email: string, password: string) => {
        try {
            const { data } = await axiosInstance.post("/api/auth/register", { username, email, password });
            if (data.success) {
                setTokenState(data.token);
                setUser(data.user);
                setStoredToken(data.token);
                setStoredUser(data.user);
                setIsLoggedIn(true);
                router.push("/dashboard")
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (err: any) {
            setIsLoggedIn(false);
            setUser(null);
            setTokenState(null);
            clearAuth();
            throw err;
        }
    }, [router]);

    const logout = useCallback(() => {
        setTokenState(null);
        setUser(null);
        clearAuth();
        router.push("/")
    }, [router]);

    const refreshUser = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/api/auth/getMe");
            if (data.success && data.user) {
                setUser(data.user);
                setStoredUser(data.user);
            }
        } catch (err) {
            console.error("Failed to refresh user", err);
            logout();
        }
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{ user, isLoggedIn, isLoading, login, register, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}