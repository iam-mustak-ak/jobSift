"use client";

import { useAuthStore } from "@/state/store";
import Link from "next/link";
import { Button } from "../ui/button";

const PostJobButton: React.FC = () => {
    const { user } = useAuthStore((state) => state);

    if (user?.role === "candidate") {
        return null;
    }
    return (
        <Button className="max-lg:hidden" asChild variant="outline">
            <Link href="/post-job">Post A Job</Link>
        </Button>
    );
};

export default PostJobButton;
