"use client";

import CustomInput from "@/components/common/customInput";
import EditorWrapper from "@/components/common/EditorWrapper";
import { RichTextEditorProps } from "@/components/common/richTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeDataTypes, useResumeData } from "@/state/store";
import { base64Generator } from "@/utils/base64Generator";
import { Camera, Delete, Plus } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";

const PersonalInfoForm = () => {
    const persoanlInfoData = useResumeData<ResumeDataTypes>((state) => state);
    const setResumeData = useResumeData((state) => state.setResumeData);
    const [editrValue, setEditorValue] = useState<RichTextEditorProps>();
    const [socialLinks, setSocialLinks] = useState<
        Record<string, string>[] | null
    >(null);

    const handleInputs = async (e: FormEvent) => {
        const target = e.target as HTMLInputElement;

        let value;
        if (target.name === "image") {
            if (target.files && target.files.length > 0) {
                value = await base64Generator(target.files[0]);
            } else {
                value = null;
            }
        } else {
            value = target.value;
        }
        setResumeData({
            ...persoanlInfoData,
            [target.name]: value,
        });
    };

    const handleEditorText = (editrValue: any) => {
        setResumeData({
            ...persoanlInfoData,
            about: editrValue,
        });
        setEditorValue(editrValue);
    };

    const addSocial = () => {
        setSocialLinks([
            ...(socialLinks ?? []),
            {
                type: "",
                link: "",
            },
        ]);
    };

    const handleSocial = (
        index: number,
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        const updatedSocials = [...(persoanlInfoData.socials ?? [])];

        if (!updatedSocials[index]) {
            updatedSocials[index] = { type: "email", link: "" };
        }

        updatedSocials[index][name] = value;

        setResumeData({
            ...persoanlInfoData,
            socials: updatedSocials,
        });
    };

    const handleDelete = (i: number) => {
        const updatedSocials = [...(persoanlInfoData.socials ?? [])];

        const newSocial = updatedSocials.filter((v, idx) => idx !== i);
        const newSocialLinks =
            socialLinks?.filter((v, idx) => idx !== i) ?? null;

        setResumeData({
            ...persoanlInfoData,
            socials: newSocial,
        });
        setSocialLinks(newSocialLinks);
    };

    console.log(persoanlInfoData);

    return (
        <div>
            <div className="flex items-start gap-8">
                <div className="flex flex-col gap-3">
                    <Label htmlFor="Image">Photo</Label>
                    <Label
                        htmlFor="picture"
                        className="w-32 h-32 aspect-square border rounded-md flex items-center justify-center hover:border-primary cursor-pointer overflow-hidden"
                    >
                        {persoanlInfoData.image ? (
                            <Image
                                src={persoanlInfoData.image}
                                width={100}
                                height={100}
                                alt="image"
                                className="w-32 h-32 object-cover aspect-square"
                            />
                        ) : (
                            <Camera />
                        )}
                        <Input
                            name="image"
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleInputs}
                        />
                    </Label>
                </div>
                <div className="w-full flex flex-col gap-6">
                    <CustomInput
                        label="Name"
                        placeholder="Mustak"
                        id="name"
                        type="text"
                        name="name"
                        onChange={handleInputs}
                    />
                    <CustomInput
                        label="Tagline"
                        placeholder="Developer"
                        id="tagline"
                        type="text"
                        name="tagline"
                        onChange={handleInputs}
                    />
                </div>
            </div>
            <h5 className="text-lg font-semibold my-3">Social Info</h5>
            {socialLinks?.map((_, i) => (
                <div key={i} className="flex items-end gap-3 mb-4">
                    <div className="w-64">
                        <label
                            htmlFor="type"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Selecet Social Handle
                        </label>
                        <select
                            id="type"
                            name="type"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={(e) => handleSocial(i, e)}
                            defaultValue="email"
                        >
                            <option value="email">email</option>
                            <option value="linkedin">linkedin</option>
                            <option value="github">github</option>
                        </select>
                    </div>
                    <CustomInput
                        label="Link"
                        id={`link+${i}`}
                        type="text"
                        placeholder="Link"
                        name="link"
                        onChange={(e) => handleSocial(i, e)}
                    />

                    <Button
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleDelete(i)}
                    >
                        <Delete />
                    </Button>
                </div>
            ))}
            <div className="flex items-center gap-3">
                <Button onClick={addSocial}>
                    <Plus />
                    Add Social
                </Button>
            </div>
            <h5 className="text-lg font-semibold my-3">About</h5>
            <div>
                <EditorWrapper value={editrValue} setValue={handleEditorText} />
            </div>
        </div>
    );
};

export default PersonalInfoForm;
