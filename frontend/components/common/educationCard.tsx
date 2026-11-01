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
        <div className="relative flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <GraduationCapIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 pr-16">
                <p className="truncate text-sm font-semibold text-slate-900">{data?.institution}</p>
                <p className="mt-1 text-sm text-slate-600">{data?.degree}</p>
                <p className="mt-2 text-xs text-slate-400">{data?.startDate} – {data?.endDate}</p>
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
