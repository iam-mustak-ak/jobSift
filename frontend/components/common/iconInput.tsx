import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface iconinputProps extends React.ComponentProps<"input"> {
    Icon: React.ElementType;
    isSelect?: boolean;
}

const IconInput = ({ className, Icon, isSelect, ...props }: iconinputProps) => {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <div className="relative flex items-center">
                <div className="absolute left-2.5  h-4 w-4 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                </div>
                {isSelect ? (
                    <Select name="category">
                        <SelectTrigger
                            className={cn(
                                "w-full rounded-lg bg-background pl-8 text-muted-foreground",
                                className
                            )}
                        >
                            <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <Input
                        {...props}
                        className={cn(
                            "w-full rounded-lg bg-background pl-8",
                            className
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default IconInput;
