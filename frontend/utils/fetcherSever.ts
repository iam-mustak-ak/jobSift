import { cookies } from "next/headers";

export const fetcherSever = async (uri: string) => {
    const cookieStore = await cookies();
    try {
        const dataPromise = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}${uri}`,
            {
                method: "GET",
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
