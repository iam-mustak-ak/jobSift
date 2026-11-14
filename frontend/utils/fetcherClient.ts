import { API_BASE_URL } from "@/lib/api";

export const fetcherClient = async (uri: string) => {
    try {
        const dataPromise = await fetch(
            `${API_BASE_URL}${uri}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await dataPromise.json();

        return { ...data, httpStatus: dataPromise.status };
    } catch (err) {
        console.log(err);
    }
};
