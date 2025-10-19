import { Mail, MapPin, Pen, Phone } from "lucide-react";
import Link from "next/link";
import IconInfo from "../common/iconInfo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

const BasicInfo = ({ data }: { data: Record<string, any> }) => {
    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle>Basic Info</CardTitle>
                    <Link
                        href={`${data?._id}/edit-profile`}
                        className="rounded-full h-12 w-12"
                    >
                        <Pen />
                    </Link>
                </div>
                <div className="flex items-center gap-5">
                    <Avatar className="h-32 w-32 rounded-lg relative ">
                        <AvatarImage
                            src={data?.profilePicture}
                            alt={data?.name}
                        />
                        <AvatarFallback className="rounded-lg">
                            {data?.name?.slice(0, 2)}
                        </AvatarFallback>
                        <Badge
                            className={`rounded-full h-5 w-5 ${
                                data?.isOnline ? "bg-green-500" : "bg-gray-500"
                            } absolute top-0 right-0`}
                            title={data?.isOnline ? "online" : "Offline"}
                        />
                    </Avatar>
                    <div className="grid gap-2">
                        <CardTitle>{data?.name}</CardTitle>
                        <CardDescription>{data?.email}</CardDescription>
                        <Badge>
                            {data?.isAvailableForHire
                                ? "Available for work"
                                : "Not Available for work"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <Separator />
                <div className="mt-4 grid gap-2">
                    <IconInfo
                        icon={<Mail className="text-muted-foreground w-4 " />}
                        label={data?.email}
                    />
                    <IconInfo
                        icon={<Phone className="text-muted-foreground w-4 " />}
                        label={data?.phone ? data.phone : "Add a phone number"}
                    />
                    <IconInfo
                        icon={<MapPin className="text-muted-foreground w-4 " />}
                        label={
                            data?.location ? data.location : "Add your address"
                        }
                    />
                </div>
                <Separator className="my-5" />

                {data?.skills && data?.skills.length > 0 && (
                    <div>
                        <CardTitle className="mb-5">Skills</CardTitle>
                        <ul className="list-disc pl-5">
                            {data?.skills.map((v: string, i: number) => (
                                <li key={i}>{v}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BasicInfo;
