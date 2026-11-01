"use client";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const SubmitButton = ({
    label,
    pending,
    className,
}: {
    label: string;
    pending: boolean;
    className?: string;
}) => {
    return (
        <Button disabled={pending} type="submit" className={className}>
            {pending ? <Loader2 className="animate-spin" /> : label}
        </Button>
    );
};

export default SubmitButton;
