import CustomInput from "@/components/common/customInput";
import CustomSelect from "@/components/common/customSelect";
import EditorWrapper from "@/components/common/EditorWrapper";
import ProfileCompleteIndicator from "@/components/common/profileCompleteIndicator";
import { AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ComboBox from "@/components/ui/comboBox";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Edit } from "lucide-react";
const Page = () => {
    return (
        <div className="pt-5">
            <h2 className="text-xl font-semibold mb-5">Edit Profile</h2>

            <div className="grid grid-cols-3 items-start gap-5 w-full">
                <div className="col-span-2 grid gap-5">
                    <Card>
                        <CardContent>
                            <div className="flex items-center gap-5">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src="./logo-main.svg"
                                        alt="somthing"
                                    />
                                    <AvatarFallback>LG</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-4 justify-start w-fit">
                                    <Button className="w-fit" variant="outline">
                                        Upload New Photo
                                    </Button>
                                    <CardDescription>
                                        {" "}
                                        Upload New photo from here, Support any
                                        type of images
                                    </CardDescription>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Personal Information</CardTitle>
                                <Button variant="outline">
                                    <Edit />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CustomInput
                                type="text"
                                id="bio"
                                label="Tagline"
                                name="bio"
                                placeholder="Full-stack Dev"
                                className="w-1/2 mb-5"
                            />
                            <div className="grid grid-cols-2 gap-5">
                                <CustomInput
                                    type="text"
                                    id="edit-name"
                                    label="Name"
                                    placeholder="john doe"
                                    name="name"
                                />
                                <CustomInput
                                    type="phone"
                                    id="edit-phone"
                                    label="Phone"
                                    placeholder="0173661651"
                                    name="phone"
                                />
                                <CustomInput
                                    type="text"
                                    id="edit-location"
                                    label="Location"
                                    placeholder="Sylhet"
                                    name="location"
                                />

                                <CustomInput
                                    type="text"
                                    id="edit-experience"
                                    label="Experience"
                                    placeholder="5 years +"
                                    name="experience"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-4">
                                <Button variant="outline">Cancel</Button>
                                <Button>Save</Button>
                            </div>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Job Preferences</CardTitle>
                                <Button variant="outline">
                                    <Edit />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-5 ">
                                <CustomSelect
                                    label="Job type"
                                    name="jobType"
                                    placeholder="Full-time; Part-time"
                                    options={[
                                        "full-time",
                                        "part-time",
                                        "contract",
                                        "internship",
                                    ]}
                                />

                                <ComboBox />
                                <CustomInput
                                    type="number"
                                    id="edit-salary"
                                    label="Expected Salary"
                                    placeholder="1000"
                                    name="expectedSalary"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-4">
                                <Button variant="outline">Cancel</Button>
                                <Button>Save</Button>
                            </div>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditorWrapper />
                        </CardContent>
                        <CardFooter>
                            <div className="flex gap-4">
                                <Button variant="outline">Cancel</Button>
                                <Button>Save</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div>
                    <ProfileCompleteIndicator />
                </div>
            </div>
        </div>
    );
};

export default Page;
