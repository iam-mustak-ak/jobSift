"use client";

import { useAuthStore } from "@/state/store";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetcherClient } from "./fetcherClient";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { setAuth } = useAuthStore((state) => state);

    useEffect(() => {
        const getAuth = async () => {
            try {
                const data = await fetcherClient("/auth/check-auth");

                if (data.success) {
                    setAuth(data.data);
                }
            } catch (error) {
                toast.error("Something went wrong while checking auth.");
                console.error(error);
            }
        };

        getAuth();
    }, [setAuth]);

    return children;
};

export default AuthProvider;
