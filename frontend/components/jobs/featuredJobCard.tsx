import { dateFormate } from "@/utils/dateFormate";
import { formateCapitalized } from "@/utils/formateCapitalized";
import { salaryFormat } from "@/utils/salaryFormat";
import {
    Bookmark,
    BriefcaseBusiness,
    CircleDollarSign,
    Clock3,
    MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import Tag from "./tag";

const FeaturedJobCard = ({
    featuredJobs,
}: {
    featuredJobs: Record<string, any>;
}) => {
    const salary = salaryFormat(featuredJobs?.salaryRange);

    return (
        <Card>
            <CardContent>
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 aspect-square rounded-md">
                        <Link href="/employer/1243">
                            <Image
                                src="/item-brand.png"
                                width={500}
                                height={500}
                                alt="brand logo"
                            />
                        </Link>
                    </div>
                    <div className="w-full flex flex-col gap-0">
                        <div className="w-full">
                            <Link href={`/job/${featuredJobs._id}`}>
                                <CardTitle className="float-left">
                                    {featuredJobs?.title}
                                </CardTitle>
                            </Link>
                            <Button variant="outline" className="float-right">
                                <Bookmark />
                            </Button>
                        </div>
                        <ul className="flex items-center gap-5 max-md:flex-wrap">
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <BriefcaseBusiness />{" "}
                                {formateCapitalized(
                                    featuredJobs?.experienceLevel
                                )}
                            </li>
                            {featuredJobs?.location && (
                                <li className="flex gap-2 font-normal text-muted-foreground">
                                    <MapPin />{" "}
                                    {formateCapitalized(featuredJobs.location)}
                                </li>
                            )}

                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <Clock3 /> {dateFormate(featuredJobs?.openings)}
                            </li>
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <CircleDollarSign /> {salary.min} - {salary.max}
                            </li>
                        </ul>

                        <div className="flex items-center gap-3 mt-5">
                            <Tag type={featuredJobs?.jobType} />
                            <Tag type={featuredJobs?.employmentMode} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeaturedJobCard;
