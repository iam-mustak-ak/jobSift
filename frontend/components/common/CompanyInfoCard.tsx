import LinkendInSvg from "@/lib/LogoProvider/linkendInSvg";
import { Building2, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CompanyInfo = {
    _id?: string;
    name?: string;
    description?: string;
    industry?: string;
    foundedYear?: number;
    location?: string;
    socialLinks?: Array<{
        platform: string;
        url: string;
        _id: string;
    }>;
    website?: string;
};

const CompanyInfoCard = ({ company }: { company: CompanyInfo }) => {
    const website =
        typeof company.website === "string" && company.website.trim()
            ? company.website.trim()
            : null;
    const socialLinks = Array.isArray(company.socialLinks)
        ? company.socialLinks.filter(
              (social) =>
                  typeof social?.url === "string" && social.url.trim().length > 0
          )
        : [];
    const details = [
        company.industry ? { label: "Industry", value: company.industry } : null,
        company.foundedYear
            ? { label: "Founded", value: String(company.foundedYear) }
            : null,
        company.location ? { label: "Location", value: company.location } : null,
    ].filter((detail): detail is NonNullable<typeof detail> => detail !== null);
    const hasCompanyInfo = Boolean(
        company.name ||
            company.description ||
            details.length ||
            website ||
            socialLinks.length
    );

    if (!hasCompanyInfo) return null;

    return (
        <Card className="rounded-3xl border-slate-200 bg-white py-0 shadow-sm">
            <CardHeader className="px-6 pb-4 pt-6">
                <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                        <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            About the company
                        </p>
                        {company.name && (
                            <CardTitle className="mt-1 text-lg font-semibold text-slate-950">
                                {company.name}
                            </CardTitle>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                {company.description && (
                    <p className="line-clamp-5 text-sm leading-6 text-slate-600">
                        {company.description}
                    </p>
                )}

                {details.length > 0 && (
                    <dl className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                        {details.map((detail) => (
                            <div key={detail.label} className="flex gap-3">
                                {detail.label === "Location" && (
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                                )}
                                <div className="min-w-0">
                                    <dt className="text-xs font-medium text-slate-500">
                                        {detail.label}
                                    </dt>
                                    <dd className="mt-0.5 break-words text-sm font-medium text-slate-800">
                                        {detail.value}
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                )}

                {(website || socialLinks.length > 0) && (
                    <div className="mt-5 border-t border-slate-100 pt-5">
                        <p className="mb-3 text-xs font-medium text-slate-500">
                            Connect with the company
                        </p>
                        <div className="flex items-center gap-2">
                            {website && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    asChild
                                    aria-label="Visit company website"
                                    className="rounded-xl border-slate-200 bg-white text-slate-600 shadow-none hover:bg-violet-50 hover:text-violet-800"
                                >
                                    <Link
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Globe className="h-4 w-4" />
                                    </Link>
                                </Button>
                            )}
                            {socialLinks.map((social, index) => (
                                <Button
                                    key={social._id || `${social.platform}-${index}`}
                                    variant="outline"
                                    size="icon"
                                    asChild
                                    aria-label={`Visit company on ${social.platform}`}
                                    className="rounded-xl border-slate-200 bg-white text-slate-600 shadow-none hover:bg-violet-50 hover:text-violet-800"
                                >
                                    <Link
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <LinkendInSvg />
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CompanyInfoCard;
