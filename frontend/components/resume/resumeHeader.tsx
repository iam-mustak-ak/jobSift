import { CaseSensitive, LayoutPanelLeft, Type } from "lucide-react";
import CustomSelect from "../common/customSelect";
import { Input } from "../ui/input";

const ResumeHeader: React.FC = () => {
    return (
        <div className="backdrop-blur-2xl bg-neutral-50 shadow-md py-5 px-10">
            <div className="flex items-center justify-between">
                <div className="max-w-[20rem]">
                    <Input
                        defaultValue="Name of the resume"
                        className={`outline-0 border-0 shadow-none focus-visible:outline-0 focus-visible:border-0 focus-visible:ring-0 text-primary font-bold text-4xl w-fit`}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <CustomSelect
                        name="templates"
                        placeholder="select a template"
                        options={["temp1", "temp-2"]}
                        icon={<LayoutPanelLeft />}
                        title="Templates"
                    />
                    <CustomSelect
                        name="font"
                        placeholder="Font"
                        options={["Arial", "Times new Roman"]}
                        icon={<CaseSensitive />}
                        title="Font Family"
                    />
                    <CustomSelect
                        name="font-size"
                        placeholder="Font Size"
                        options={["XS", "M"]}
                        icon={<Type />}
                        title="Font Size"
                    />
                </div>
            </div>
        </div>
    );
};

export default ResumeHeader;
