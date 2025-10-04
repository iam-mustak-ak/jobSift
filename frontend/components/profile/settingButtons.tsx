"use client";
import { useAuthStore } from "@/state/store";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

const SettingButtons = ({
    label,
    description,
}: {
    label: string;
    description: string;
}) => {
    const { user, setAuth } = useAuthStore((state) => state);

    const handleSwitch = async () => {
        const updatedUser = {
            ...user,
            isAvailableForHire: !user?.isAvailableForHire,
        };

        // update Zustand store
        setAuth(updatedUser);

        // send updated data to server
        await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/update-profile`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            }
        );
    };

    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="grid gap-2">
                <Label>{label}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch
                checked={user?.isAvailableForHire}
                onCheckedChange={handleSwitch}
            />
        </div>
    );
};

export default SettingButtons;
