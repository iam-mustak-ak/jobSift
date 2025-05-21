import { BriefcaseBusiness, MapPin, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import CustomSelect from "./customSelect";
import IconInput from "./iconInput";

type searchFormProps = {
    showCategory?: boolean;
};

const HeroSearch = ({ showCategory }: searchFormProps) => {
    return (
        <form action="">
            <div className="bg-white shadow-md py-5 px-4 rounded-md flex gap-2 items-stretch border border-border max-md:flex-col">
                <IconInput
                    Icon={SearchIcon}
                    type="search"
                    name="keyword"
                    placeholder="Job title, keywords, or company"
                    className="border-none shadow-none py-5"
                />
                <div className="h-auto w-px bg-border" />
                <IconInput
                    Icon={MapPin}
                    type="text"
                    name="city"
                    placeholder="City"
                    className="border-none shadow-none py-5 "
                />
                {showCategory && (
                    <>
                        <div className="h-auto w-px bg-border" />
                        <IconInput
                            Icon={BriefcaseBusiness}
                            isSelect={true}
                            className="border-none shadow-none py-5 "
                        />
                    </>
                )}
                <div className="h-auto w-px bg-border" />

                <Button className="py-5">Find Jobs</Button>
            </div>
            <div className="flex items-center gap-2 md:gap-5 mt-5 justify-center max-w-[600px] mx-auto max-md:flex-col">
                <CustomSelect name="jobtype" placeholder="Job Type" />
                <CustomSelect name="publishedon" placeholder="All" />
                <CustomSelect
                    name="experiment"
                    placeholder="Experiment Level"
                />
                <CustomSelect name="selary" placeholder="Selary Estimate" />
            </div>
        </form>
    );
};

export default HeroSearch;
