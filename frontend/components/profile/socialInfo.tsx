"use client";

import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
        // { platform: "", url: "", logo: "" },
    ]);

    const handleAddSocial = () => {
        if (socialLinks.length >= 6) {
            return toast.error("You can only add up to 6 social links.");
        }

        setSocialLinks((prevLinks) => [
            ...prevLinks,
            { platform: "", url: "", logo: "" },
        ]);
    };

    const handleRemoveSocial = (index: number) => {
        setSocialLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
    };

    const handleChangeSocial = (index: number, e: any) => {
        const { name, value } = e.target;
        setSocialLinks((prevLinks) =>
            prevLinks.map((link, i) =>
                i === index ? { ...link, [name]: value } : link
            )
        );
    };

    const handleSelectChange = (index: number, value: string) => {
        setSocialLinks((prevLinks) =>
            prevLinks.map((link, i) =>
                i === index
                    ? {
                          ...link,
                          platform: value,
                          logo: `/${value?.toLowerCase()}.svg`,
                      }
                    : link
            )
        );
    };

    console.log(socialLinks);

    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader>
                <CardTitle>Social Information</CardTitle>
            </CardHeader>
            <CardContent>
                {socialLinks.length > 0 &&
                    socialLinks.map((item, i) => (
                        <div key={i} className="mb-4 relative">
                            <Button
                                variant="destructive"
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => handleRemoveSocial(i)}
                            >
                                <Trash />
                            </Button>
                            <div className="flex items-center justify-start gap-4 flex-wrap">
                                <Link href="/" className="w-12 h-12">
                                    <Image
                                        src={item?.logo || "/other.svg"}
                                        width={100}
                                        height={100}
                                        alt="logo"
                                    />
                                </Link>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <CustomSelect
                                    name="platform"
                                    options={socialOptions}
                                    placeholder="Select Platform"
                                    label="Platform"
                                    onChangeValue={(value) =>
                                        handleSelectChange(i, value)
                                    }
                                />
                                <CustomInput
                                    label="Url"
                                    name="url"
                                    placeholder="Enter Social Link"
                                    type="url"
                                    id={`socialLink-${i}`}
                                    onChange={(e) => handleChangeSocial(i, e)}
                                />
                            </div>
                        </div>
                    ))}
            </CardContent>
            <CardFooter className="gap-2">
                <Button variant="outline" onClick={handleAddSocial}>
                    <Plus />
                    Add
                </Button>
                <Button>Save</Button>
            </CardFooter>
        </Card>
    );
};

export default SocialInfo;
