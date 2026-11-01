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
        <Button
            className="max-lg:hidden border-slate-300 bg-white text-slate-700 shadow-none hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
            asChild
            variant="outline"
        >
            <Link href="/post-job">Post A Job</Link>
        </Button>
    );
};

export default PostJobButton;
