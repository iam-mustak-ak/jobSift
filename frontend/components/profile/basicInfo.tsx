import {
    BriefcaseBusiness,
    Mail,
    MapPin,
    Pen,
    Phone,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import IconInfo from "../common/iconInfo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

const BasicInfo = ({ data }: { data: Record<string, any> }) => {
    return (
        <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
            <div className="h-24 bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-500 sm:h-28" />
            <CardHeader className="relative -mt-12 px-5 pb-4 sm:-mt-14 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex min-w-0 items-end gap-4">
                        <Avatar className="relative h-24 w-24 shrink-0 rounded-2xl border-4 border-white bg-white shadow-md sm:h-28 sm:w-28">
                            <AvatarImage
                                src={data?.profilePicture}
                                alt={data?.name}
                            />
                            <AvatarFallback className="rounded-xl bg-violet-100 text-2xl font-semibold text-violet-700">
                                {data?.name?.slice(0, 2)?.toUpperCase() || "JS"}
                            </AvatarFallback>
                            <Badge
                                className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white p-0 ${
                                    data?.isOnline
                                        ? "bg-emerald-500"
                                        : "bg-slate-300"
                                }`}
                                title={data?.isOnline ? "online" : "Offline"}
                            />
                        </Avatar>
                        <div className="min-w-0 pb-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <Badge className="rounded-full bg-violet-50 text-violet-700 hover:bg-violet-50">
                                    {data?.role === "recruiter"
                                        ? "Recruiter"
                                        : "Job seeker"}
                                </Badge>
                                {data?.isAvailableForHire && (
                                    <Badge className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                                        Open to opportunities
                                    </Badge>
                                )}
                            </div>
                            <h2 className="truncate text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                                {data?.name || "Your name"}
                            </h2>
                            <p className="mt-1 truncate text-sm text-slate-500">
                                {data?.email}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/profile/${data?._id}/edit-profile`}
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                        <Pen className="h-4 w-4" />
                        Edit profile
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="px-5 pb-6 sm:px-7">
                <Separator className="mb-5" />
                <div className="grid gap-3 sm:grid-cols-2">
                    <IconInfo
                        icon={<Mail className="h-4 w-4 text-violet-600" />}
                        label={data?.email}
                    />
                    <IconInfo
                        icon={<Phone className="h-4 w-4 text-violet-600" />}
                        label={data?.phone || "Add a phone number"}
                    />
                    <IconInfo
                        icon={<MapPin className="h-4 w-4 text-violet-600" />}
                        label={data?.location || "Add your location"}
                    />
                    <IconInfo
                        icon={<BriefcaseBusiness className="h-4 w-4 text-violet-600" />}
                        label={data?.experience || "Add your experience"}
                    />
                </div>

                {data?.skills && data?.skills.length > 0 && (
                    <div className="mt-5 border-t border-slate-100 pt-5">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <Sparkles className="h-4 w-4 text-violet-600" />
                            Skills
                        </h3>
                        <ul className="flex flex-wrap gap-2">
                            {data.skills.map((v: string, i: number) => (
                                <li
                                    key={`${v}-${i}`}
                                    className="rounded-full border border-violet-100 bg-violet-50/70 px-3 py-1.5 text-xs font-medium text-violet-800"
                                >
                                    {v}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BasicInfo;
