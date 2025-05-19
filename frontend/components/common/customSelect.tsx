import { cn } from "@/lib/utils";
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
}

const CustomSelect = (props: selectProps) => {
    const { name, placeholder, className } = props;
    return (
        <Select name={name}>
            <SelectTrigger
                className={cn(
                    "w-full rounded-lg bg-background text-muted-foreground ",
                    className
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default CustomSelect;
