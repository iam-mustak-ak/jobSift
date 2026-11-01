import { formateCapitalized } from "@/utils/formateCapitalized";
import {
    ArrowUpRight,
    BarChart3,
    BriefcaseBusiness,
    Code2,
    Cpu,
    HeartPulse,
    Megaphone,
    Palette,
    Scale,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "../ui/card";

type jobCardProps = {
    href: string;
    title: string;
    subTitle?: string;
};

const categoryIcon = (title: string): LucideIcon => {
    const name = title.toLowerCase();
    if (
        name.includes("engineer") ||
        name.includes("software") ||
        name.includes("developer")
    )
        return Code2;
    if (
        name.includes("data") ||
        name.includes("finance") ||
        name.includes("sales")
    )
        return BarChart3;
    if (/\bai\b/.test(name) || name.includes("technology") || name.includes("tech"))
        return Cpu;
    if (name.includes("design") || name.includes("creative")) return Palette;
    if (name.includes("legal")) return Scale;
    if (name.includes("health")) return HeartPulse;
    if (name.includes("marketing") || name.includes("communication"))
        return Megaphone;
    return BriefcaseBusiness;
};

const JobCategoryCard = (props: jobCardProps) => {
    const { href, title } = props;
    const Icon = categoryIcon(title);
    return (
        <Link
            href={href}
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
            <Card className="h-full flex-row items-center justify-between rounded-2xl border-slate-200 bg-white px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-950/5">
                <CardContent className="flex min-w-0 items-center gap-4 px-0">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 transition-colors group-hover:bg-violet-100">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="grid min-w-0 gap-1.5">
                        <CardTitle className="truncate text-base font-semibold text-slate-900">
                            {formateCapitalized(title)}
                        </CardTitle>
                        <span className="text-sm text-slate-500">Explore open roles</span>
                    </div>
                </CardContent>
                <ArrowUpRight
                    className="ml-3 h-4 w-4 shrink-0 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-700"
                    aria-hidden="true"
                />
            </Card>
        </Link>
    );
};

export default JobCategoryCard;
