import { formateCapitalized } from "@/utils/formateCapitalized";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "../ui/card";

type jobCardProps = {
    href: string;
    title: string;
    subTitle?: string;
};

const JobCategoryCard = (props: jobCardProps) => {
    const { href, title } = props;
    return (
        <Link href={href}>
            <Card className="hover:border-primary">
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="p-4 grid items-center justify-center bg-primary/20 rounded-md">
                            <CircleDollarSign className="text-primary" />
                        </div>
                        <div className="grid gap-3">
                            <CardTitle>{formateCapitalized(title)}</CardTitle>
                            {/* <CardDescription>
                                ({subTitle} open positions)
                            </CardDescription> */}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default JobCategoryCard;
