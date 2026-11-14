import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/backend";

export const fetcherSever = async (uri: string) => {
    const cookieStore = await cookies();
    try {
        const dataPromise = await fetch(
            getBackendUrl(uri),
            {
                method: "GET",
                cache: "no-store",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString(),
                },
            }
        );

        const data = await dataPromise.json();

        return Promise.resolve(data);
    } catch (err) {
        console.log(err);
    }
};
