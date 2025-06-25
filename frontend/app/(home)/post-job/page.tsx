"use client";

import { useAuthStore } from "@/state/store";

const Page = () => {
    const { user } = useAuthStore((state) => state);
    console.log(user);

    return <h1>Welcome to Page</h1>;
};

export default Page;
