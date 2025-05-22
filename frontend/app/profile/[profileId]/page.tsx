import { cookies } from "next/headers";

type ProfilePrps = {
    params: Promise<{ profileId: string }>;
};
const Page = async ({ params }: ProfilePrps) => {
    const { profileId } = await params;
    const cookieStore = await cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me/${profileId}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
        }
    );
    const data = await res.json();

    console.log(data);

    return <h1>Welcome to {profileId}</h1>;
};

export default Page;
