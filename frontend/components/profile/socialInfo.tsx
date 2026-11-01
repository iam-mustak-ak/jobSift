"use client";

import { useAuthStore } from "@/state/store";
import { Check, Link2, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CustomInput from "../common/customInput";
import CustomSelect from "../common/customSelect";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

const socialOptions = [
    "Facebook",
    "Instagram",
    "LinkedIn",
    "GitHub",
    "Twitter",
    "Other",
];

type SocialLink = {
    platform: string;
    url: string;
    logo: string;
};

const SocialInfo = () => {
    const { user, setAuth } = useAuthStore((state) => state);

    const socialLinks: SocialLink[] = user?.socialLinks || [];

    const [loading, setLoading] = useState(false);

    const handleAddSocial = () => {
        if (socialLinks.length >= 6) {
            return toast.error("You can only add up to 6 social links.");
        }

        const updated = [...socialLinks, { platform: "", url: "", logo: "" }];
        setAuth({ ...user, socialLinks: updated });
    };

    const handleRemoveSocial = (index: number) => {
        const updated = socialLinks.filter((_, i) => i !== index);
        setAuth({ ...user, socialLinks: updated });
    };

    const handleChangeSocial = (index: number, e: any) => {
        const { name, value } = e.target;
        const updated = socialLinks.map((link, i) =>
            i === index ? { ...link, [name]: value } : link
        );
        setAuth({ ...user, socialLinks: updated });
    };

    const handleSelectChange = (index: number, value: string) => {
        const updated = socialLinks.map((link, i) =>
            i === index
                ? {
                      ...link,
                      platform: value,
                      logo: `/${value?.toLowerCase()}.svg`,
                  }
                : link
        );
        setAuth({ ...user, socialLinks: updated });
    };

    const handleUpdateSocialLinks = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/update-social-links`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ socialLinks }),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update social links");
            }

            toast.success("Social links updated successfully!");
        } catch (err: any) {
            toast.error("An error occurred while updating.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]">
            <CardHeader className="px-5 pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                        <Link2 className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Social links</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">Connect your professional profiles</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-5 pt-3">
                {socialLinks.length > 0 &&
                    socialLinks.map((item, i) => (
                        <div key={i} className="relative mb-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/70 p-4 transition hover:border-violet-200">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-3 top-3 h-8 w-8 cursor-pointer rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleRemoveSocial(i)}
                                aria-label="Remove social link"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="mb-4 flex items-center gap-3 pr-10">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                                    <Image
                                        src={item?.logo || "/other.svg"}
                                        width={32}
                                        height={32}
                                        alt={`${item.platform || "Social"} logo`}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">{item.platform || "Social profile"}</p>
                                    <p className="mt-0.5 text-xs text-slate-500">Professional profile link</p>
                                </div>
                                {item.platform && item.url && (
                                    <span className="ml-auto hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 sm:inline-flex">
                                        <Check className="h-3 w-3" /> Added
                                    </span>
                                )}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <CustomSelect
                                    name="platform"
                                    options={socialOptions}
                                    placeholder="Select Platform"
                                    label="Platform"
                                    defaultValue={item.platform}
                                    className="h-10 rounded-xl border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100"
                                    onChangeValue={(value) =>
                                        handleSelectChange(i, value)
                                    }
                                />
                                <CustomInput
                                    label="Profile URL"
                                    name="url"
                                    placeholder="https://instagram.com/username"
                                    type="url"
                                    id={`socialLink-${i}`}
                                    onChange={(e) => handleChangeSocial(i, e)}
                                    value={item.url}
                                    className="h-10 rounded-xl border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-100 autofill:[box-shadow:inset_0_0_0_1000px_white]"
                                />
                            </div>
                        </div>
                    ))}
                {socialLinks.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm leading-6 text-slate-500">
                        Add a LinkedIn or other professional link so people can learn more about you.
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col-reverse gap-2 px-5 pb-5 pt-4 sm:flex-row">
                <Button variant="outline" className="w-full rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 sm:flex-1" onClick={handleAddSocial}>
                    <Plus className="h-4 w-4" /> Add link
                </Button>
                <Button disabled={loading} className="w-full rounded-xl bg-violet-700 font-semibold shadow-sm shadow-violet-700/15 hover:bg-violet-800 sm:flex-1" onClick={handleUpdateSocialLinks}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {loading ? "Saving…" : "Save changes"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SocialInfo;
