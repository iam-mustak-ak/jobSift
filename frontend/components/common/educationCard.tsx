import { GraduationCapIcon, Pencil, Trash } from "lucide-react";

type Education = {
    data: {
        degree: string;
        institution: string;
        startDate: string;
        endDate: string;
    };
    onRemove?: () => void;
    onEdit?: () => void;
};

const EducationCard = ({ data, onRemove, onEdit }: Education) => {
    return (
        <div className="flex items-start gap-3 rounded-lg border p-3 shadow-sm relative">
            <GraduationCapIcon />
            <div>
                <p className="text-md font-medium ">{data?.institution}</p>
                <p className="text-sm">{data?.degree}</p>
                <p className="text-sm">Started At: {data?.startDate}</p>
                <p className="text-sm">End: {data?.endDate}</p>
            </div>
            <button
                onClick={onEdit}
                className="text-blue-500 hover:text-blue-700 absolute right-14 top-5 cursor-pointer"
            >
                <Pencil />
            </button>
            <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 absolute right-5 top-5 cursor-pointer"
            >
                <Trash />
            </button>
        </div>
    );
};

export default EducationCard;
