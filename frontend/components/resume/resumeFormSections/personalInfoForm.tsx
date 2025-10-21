"use client";

import CustomInput from "@/components/common/customInput";
import EditorWrapper from "@/components/common/EditorWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { base64Generator } from "@/utils/base64Generator";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Camera, Delete, Plus } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FormEvent, useCallback } from "react";
import { toast } from "sonner";

const PersonalInfoForm = () => {
    const persoanlInfoData = useResumeData<ResumeDataTypes>((state) => state);
    const setResumeData = useResumeData((state) => state.setResumeData);

    const { setIsloading } = useSaveLoader((state) => state);
    const { resumeId } = useParams();

    const debouncedSave = useCallback(
        debounce(async (data: ResumeDataTypes) => {
            setIsloading(true);
            try {
                await saveResume(resumeId ?? "", data);
                toast.success("Resume Updated");
            } catch (error) {
                toast.error("Error while saving");
            } finally {
                setIsloading(false);
            }
        }, 1500),
        [resumeId]
    );

    const handleInputs = async (e: FormEvent) => {
        const target = e.target as HTMLInputElement;

        setResumeData({
            ...persoanlInfoData,
            [target.name]: target.value,
        });

        const updatedInfo = {
            ...persoanlInfoData,
            [target.name]: target.value,
        };

        debouncedSave(updatedInfo);
    };

    const handleEditorText = (editrValue: any) => {
        setResumeData({
            ...persoanlInfoData,
            about: editrValue,
        });

        const updatedInfo = { ...persoanlInfoData, about: editrValue };

        debouncedSave(updatedInfo);
    };

    const handleImageUpload = async (e: FormEvent) => {
        const target = e.target as HTMLInputElement;

        try {
            if (target.files && target.files.length > 0) {
                const base64 = await base64Generator(target.files[0]);
                setResumeData({
                    ...persoanlInfoData,
                    image: base64,
                });

                const formData = new FormData();
                formData.append("image", target.files[0]);

                const uploadImage = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/image/?type=resume&resumeId=${resumeId}`,
                    {
                        method: "POST",
                        credentials: "include",

                        body: formData,
                    }
                );
                const data = await uploadImage.json();

                if (!data.success) {
                    toast.error("Error Uploading");
                }
                setResumeData({
                    ...persoanlInfoData,
                    image: data.data,
                });

                const updatedInfo = {
                    ...persoanlInfoData,
                    image: data.data,
                };

                debouncedSave(updatedInfo);
            } else {
                toast.error("Error Uploading");
            }
        } catch (err) {
            toast.error("Somthing is wrong");
        }
    };

    const addSocial = () => {
        setResumeData({
            ...persoanlInfoData,
            socials: [
                ...(persoanlInfoData.socials ?? []),
                {
                    socialType: "email",
                    link: "",
                },
            ],
        });

        const updatedtInfo = {
            ...persoanlInfoData,
            socials: [
                ...(persoanlInfoData.socials ?? []),
                {
                    socialType: "email",
                    link: "",
                },
            ],
        };

        debouncedSave(updatedtInfo);
    };

    const handleSocial = (
        index: number,
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        const updatedSocials = [...(persoanlInfoData.socials ?? [])];

        if (!updatedSocials[index]) {
            updatedSocials[index] = { socialType: "email", link: "" };
        }

        updatedSocials[index][name] = value;

        setResumeData({
            ...persoanlInfoData,
            socials: updatedSocials,
        });

        const updatedInfo = {
            ...persoanlInfoData,
            socials: updatedSocials,
        };

        debouncedSave(updatedInfo);
    };

    const handleDelete = (i: number) => {
        const updatedSocials = [...(persoanlInfoData.socials ?? [])];

        const newSocial = updatedSocials.filter((v, idx) => idx !== i);

        setResumeData({
            ...persoanlInfoData,
            socials: newSocial,
        });

        const updatedInfo = { ...persoanlInfoData, socials: newSocial };
        debouncedSave(updatedInfo);
    };

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
                            onChange={handleImageUpload}
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
                        value={persoanlInfoData.name ?? ""}
                    />
                    <CustomInput
                        label="Tagline"
                        placeholder="Developer"
                        id="tagline"
                        type="text"
                        name="tagline"
                        onChange={handleInputs}
                        value={persoanlInfoData.tagline ?? ""}
                    />
                </div>
            </div>
            <h5 className="text-lg font-semibold my-3">Social Info</h5>
            {persoanlInfoData.socials?.map((v, i) => (
                <div key={i} className="flex items-end gap-3 mb-4">
                    <div className="w-auto">
                        <label
                            htmlFor="socialType"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Select Social Handle
                        </label>
                        <select
                            id="socialType"
                            name="socialType"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={(e) => handleSocial(i, e)}
                            value={v.socialType ?? "email"}
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
                        value={v.link}
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
                <Button variant="outline" onClick={addSocial}>
                    <Plus />
                    Add Social
                </Button>
            </div>
            <h5 className="text-lg font-semibold my-3">About</h5>
            <div>
                <EditorWrapper
                    value={persoanlInfoData.about}
                    setValue={handleEditorText}
                />
            </div>
        </div>
    );
};

export default PersonalInfoForm;
