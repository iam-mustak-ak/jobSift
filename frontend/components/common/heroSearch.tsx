import { jobSearchAction } from "@/actions/jobSearchAction";
import { fetcherSever } from "@/utils/fetcherSever";
import { formateSelectValues } from "@/utils/formateSelectValues";
import { BriefcaseBusiness, MapPin, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import CustomSelect from "./customSelect";
import IconInput from "./iconInput";

type searchFormProps = {
    showCategory?: boolean;
};

const HeroSearch = async ({ showCategory }: searchFormProps) => {
    const categoryData = await fetcherSever("/job-category/get-all-categories");
    const categories = categoryData?.data;
    const formattedCategries = formateSelectValues(categories);

    return (
        <form action={jobSearchAction}>
            <div className="flex items-stretch gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-xl shadow-violet-950/5 max-md:flex-col sm:px-5">
                <IconInput
                    Icon={SearchIcon}
                    type="search"
                    name="title"
                    placeholder="Job title, keywords, or company"
                    className="border-none bg-white py-5 text-slate-900 shadow-none placeholder:text-slate-400"
                />
                <div className="hidden h-auto w-px bg-slate-200 md:block" />
                <IconInput
                    Icon={MapPin}
                    type="text"
                    name="location"
                    placeholder="Location"
                    className="border-none bg-white py-5 text-slate-900 shadow-none placeholder:text-slate-400"
                />
                {showCategory && (
                    <>
                        <div className="hidden h-auto w-px bg-slate-200 md:block" />
                        <IconInput
                            Icon={BriefcaseBusiness}
                            isSelect={true}
                            className="border-none bg-white py-5 text-slate-900 shadow-none"
                            selectValues={formattedCategries}
                        />
                    </>
                )}
                <div className="hidden h-auto w-px bg-slate-200 md:block" />

                <Button className="py-5">Find Jobs</Button>
            </div>
            <div className="mx-auto mt-4 flex max-w-[600px] items-center justify-center gap-2 max-md:flex-col md:gap-3">
                <CustomSelect
                    name="jobType"
                    placeholder="Job Type"
                    options={["Fulltime", "Contract"]}
                    className="border-slate-200 bg-white text-slate-600"
                />

                <CustomSelect
                    name="experienceLevel"
                    placeholder="Experience Level"
                    options={["Entry", "Lead", "Mid", "Senior"]}
                    className="border-slate-200 bg-white text-slate-600"
                />
            </div>
        </form>
    );
};

export default HeroSearch;
