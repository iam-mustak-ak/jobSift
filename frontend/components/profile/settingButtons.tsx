import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const SettingButtons = ({
    label,
    description,
}: {
    label: string;
    description: string;
}) => {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="grid gap-2">
                <Label>{label}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch />
        </div>
    );
};

export default SettingButtons;
