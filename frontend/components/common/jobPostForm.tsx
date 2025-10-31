/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/state/store";
import { formatData } from "@/utils/formateData";
import { Loader2 } from "lucide-react";
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
        location: "Sylhet",
        company: "",
        salaryRange: { min: 0, max: 0 },
        experienceLevel: "lead",
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
                location: jobData.location || "Sylhet",
                company: jobData.company?._id || "",
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
        if (!formValue.company) return "Please select a company";
        if (!formValue.skills.length) return "Select at least one skill";
        if (!formValue.categories.length) return "Select at least one category";
        if (!formValue.description.trim()) return "Job description is required";
        if (!formValue.deadline) return "Deadline is required";

        const selectedDate = new Date(formValue.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today)
            return "Deadline cannot be earlier than today";

        const min = formValue.salaryRange.min;
        const max = formValue.salaryRange.max;

        if (
            (formValue.salaryRange.min && isNaN(min)) ||
            (formValue.salaryRange.max && isNaN(max))
        ) {
            return "Salary must be valid numbers";
        }

        if (min > max) return "Minimum salary cannot exceed maximum salary";

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

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || response.statusText);
            }

            toast.success(
                isDraft
                    ? "Draft saved successfully!"
                    : jobData
                    ? "Job updated successfully!"
                    : "Job posted successfully!"
            );
        } catch (err: any) {
            console.error("❌ Job save failed:", err);
            toast.error("Failed to save job. Please try again.");
        } finally {
            setPostLoading(false);
            setFormValue({
                title: "",
                jobType: "full-time",
                employmentMode: "Remote",
                location: "Sylhet",
                company: "",
                salaryRange: { min: 0, max: 0 },
                experienceLevel: "lead",
                skills: [],
                categories: [],
                description: "",
                deadline: "",
                tags: [],
                tagsInput: "",
            });

            router.push(`/profile/${user?._id}/my-jobs?page=1`);
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
        <div className="max-w-5xl mx-auto py-4 mt-10">
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-5">
                        {/* Title */}
                        <CustomInput
                            id="title"
                            label="Title"
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            value={formValue.title}
                            onChange={(e: any) =>
                                handleChange("title", e.target.value)
                            }
                        />

                        {/* Two-column section */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <CustomSelect
                                label="Job Type"
                                options={["full-time", "part-time", "contract"]}
                                value={formValue.jobType}
                                onChangeValue={(val: string) =>
                                    handleChange("jobType", val)
                                }
                            />

                            <CustomSelect
                                label="Employment Type"
                                options={["Remote", "Onsite"]}
                                value={formValue.employmentMode}
                                onChangeValue={(val: string) =>
                                    handleChange("employmentMode", val)
                                }
                            />

                            <ComboBox
                                name="location"
                                title="Location"
                                placeholder="Search Location"
                                value={formValue.location}
                                values={[
                                    { value: "Sylhet", label: "Sylhet" },
                                    { value: "Dhaka", label: "Dhaka" },
                                    {
                                        value: "Chittagong",
                                        label: "Chittagong",
                                    },
                                ]}
                                setValue={(val: string) =>
                                    handleChange("location", val)
                                }
                            />

                            <ComboBox
                                name="company"
                                title="Company"
                                placeholder="Search Companies"
                                value={formValue.company}
                                values={formattedCompany.map(
                                    (item: Option) => ({
                                        value: String(item.id ?? ""),
                                        label: String(item.label ?? ""),
                                    })
                                )}
                                setValue={(val: string) =>
                                    handleChange("company", val)
                                }
                            />

                            {/* Salary */}
                            <div className="w-full">
                                <Label className="mb-3">Salary Range</Label>
                                <div className="flex gap-4">
                                    <CustomInput
                                        id="min"
                                        placeholder="Min"
                                        type="text"
                                        value={String(
                                            formValue.salaryRange.min
                                        )}
                                        onChange={(e: any) =>
                                            handleChange("salaryRange", {
                                                ...formValue.salaryRange,
                                                min: Number(e.target.value),
                                            })
                                        }
                                    />
                                    <CustomInput
                                        id="max"
                                        placeholder="Max"
                                        type="text"
                                        value={String(
                                            formValue.salaryRange.max
                                        )}
                                        onChange={(e: any) =>
                                            handleChange("salaryRange", {
                                                ...formValue.salaryRange,
                                                max: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Deadline */}
                            <CustomInput
                                id="deadline"
                                label="Deadline"
                                type="date"
                                value={formValue.deadline}
                                onChange={(e: any) =>
                                    handleChange("deadline", e.target.value)
                                }
                            />

                            {/* Tags */}
                            <CustomInput
                                id="tags"
                                label="Tags"
                                placeholder="Comma separated (e.g. frontend, react)"
                                type="text"
                                value={formValue.tagsInput}
                                onChange={(e: any) =>
                                    handleTagsChange(e.target.value)
                                }
                            />

                            {/* Experience */}
                            <CustomSelect
                                label="Experience Level"
                                options={["entry", "mid", "senior", "lead"]}
                                value={formValue.experienceLevel}
                                onChangeValue={(val: string) =>
                                    handleChange("experienceLevel", val)
                                }
                            />

                            {/* Skills */}
                            <div>
                                <Label className="mb-3">Skills Required</Label>
                                <MultipleSelector
                                    defaultOptions={formattedSkills}
                                    placeholder="Select Skills"
                                    value={formValue.skills}
                                    onChange={(val: Option[]) =>
                                        handleChange("skills", val)
                                    }
                                />
                            </div>

                            {/* Categories */}
                            <div>
                                <Label className="mb-3">Job Categories</Label>
                                <MultipleSelector
                                    defaultOptions={formattedCategories}
                                    placeholder="Select Categories"
                                    value={formValue.categories}
                                    onChange={(val: Option[]) =>
                                        handleChange("categories", val)
                                    }
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="mb-3">Job Description</Label>
                            <EditorWrapper
                                value={formValue.description}
                                setValue={(val: string) =>
                                    handleChange("description", val)
                                }
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={postLoading}
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
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default JobPostForm;
