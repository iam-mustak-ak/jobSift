"use client";

import { useAuthStore } from "@/state/store";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetcherClient } from "./fetcherClient";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { setAuth } = useAuthStore((state) => state);

    useEffect(() => {
        let active = true;
        const initialUser = useAuthStore.getState().user;
        const getAuth = async () => {
            try {
                const data = await fetcherClient("/auth/check-auth");
                if (!active || useAuthStore.getState().user !== initialUser) return;

                if (data?.success && data.data?._id) {
                    setAuth(data.data);
                } else if (data?.httpStatus === 401 || data?.httpStatus === 403) {
                    setAuth(undefined);
                }
            } catch (error) {
                toast.error("Something went wrong while checking auth.");
                console.error(error);
            }
        };

        getAuth();
        return () => { active = false; };
    }, [setAuth]);

    return children;
};

export default AuthProvider;
