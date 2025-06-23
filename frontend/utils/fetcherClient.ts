export const fetcherClient = async (uri: string) => {
    try {
        const dataPromise = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}${uri}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await dataPromise.json();

        return Promise.resolve(data);
    } catch (err) {
        console.log(err);
    }
};
