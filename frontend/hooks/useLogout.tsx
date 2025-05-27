import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutType = {
    redirect: string;
};

const useLogout = ({ redirect = "login" }: LogoutType) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        try {
            setError("");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) {
                setError("logout failed");
            }

            router.push(`/${redirect}`);
        } catch (err) {
            setError("Somthing went wrong");
        } finally {
            setLoading(false);
        }
    };

    return {
        handleLogout,
        loading,
        error,
    };
};

export default useLogout;
