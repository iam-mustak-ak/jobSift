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

const FeaturedJobCard = () => {
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
                            <Link href="/job/123">
                                <CardTitle className="float-left">
                                    Software Engineer (Android), Libraries
                                </CardTitle>
                            </Link>
                            <Button variant="outline" className="float-right">
                                <Bookmark />
                            </Button>
                        </div>
                        <ul className="flex items-center gap-5">
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <BriefcaseBusiness /> Segment
                            </li>
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <MapPin /> London, UK
                            </li>
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <Clock3 /> 11 hours ago
                            </li>
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <CircleDollarSign /> $35k - $45k
                            </li>
                        </ul>

                        <div className="flex items-center gap-3 mt-5">
                            <Tag type="Full Time" />
                            <Tag type="Private" />
                            <Tag type="Urgent" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeaturedJobCard;
