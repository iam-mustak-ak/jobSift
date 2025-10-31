/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { convert } from "html-to-text";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const CopyButton = ({ description }: { description: string }) => {
    const sanitizeJobDescription = convert(description);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Description Copied");
        } catch (err) {
            toast.error("Error Copying the description");
        }
    };

    return (
        <Button
            onClick={() => handleCopy(sanitizeJobDescription)}
            className="cursor-pointer"
            title="Copy description"
            variant={"outline"}
        >
            <Copy />
        </Button>
    );
};

export default CopyButton;
