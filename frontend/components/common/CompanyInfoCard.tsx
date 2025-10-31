import LinkendInSvg from "@/lib/LogoProvider/linkendInSvg";
import { Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

type companyType = {
    company: {
        _id: string;
        name: string;
        description: string;
        industry: string;
        foundedYear: number;
        location: string;
        socialLinks: [
            {
                platform: string;
                url: string;
                _id: string;
            }
        ];
        website: string;
    };
};

const CompanyInfoCard: React.FC<companyType> = ({ company }) => {
    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-medium ">Company Information</h2>
                <Separator className="my-3" />
                <CardTitle>{company.name}</CardTitle>
                {company?.description && (
                    <CardDescription className="whitespace-pre-line break-all">
                        {company.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col gap-2">
                    {company?.industry && (
                        <li className="text-sm text-muted-foreground font-bold">
                            Industry:{" "}
                            <span className="font-normal">
                                {company.industry}
                            </span>
                        </li>
                    )}
                    {company?.foundedYear && (
                        <li className="text-sm text-muted-foreground font-bold">
                            Founded Year:{" "}
                            <span className="font-normal">
                                {company.foundedYear}
                            </span>
                        </li>
                    )}
                    {company?.location && (
                        <li className="text-sm text-muted-foreground font-bold">
                            Location:{" "}
                            <span className="font-normal">
                                {company.location}
                            </span>
                        </li>
                    )}
                </ul>
                <Separator className="my-3" />

                <div>
                    <h2 className="font-medium mb-2">Contact info</h2>

                    <div className="flex items-center gap-2">
                        {company?.website && (
                            <Button variant={"outline"} asChild>
                                <Link
                                    href={company?.website || "#"}
                                    target="_blank"
                                >
                                    <Globe />
                                </Link>
                            </Button>
                        )}
                        {company?.socialLinks &&
                            Array.isArray(company?.socialLinks) &&
                            company.socialLinks?.map(
                                (links: {
                                    platform: string;
                                    url: string;
                                    _id: string;
                                }) => (
                                    <Button
                                        key={links._id}
                                        variant={"outline"}
                                        asChild
                                    >
                                        <Link
                                            href={links.url || "#"}
                                            target="_blank"
                                        >
                                            <LinkendInSvg />
                                        </Link>
                                    </Button>
                                )
                            )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyInfoCard;
