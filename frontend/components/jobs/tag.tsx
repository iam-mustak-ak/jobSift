import { formateCapitalized } from "@/utils/formateCapitalized";

type tagtype = "full-time" | "part-time" | "Remote" | "Onsite";

const types: Record<tagtype, string> = {
    "full-time": "bg-[#1967D2]/15 text-[#1967D2]",
    "part-time": "bg-[#87E64B]/15 text-[#87E64B]",
    Remote: "bg-[#F9AB00]/15 text-[#F9AB00]",
    Onsite: "bg-[#1967D2]/15 text-[#1967D2]",
};

const Tag = ({ type }: { type: tagtype }) => {
    return (
        <p
            className={`py-2 px-4  rounded-full inline text-sm ${
                types[type as tagtype]
            }`}
        >
            {formateCapitalized(type)}
        </p>
    );
};

export default Tag;
