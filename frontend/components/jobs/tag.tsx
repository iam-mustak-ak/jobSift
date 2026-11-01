import { formateCapitalized } from "@/utils/formateCapitalized";

const tagStyles: Record<string, string> = {
    "full-time": "bg-blue-50 text-blue-700 ring-blue-100",
    fulltime: "bg-blue-50 text-blue-700 ring-blue-100",
    "part-time": "bg-emerald-50 text-emerald-700 ring-emerald-100",
    parttime: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    contract: "bg-amber-50 text-amber-700 ring-amber-100",
    internship: "bg-sky-50 text-sky-700 ring-sky-100",
    remote: "bg-violet-50 text-violet-700 ring-violet-100",
    onsite: "bg-slate-100 text-slate-700 ring-slate-200",
    "on-site": "bg-slate-100 text-slate-700 ring-slate-200",
    hybrid: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
};

const Tag = ({ type }: { type: string }) => {
    const normalizedType = type.toLowerCase().trim();

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                tagStyles[normalizedType] ?? "bg-slate-100 text-slate-700 ring-slate-200"
            }`}
        >
            {formateCapitalized(type)}
        </span>
    );
};

export default Tag;
