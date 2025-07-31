import { formatData } from "@/utils/formateData";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ComboBox from "../ui/comboBox";
import { Label } from "../ui/label";
import MultipleSelector, { Option } from "../ui/multiSelect";
import CustomInput from "./customInput";
import CustomSelect from "./customSelect";

const JobPostForm: React.FC<{
    categories: Record<string, any>[];
    skills: Record<string, any>[];
    company: Record<string, any>[];
}> = ({ categories, skills, company }) => {
    const formattedCategories = formatData(categories);
    const formattedSkills = formatData(skills);
    const formattedCompnay = formatData(company);

    console.log(formattedCompnay);

    return (
        <div className="max-w-5xl mx-auto py-4 mt-10">
            <Card>
                <CardContent>
                    <form action="" className="grid gap-5">
                        <CustomInput
                            id="title"
                            label="Title"
                            type="text"
                            name="title"
                            placeholder="Job Title"
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            <CustomSelect
                                label="Job Type"
                                options={["full-time"]}
                                defaultValue="full-time"
                                name="jobType"
                            />
                            <CustomSelect
                                label="Employment Type"
                                options={["Remote", "Onsite"]}
                                defaultValue="Remote"
                                name="employmentMode"
                            />

                            <ComboBox
                                name="location"
                                placeholder="Search Location"
                                title="Location"
                                values={[
                                    {
                                        value: "Sylhet",
                                        label: "sylhet",
                                    },
                                ]}
                            />
                            <ComboBox
                                name="company"
                                placeholder="Search Companies"
                                title="Company"
                                values={formattedCompnay.map(
                                    (item: Option) => ({
                                        value: String(item.value ?? ""),
                                        label: String(item.label ?? ""),
                                    })
                                )}
                            />
                            <div className="w-full">
                                <Label className="mb-3">Salary</Label>
                                <div className="flex items-center justify-between w-full gap-4">
                                    <CustomInput
                                        id="min"
                                        placeholder="Mininum Salary"
                                        type="text"
                                    />
                                    <CustomInput
                                        id="max"
                                        placeholder="Maximum Salary"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <CustomSelect
                                label="Experience Level"
                                options={["Lead", "Junior", "Senior"]}
                                defaultValue="Lead"
                                name="experienceLevel"
                            />

                            <div>
                                <Label className="mb-3">Skill Required</Label>

                                <MultipleSelector
                                    defaultOptions={formattedSkills}
                                    placeholder="Selecet Skills"
                                />
                            </div>
                            <div>
                                <Label className="mb-3">Job Category</Label>
                                <MultipleSelector
                                    defaultOptions={formattedCategories}
                                    placeholder="Selecet Categories"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="mb-3">Job Description</Label>

                            {/* <EditorWrapper /> */}
                        </div>

                        <div className="flex items-center gap-3 ">
                            <Button variant="outline">Save Draft</Button>
                            <Button>Save</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default JobPostForm;
