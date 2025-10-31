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
            <div className="bg-white shadow-md py-5 px-4 rounded-md flex gap-2 items-stretch border border-border max-md:flex-col">
                <IconInput
                    Icon={SearchIcon}
                    type="search"
                    name="title"
                    placeholder="Job title, keywords, or company"
                    className="border-none shadow-none py-5"
                />
                <div className="h-auto w-px bg-border" />
                <IconInput
                    Icon={MapPin}
                    type="text"
                    name="location"
                    placeholder="location"
                    className="border-none shadow-none py-5 "
                />
                {showCategory && (
                    <>
                        <div className="h-auto w-px bg-border" />
                        <IconInput
                            Icon={BriefcaseBusiness}
                            isSelect={true}
                            className="border-none shadow-none py-5 "
                            selectValues={formattedCategries}
                        />
                    </>
                )}
                <div className="h-auto w-px bg-border" />

                <Button className="py-5">Find Jobs</Button>
            </div>
            <div className="flex items-center gap-2 md:gap-5 mt-5 justify-center max-w-[600px] mx-auto max-md:flex-col">
                <CustomSelect
                    name="jobType"
                    placeholder="Job Type"
                    options={["Fulltime", "Contract"]}
                />

                <CustomSelect
                    name="experienceLevel"
                    placeholder="Experience Level"
                    options={["Entry", "Lead", "Mid", "Senior"]}
                />
            </div>
        </form>
    );
};

export default HeroSearch;
