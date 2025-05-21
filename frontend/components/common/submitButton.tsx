"use client";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const SubmitButton = ({
    label,
    pending,
}: {
    label: string;
    pending: boolean;
}) => {
    return (
        <Button disabled={pending} type="submit">
            {pending ? <Loader2 className="animate-spin" /> : label}
        </Button>
    );
};

export default SubmitButton;
