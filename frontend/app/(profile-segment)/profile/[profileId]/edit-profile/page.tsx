"use client";
import CustomInput from "@/components/common/customInput";
import CustomSelect from "@/components/common/customSelect";
import EditorWrapper from "@/components/common/EditorWrapper";
import ProfileCompleteIndicator from "@/components/common/profileCompleteIndicator";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/state/store";
import { Avatar } from "@radix-ui/react-avatar";
import { Edit, Loader2, Trash } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

// type ProfileInfo = {
//     name: string;
//     phone: string;
//     location: string;
//     experience: string;
//     bio: string;
//     about: string;
//     jobPreferences: {
//         jobType: "full-time" | "part-time" | "contract" | "internship";
//         preferredLocation: string;
//         expectedSalary: number;
//     };
//     skills: string[];
// };

const Page = () => {
    const { setAuth, user } = useAuthStore((state) => state);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEnabledEdit, SetIsEnableEdit] = useState<string>("");
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    const [skillInput, setSkillInput] = useState<string>("");

    const handleImageUpload = async (e: FormEvent) => {
        const target = e.target as HTMLInputElement;

        setImageLoading(true);
        try {
            if (target.files && target.files.length > 0) {
                const formData = new FormData();
                formData.append("image", target.files[0]);

                const uploadImage = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/image/?type=profile`,
                    {
                        method: "POST",

                        credentials: "include",
                        body: formData,
                    }
                );

                const data = await uploadImage.json();

                if (!data.success) {
                    toast.error("Error Uploading");
                    return;
                }

                // get the new image URL from response
                const newProfilePicture = data.data;

                // update local state
                setAuth({
                    ...user,
                    profilePicture: newProfilePicture,
                });

                // update in DB with the new image
                await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/update-profile`,
                    {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            profilePicture: newProfilePicture,
                        }),
                    }
                );

                toast.success("Profile picture updated!");
            } else {
                toast.error("Error Uploading");
            }
        } catch (err) {
            toast.error("Something went wrong");
            console.log(err);
        } finally {
            setImageLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/update-profile`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                }
            );
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // add new skill
    const handleAddSkill = (e: FormEvent) => {
        e.preventDefault();
        if (!skillInput.trim()) return;

        const updatedSkills = [...(user?.skills ?? []), skillInput.trim()];

        setAuth({
            ...user,
            skills: updatedSkills,
        });

        setSkillInput(""); // reset input
    };

    // delete skill by index
    const handleDelete = (i: number) => {
        const updatedSkills = (user?.skills ?? []).filter(
            (_: string, idx: number) => idx !== i
        );
        setAuth({
            ...user,
            skills: updatedSkills,
        });
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-5">Edit Profile</h2>

            <div className="grid grid-cols-3 items-start gap-5 w-full">
                <div className="col-span-2 grid gap-5">
                    {/* avatar upload */}
                    <Card>
                        <CardContent>
                            <div className="flex items-center gap-5">
                                <Avatar className="h-24 w-24 rounded-lg flex items-center justify-center">
                                    {imageLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <AvatarImage
                                                src={user?.profilePicture}
                                                alt="somthing"
                                                className="rounded-lg"
                                            />
                                            <AvatarFallback>LG</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div className="grid gap-4 justify-start w-fit">
                                    <Label className="w-fit border py-3 px-5 rounded-md cursor-pointer">
                                        <Input
                                            name="image"
                                            id="picture"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                        Upload New Photo
                                    </Label>
                                    <CardDescription>
                                        Upload New photo from here, Support any
                                        type of images
                                    </CardDescription>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* personal info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Personal Information</CardTitle>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        SetIsEnableEdit("personal-info")
                                    }
                                >
                                    <Edit />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CustomInput
                                type="text"
                                id="bio"
                                label="Tagline"
                                name="bio"
                                placeholder="Full-stack Dev"
                                className="w-1/2 mb-5"
                                defaultValue={user?.bio}
                                onChange={(e) =>
                                    setAuth({
                                        ...user,
                                        bio: e.target.value,
                                    })
                                }
                            />
                            <div className="grid grid-cols-2 gap-5">
                                <CustomInput
                                    type="text"
                                    id="edit-name"
                                    label="Name"
                                    placeholder="john doe"
                                    name="name"
                                    defaultValue={user?.name}
                                    onChange={(e) =>
                                        setAuth({
                                            ...user,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <CustomInput
                                    type="phone"
                                    id="edit-phone"
                                    label="Phone"
                                    placeholder="0173661651"
                                    name="phone"
                                    defaultValue={user?.phone}
                                    onChange={(e) =>
                                        setAuth({
                                            ...user,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                                <CustomInput
                                    type="text"
                                    id="edit-location"
                                    label="Location"
                                    placeholder="Sylhet"
                                    name="location"
                                    defaultValue={user?.location}
                                    onChange={(e) =>
                                        setAuth({
                                            ...user,
                                            location: e.target.value,
                                        })
                                    }
                                />
                                <CustomInput
                                    type="text"
                                    id="edit-experience"
                                    label="Experience"
                                    placeholder="5 years +"
                                    name="experience"
                                    defaultValue={user?.experience}
                                    onChange={(e) =>
                                        setAuth({
                                            ...user,
                                            experience: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </CardContent>
                        {isEnabledEdit === "personal-info" && (
                            <CardFooter>
                                <div className="flex gap-4">
                                    <Button variant="outline">Cancel</Button>
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>
                            </CardFooter>
                        )}
                    </Card>

                    {/* job preferences */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Job Preferences</CardTitle>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        SetIsEnableEdit("job-preferences")
                                    }
                                >
                                    <Edit />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-5 ">
                                <CustomSelect
                                    label="Job type"
                                    name="jobType"
                                    placeholder="Full-time; Part-time"
                                    options={[
                                        "full-time",
                                        "part-time",
                                        "contract",
                                        "internship",
                                    ]}
                                    value={user?.jobPreferences?.jobType}
                                    defaultValue={user?.jobPreferences?.jobType}
                                    onChangeValue={(v) =>
                                        setAuth({
                                            ...user,
                                            jobPreferences: {
                                                ...user?.jobPreferences,
                                                jobType: v,
                                            },
                                        })
                                    }
                                />
                                <CustomInput
                                    type="text"
                                    id="Preferred-Location"
                                    label="Preferred Location"
                                    placeholder="Location"
                                    name="preferredLocation"
                                    defaultValue={
                                        user?.jobPreferences?.preferredLocation
                                    }
                                    onChange={(e) =>
                                        setAuth({
                                            ...user,
                                            jobPreferences: {
                                                ...user?.jobPreferences,
                                                preferredLocation:
                                                    e.target.value,
                                            },
                                        })
                                    }
                                />
                                <CustomInput
                                    type="number"
                                    id="edit-salary"
                                    label="Expected Salary"
                                    placeholder="1000"
                                    name="expectedSalary"
                                    defaultValue={
                                        user?.jobPreferences?.expectedSalary
                                    }
                                    onChange={(e) =>
                                        setAuth({
                                            ...user,
                                            jobPreferences: {
                                                ...user?.jobPreferences,
                                                expectedSalary: Number(
                                                    e.target.value
                                                ),
                                            },
                                        })
                                    }
                                />
                            </div>
                        </CardContent>
                        {isEnabledEdit === "job-preferences" && (
                            <CardFooter>
                                <div className="flex gap-4">
                                    <Button variant="outline">Cancel</Button>
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>
                            </CardFooter>
                        )}
                    </Card>

                    {/* about + skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditorWrapper
                                setValue={(v) => setAuth({ ...user, about: v })}
                                value={user?.about}
                            />

                            <form onSubmit={handleAddSkill} className="mt-5">
                                <CustomInput
                                    type="text"
                                    id="skill"
                                    name="skill"
                                    placeholder="Enter your skills"
                                    label="Skill"
                                    className="w-full"
                                    value={skillInput}
                                    onChange={(e) =>
                                        setSkillInput(e.target.value)
                                    }
                                />
                            </form>

                            {user?.skills?.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 mt-2">
                                    {user?.skills?.map(
                                        (v: string, i: number) => (
                                            <div
                                                key={i}
                                                className="flex items-center bg-primary rounded-full"
                                            >
                                                <p className="py-1 px-4 pr-2 rounded-full inline text-sm bg-primary font-semibold text-white">
                                                    {v}
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="rounded-full cursor-pointer"
                                                    onClick={() =>
                                                        handleDelete(i)
                                                    }
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-4">
                                <Button variant="outline">Cancel</Button>
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "Save"
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div>
                    <ProfileCompleteIndicator />
                </div>
            </div>
        </div>
    );
};

export default Page;
