"use client";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface selectProps extends React.ComponentProps<"select"> {
    options?: string[];
    placeholder?: string;
    className?: string;
    label?: string;
    onChangeValue?: (value: string) => void;
    defaultValue?: string;
    icon?: React.ReactNode;
    value?: string;
}

const CustomSelect = (props: selectProps) => {
    const {
        name,
        placeholder,
        className,
        options,
        label,
        onChangeValue,
        defaultValue,
        icon,
        value,
    } = props;
    return (
        <div>
            {label && <Label className="mb-3">{label}</Label>}
            <Select
                name={name}
                defaultValue={defaultValue}
                value={value}
                onValueChange={(v) => {
                    onChangeValue?.(v);
                }}
            >
                <SelectTrigger
                    className={cn(
                        "w-full rounded-lg bg-background text-muted-foreground ",
                        className
                    )}
                >
                    {icon && icon}
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options?.map((option, i) => (
                        <SelectItem key={i} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default CustomSelect;
