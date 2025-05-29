"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomInput from "../common/customInput";
import CustomSelect from "../common/customSelect";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

const SocialInfo = () => {
    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader>
                <CardTitle>Social Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-start gap-4 flex-wrap">
                    <Link href="/" className="w-12 h-12">
                        <Image
                            src="https://svgl.app/library/facebook.svg"
                            width={100}
                            height={100}
                            alt="logo"
                        />
                    </Link>
                </div>

                <div className="mt-4 flex items-center gap-1">
                    <CustomSelect
                        label="Platform"
                        options={["Facebook", "Instagram"]}
                    />
                    <span></span>
                    <CustomInput label="Url" name="url" type="text" id="url" />
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline">
                    <Plus />
                    Add
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SocialInfo;
