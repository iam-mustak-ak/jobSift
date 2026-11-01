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
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="grid gap-2">
                <Label className="text-sm font-semibold text-slate-900">{label}</Label>
                <p className="max-w-xl text-sm leading-5 text-slate-500">{description}</p>
            </div>
            <Switch
                checked={user?.isAvailableForHire}
                onCheckedChange={handleSwitch}
            />
        </div>
    );
};

export default SettingButtons;
