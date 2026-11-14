"use client";
import { API_BASE_URL } from "@/lib/api";
import CustomInput from "@/components/common/customInput";
import CustomSelect from "@/components/common/customSelect";
import EditorWrapper from "@/components/common/EditorWrapper";
import ProfileCompleteIndicator from "@/components/common/profileCompleteIndicator";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/state/store";
import { Avatar } from "@radix-ui/react-avatar";
import Link from "next/link";
import {
    BriefcaseBusiness,
    Camera,
    Edit,
    Eye,
    FileText,
    Loader2,
    Trash,
    UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
    const { profileId } = useParams<{ profileId: string }>();
    const router = useRouter();
    useEffect(() => {
        if (user?._id && profileId !== user._id) {
            router.replace(`/profile/${user._id}/edit-profile`);
        }
    }, [profileId, router, user?._id]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isEnabledEdit, SetIsEnableEdit] = useState<string>("");
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    const [skillInput, setSkillInput] = useState<string>("");

    const handleImageUpload = async (e: FormEvent) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Please choose a JPG, PNG, or WEBP image.");
            target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Please choose an image smaller than 5 MB.");
            target.value = "";
            return;
        }

        setImageLoading(true);
        try {
            if (target.files && target.files.length > 0) {
                const formData = new FormData();
                formData.append("image", target.files[0]);

                const uploadImage = await fetch(
                    `${API_BASE_URL}/image/?type=profile`,
                    {
                        method: "POST",

                        credentials: "include",
                        body: formData,
                    }
                );

                const data = await uploadImage.json().catch(() => null);

                if (!uploadImage.ok || !data?.success || typeof data.data !== "string") {
                    toast.error(data?.message || "Couldn’t upload your photo. Please try again.");
                    return;
                }

                // get the new image URL from response
                const newProfilePicture = data.data;

                // update in DB with the new image
                const updateResponse = await fetch(
                    `${API_BASE_URL}/auth/update-profile`,
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

                const updatedProfile = await updateResponse.json().catch(() => null);
                if (!updateResponse.ok || !updatedProfile?.success) {
                    toast.error(updatedProfile?.message || "Photo uploaded, but your profile could not be saved. Please try again.");
                    return;
                }

                setAuth({
                    ...user,
                    profilePicture: newProfilePicture,
                });

                toast.success("Profile picture updated!");
            } else {
                toast.error("Error Uploading");
            }
        } catch (err) {
            toast.error("Something went wrong");
            console.log(err);
        } finally {
            setImageLoading(false);
            target.value = "";
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            await fetch(
                `${API_BASE_URL}/auth/update-profile`,
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
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
            <div className="flex flex-col gap-4 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                    <p className="text-sm font-semibold text-violet-700">Your professional presence</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Edit your profile</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Keep your details, experience, and preferences up to date so your profile makes a strong first impression.</p>
                </div>
                {user?._id && (
                    <Link
                        href={`/profile/${user._id}`}
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
                    >
                        <Eye className="h-4 w-4" /> View profile
                    </Link>
                )}
            </div>

            <div className="grid w-full grid-cols-1 items-start gap-5 lg:grid-cols-3">
                <div className="grid gap-5 lg:col-span-2">
                    {/* avatar upload */}
                    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                        <div className="h-2 bg-gradient-to-r from-violet-600 to-indigo-500" />
                        <CardContent className="px-5 py-5 sm:px-6">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <Avatar className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-violet-50 bg-violet-100 text-2xl font-semibold text-violet-700 shadow-sm">
                                    {imageLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            <AvatarImage
                                                src={user?.profilePicture}
                                                alt={user?.name || "Profile photo"}
                                                className="rounded-xl object-cover"
                                            />
                                            <AvatarFallback>{user?.name?.slice(0, 2)?.toUpperCase() || "JS"}</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-base font-semibold text-slate-900">Profile photo</h2>
                                    <p className="mt-1 text-sm leading-5 text-slate-500">Use a clear, professional photo so people can recognize you.</p>
                                    <Label className="mt-4 inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                                        {imageLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                                        {imageLoading ? "Uploading…" : "Change photo"}
                                        <Input
                                            name="image"
                                            id="picture"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </Label>
                                    <p className="mt-2 text-xs text-slate-400">JPG, PNG, or WEBP supported</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* personal info */}
                    <Card className="rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                        <CardHeader className="px-5 pb-3 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><UserRound className="h-5 w-5" /></div>
                                    <div><CardTitle className="text-base">Personal information</CardTitle><p className="mt-1 text-sm text-slate-500">How people can reach and recognize you</p></div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() =>
                                        SetIsEnableEdit("personal-info")
                                    }
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 sm:px-6">
                            <CustomInput
                                type="text"
                                id="bio"
                                label="Tagline"
                                name="bio"
                                placeholder="Full-stack Dev"
                                className="mb-5 w-full sm:max-w-md"
                                defaultValue={user?.bio}
                                onChange={(e) =>
                                    setAuth({
                                        ...user,
                                        bio: e.target.value,
                                    })
                                }
                            />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <Card className="rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                        <CardHeader className="px-5 pb-3 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><BriefcaseBusiness className="h-5 w-5" /></div>
                                    <div><CardTitle className="text-base">Job preferences</CardTitle><p className="mt-1 text-sm text-slate-500">The opportunities you’re looking for</p></div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() =>
                                        SetIsEnableEdit("job-preferences")
                                    }
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 sm:px-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <Card className="rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                        <CardHeader className="px-5 pb-3 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><FileText className="h-5 w-5" /></div>
                                <div><CardTitle className="text-base">About & skills</CardTitle><p className="mt-1 text-sm text-slate-500">Tell your story and highlight what you do best</p></div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 sm:px-6">
                            <EditorWrapper
                                setValue={(v) => setAuth({ ...user, about: v })}
                                value={user?.about}
                            />

                            <form onSubmit={handleAddSkill} className="mt-6 rounded-2xl bg-slate-50 p-4">
                                <div className="mb-3">
                                    <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
                                    <p className="mt-1 text-xs text-slate-500">Add keywords that describe your strengths. Press Enter to add each one.</p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                    <CustomInput
                                        type="text"
                                        id="skill"
                                        name="skill"
                                        placeholder="e.g. Product design"
                                        label="Add a skill"
                                        className="w-full"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                    />
                                    <Button type="submit" className="h-11 shrink-0 rounded-xl px-5">Add skill</Button>
                                </div>
                            </form>

                            {user?.skills?.length > 0 && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    {user?.skills?.map(
                                        (v: string, i: number) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50 pl-3 text-sm font-medium text-violet-800"
                                            >
                                                <p className="py-2">
                                                    {v}
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-full p-0 text-violet-700 hover:bg-violet-100 hover:text-red-600"
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
                        <CardFooter className="gap-3 px-5 pb-5 pt-4 sm:px-6">
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
                <aside className="space-y-5 lg:sticky lg:top-20">
                    <ProfileCompleteIndicator />
                    <Card className="rounded-2xl border-violet-100 bg-gradient-to-br from-white to-violet-50/70 shadow-sm shadow-slate-900/[0.03]">
                        <CardContent className="px-5 py-5">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm"><Eye className="h-5 w-5" /></div>
                            <h3 className="text-sm font-semibold text-slate-900">Make your profile count</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500">A complete profile helps employers understand your experience and what you’re looking for.</p>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
};

export default Page;
