"use client";
import Spinner from "@/lib/LogoProvider/spinner";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

const SubmitButton = ({ label }: { label: string }) => {
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} type="submit">
            {pending && <Spinner />} {label}
        </Button>
    );
};

export default SubmitButton;
