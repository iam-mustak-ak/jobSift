import CustomInput from "@/components/common/customInput";
import EditorWrapper from "@/components/common/EditorWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Plus } from "lucide-react";

const PersonalInfoForm = () => {
    return (
        <div>
            <div className="flex items-start gap-8">
                <div className="flex flex-col gap-3">
                    <Label htmlFor="Image">Photo</Label>
                    <Label
                        htmlFor="picture"
                        className="w-32 h-32 aspect-square border rounded-md flex items-center justify-center hover:border-primary cursor-pointer"
                    >
                        <Camera />
                        <Input id="picture" type="file" className="hidden" />
                    </Label>
                </div>
                <div className="w-full flex flex-col gap-6">
                    <CustomInput
                        label="Name"
                        name="name"
                        placeholder="Mustak"
                        id="name"
                        type="text"
                    />
                    <CustomInput
                        label="Tagline"
                        name="tagline"
                        placeholder="Developer"
                        id="tagline"
                        type="text"
                    />
                </div>
            </div>
            <h5 className="text-lg font-semibold my-3">Social Info</h5>
            <div className="flex items-center gap-3">
                <Button>
                    <Plus />
                    Email
                </Button>
                <Button>
                    <Plus />
                    Github
                </Button>
                <Button>
                    <Plus />
                    Linkedin
                </Button>
            </div>
            <h5 className="text-lg font-semibold my-3">About</h5>
            <div>
                <EditorWrapper />
            </div>
        </div>
    );
};

export default PersonalInfoForm;
