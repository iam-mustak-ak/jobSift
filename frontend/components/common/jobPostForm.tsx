/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/state/store";
import { formatData } from "@/utils/formateData";
import { BriefcaseBusiness, Building2, CalendarDays, CircleDollarSign, FileText, Loader2, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ComboBox from "../ui/comboBox";
import { Label } from "../ui/label";
import MultipleSelector, { Option } from "../ui/multiSelect";
import CustomInput from "./customInput";
import CustomSelect from "./customSelect";
import EditorWrapper from "./EditorWrapper";

interface JobPostFormProps {
    categories: Record<string, any>[];
    skills: Record<string, any>[];
    company: Record<string, any>[];
    jobData?: Record<string, any>;
}

const JobPostForm: React.FC<JobPostFormProps> = ({
    categories,
    skills,
    company,
    jobData,
}) => {
    const formattedCategories = formatData(categories);
    const formattedSkills = formatData(skills);
    const formattedCompany = formatData(company);
    const router = useRouter();
    const { user } = useAuthStore((state) => state);

    const [postLoading, setPostLoading] = useState(false);
    const [formValue, setFormValue] = useState({
        title: "",
        jobType: "full-time",
        employmentMode: "Remote",
        location: "",
        company: "",
        salaryRange: { min: 0, max: 0 },
        experienceLevel: "entry",
        skills: [] as Option[],
        categories: [] as Option[],
        description: "",
        deadline: "",
        tags: [] as string[],
        tagsInput: "",
    });

    useEffect(() => {
        if (jobData) {
            setFormValue({
                title: jobData.title || "",
                jobType: jobData.jobType || "full-time",
                employmentMode: jobData.employmentMode || "Remote",
                location: jobData.location || "",
                company: typeof jobData.company === "string" ? jobData.company : jobData.company?._id || "",
                salaryRange: jobData.salaryRange || { min: 0, max: 0 },
                experienceLevel: jobData.experienceLevel || "lead",
                skills: (jobData.skillsRequired || []).map((s: any) => ({
                    id: s._id,
                    label: s.name,
                })),
                categories: (jobData.jobCategory || []).map((c: any) => ({
                    id: c._id,
                    label: c.name,
                })),
                description: jobData.description || "",
                deadline: jobData.deadline
                    ? jobData.deadline.split("T")[0]
                    : "",
                tags: jobData.tags || [],
                tagsInput: jobData.tags?.join(", ") || "",
            });
        }
    }, [jobData]);

    const userCompanyId = typeof user?.company === "object"
        ? String((user.company as Record<string, any>)?._id ?? "")
        : String(user?.company ?? "");

    useEffect(() => {
        if (!jobData && userCompanyId) {
            setFormValue((prev) => ({ ...prev, company: userCompanyId }));
        }
    }, [jobData, userCompanyId]);

    const linkedCompany = formattedCompany.find((item: Option) => String(item.id) === userCompanyId);
    const companyOptions = userCompanyId
        ? [linkedCompany ?? {
            id: userCompanyId,
            value: "Your company",
            label: typeof user?.company === "object" ? String((user.company as Record<string, any>)?.name ?? "Your company") : "Your company",
        }]
        : [];

    const handleChange = (key: string, value: any) => {
        setFormValue((prev) => ({ ...prev, [key]: value }));
    };

    const handleTagsChange = (value: string) => {
        const tagsArray = value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        setFormValue((prev) => ({
            ...prev,
            tagsInput: value,
            tags: tagsArray,
        }));
    };

    const validateForm = () => {
        if (!formValue.title.trim()) return "Job title is required";
        if (!userCompanyId || !formValue.company) return "Link your company to your recruiter account before publishing";
        if (!formValue.location.trim()) return "Add the job location or enter Remote";
        if (!formValue.skills.length) return "Select at least one skill";
        if (!formValue.categories.length) return "Select at least one category";
        const descriptionText = formValue.description
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;|&#160;/gi, " ")
            .trim();
        if (!descriptionText) return "Job description is required";
        if (!formValue.deadline) return "Deadline is required";

        const selectedDate = new Date(formValue.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today)
            return "Deadline cannot be earlier than today";

        const min = formValue.salaryRange.min;
        const max = formValue.salaryRange.max;

        if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) {
            return "Salary must be valid numbers";
        }

        if (min > 0 && max > 0 && min > max)
            return "Minimum salary cannot exceed maximum salary";

        return null;
    };

    const saveJob = async (isDraft: boolean) => {
        const formData = {
            title: formValue.title,
            jobType: formValue.jobType,
            employmentMode: formValue.employmentMode,
            location: formValue.location,
            company: formValue.company,
            salaryRange: formValue.salaryRange,
            experienceLevel: formValue.experienceLevel,
            skillsRequired: formValue.skills.map((v) => v.id),
            jobCategory: formValue.categories.map((v) => v.id),
            description: formValue.description,
            deadline: formValue.deadline,
            tags: formValue.tags,
            isDraft,
        };

        setPostLoading(true);
        try {
            const url = jobData
                ? `${process.env.NEXT_PUBLIC_SERVER_URL}/job/update/${jobData._id}`
                : `${process.env.NEXT_PUBLIC_SERVER_URL}/job/create`;

            const method = jobData ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                body: JSON.stringify(formData),
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json().catch(() => null);
            if (!response.ok || !result?.success) {
                throw new Error(result?.message || "Could not save this job.");
            }

            toast.success(
                isDraft
                    ? "Draft saved successfully!"
                    : jobData
                    ? "Job updated successfully!"
                    : "Job posted successfully!"
            );
            router.push(`/profile/${user?._id}/my-jobs?page=1`);
        } catch (err: any) {
            toast.error(err?.message || "Failed to save job. Please try again.");
        } finally {
            setPostLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errorMsg = validateForm();
        if (errorMsg) {
            toast.error(errorMsg);
            return;
        }
        await saveJob(false);
    };

    const handleSaveDraft = async () => {
        if (!formValue.title.trim()) {
            toast.error("Job title is required to save draft");
            return;
        }
        await saveJob(true);
    };

    return (
        <div className="mx-auto max-w-6xl py-8">
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white shadow-lg shadow-slate-900/[0.04]">
                <CardContent className="p-5 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="border-b border-slate-100 pb-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">Job information</p>
                            <h2 className="mt-1 text-xl font-bold text-slate-950">Tell candidates about the role</h2>
                            <p className="mt-1 text-sm text-slate-500">Start with the essentials. You can save this as a draft at any time.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800"><BriefcaseBusiness className="h-4 w-4 text-violet-700" /> Role details</div>
                        <CustomInput
                            id="title"
                            label="Job title"
                            type="text"
                            name="title"
                            placeholder="e.g. Senior Product Designer"
                            value={formValue.title}
                            required
                            className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                            onChange={(e: any) =>
                                handleChange("title", e.target.value)
                            }
                        />

                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                            <CustomSelect
                                label="Employment type"
                                options={["full-time", "part-time", "contract", "internship"]}
                                value={formValue.jobType}
                                onChangeValue={(val: string) =>
                                    handleChange("jobType", val)
                                }
                            />

                            <CustomSelect
                                label="Work arrangement"
                                options={["Remote", "Hybrid", "Onsite"]}
                                value={formValue.employmentMode}
                                onChangeValue={(val: string) =>
                                    handleChange("employmentMode", val)
                                }
                            />

                            <CustomInput
                                id="location"
                                name="location"
                                label="Location"
                                type="text"
                                placeholder="City, region, or Remote"
                                value={formValue.location}
                                className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                onChange={(e) => handleChange("location", e.target.value)}
                            />

                            <ComboBox
                                name="company"
                                title="Company"
                                placeholder="Choose your company"
                                value={formValue.company}
                                values={companyOptions.map(
                                    (item: Option) => ({
                                        value: String(item.id ?? ""),
                                        label: String(item.label ?? ""),
                                    })
                                )}
                                setValue={(val: string) =>
                                    handleChange("company", val)
                                }
                            />

                            <div className="w-full">
                                <Label className="mb-2 block text-sm font-medium text-slate-800">Salary range <span className="font-normal text-slate-400">(optional)</span></Label>
                                <div className="flex items-end gap-3">
                                    <CustomInput
                                        id="min"
                                        label="Minimum"
                                        placeholder="0"
                                        type="number"
                                        value={formValue.salaryRange.min ? String(formValue.salaryRange.min) : ""}
                                        className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                        onChange={(e: any) =>
                                            handleChange("salaryRange", {
                                                ...formValue.salaryRange,
                                                min: Number(e.target.value),
                                            })
                                        }
                                    />
                                    <CustomInput
                                        id="max"
                                        label="Maximum"
                                        placeholder="0"
                                        type="number"
                                        value={formValue.salaryRange.max ? String(formValue.salaryRange.max) : ""}
                                        className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                        onChange={(e: any) =>
                                            handleChange("salaryRange", {
                                                ...formValue.salaryRange,
                                                max: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <CustomInput
                                id="deadline"
                                label="Application deadline"
                                type="date"
                                value={formValue.deadline}
                                required
                                className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                onChange={(e: any) =>
                                    handleChange("deadline", e.target.value)
                                }
                            />

                            <CustomInput
                                id="tags"
                                label="Search tags (optional)"
                                placeholder="e.g. remote, visa sponsorship"
                                type="text"
                                value={formValue.tagsInput}
                                className="h-11 rounded-xl border-slate-200 bg-white px-3.5 text-sm"
                                onChange={(e: any) =>
                                    handleTagsChange(e.target.value)
                                }
                            />

                            <CustomSelect
                                label="Experience level"
                                options={["entry", "mid", "senior", "lead"]}
                                value={formValue.experienceLevel}
                                onChangeValue={(val: string) =>
                                    handleChange("experienceLevel", val)
                                }
                            />

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-800">Required skills</Label>
                                <MultipleSelector
                                    defaultOptions={formattedSkills}
                                    placeholder="Choose skills candidates should have"
                                    value={formValue.skills}
                                    onChange={(val: Option[]) =>
                                        handleChange("skills", val)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-800">Job categories</Label>
                                <MultipleSelector
                                    defaultOptions={formattedCategories}
                                    placeholder="Choose relevant categories"
                                    value={formValue.categories}
                                    onChange={(val: Option[]) =>
                                        handleChange("categories", val)
                                    }
                                />
                            </div>
                        </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                            <div className="mb-4 flex items-start gap-3">
                                <FileText className="mt-0.5 h-4 w-4 text-violet-700" />
                                <div><Label className="text-sm font-semibold text-slate-800">Job description</Label><p className="mt-1 text-xs leading-5 text-slate-500">Describe the impact, responsibilities, qualifications, and what success looks like.</p></div>
                            </div>
                            <EditorWrapper value={formValue.description} setValue={(val: string) => handleChange("description", val)} />
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-400">You can update this post later.</p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={postLoading}
                                className="h-11 rounded-xl border-slate-200 px-5"
                            >
                                {postLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Save Draft"
                                )}
                            </Button>

                            <Button type="submit" disabled={postLoading}>
                                {postLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : jobData ? (
                                    "Update Job"
                                ) : (
                                    "Post Job"
                                )}
                            </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <aside className="space-y-4 xl:sticky xl:top-28">
                <Card className="rounded-3xl border-violet-100 bg-gradient-to-br from-violet-50 to-white shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm"><Sparkles className="h-5 w-5" /></div>
                        <h3 className="mt-4 font-semibold text-slate-900">Make the role stand out</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">Clear expectations help the right candidates decide quickly whether the opportunity fits.</p>
                        <ul className="mt-4 space-y-3 text-xs leading-5 text-slate-600">
                            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-violet-700" /> Be clear about location and remote options.</li>
                            <li className="flex gap-2"><CircleDollarSign className="h-4 w-4 shrink-0 text-violet-700" /> Add a salary range when you can.</li>
                            <li className="flex gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-violet-700" /> Give applicants a realistic deadline.</li>
                        </ul>
                    </CardContent>
                </Card>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-500">
                    <p className="flex items-center gap-2 font-semibold text-slate-800"><Building2 className="h-4 w-4 text-violet-700" /> Posting as your company</p>
                    <p className="mt-2">{userCompanyId ? "Your post will use the company linked to your recruiter account." : "Link a company to your recruiter account before publishing. You can still save a draft."}</p>
                </div>
            </aside>
            </div>
        </div>
    );
};

export default JobPostForm;
