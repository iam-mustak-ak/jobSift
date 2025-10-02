"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type CustomInputProps = {
    id: string;
    label?: string;
    type: string;
    placeholder?: string;
    className?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    defaultValue?: string;
};

function CustomInput({ id, label, ...props }: CustomInputProps) {
    return (
        <div className="grid gap-2 w-full">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                </Label>
            )}

            <Input id={id} className="border rounded-md p-2" {...props} />
        </div>
    );
}

export default CustomInput;
