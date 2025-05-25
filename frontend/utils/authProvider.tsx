"use client";

import { useAuthStore } from "@/state/store";
import { useEffect } from "react";
import { toast } from "sonner";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, setAuth } = useAuthStore((state) => state);

    useEffect(() => {
        const getAuth = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/check-auth`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setAuth(data.data);
                }
            } catch (error) {
                toast.error("Something went wrong while checking auth.");
                console.error(error);
            }
        };

        getAuth();
    }, []);

    return children;
};

export default AuthProvider;
