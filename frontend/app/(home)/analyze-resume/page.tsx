import AtsChart from "@/components/common/atsChart";
import ContainerWrapper from "@/components/common/containerWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpIcon } from "lucide-react";

const Page = () => {
    return (
        <ContainerWrapper>
            <div className="mt-6 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <Label
                            htmlFor="pdf-file"
                            className="w-full h-[400px] bg-gray-100 rounded-2xl p-5 cursor-pointer flex flex-col items-center justify-center group border border-gray-200"
                        >
                            <Input
                                type="file"
                                className="h-full w-full"
                                hidden
                                name="pdf-file"
                                id="pdf-file"
                            />
                            <FileUpIcon
                                width={150}
                                height={150}
                                className="opacity-15 group-hover:opacity-25"
                            />
                            <p>Click to upload resume</p>
                        </Label>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="bg-amber-50 rounded-2xl border border-gray-200 p-5">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                                Ats Score
                            </h2>
                            <AtsChart />
                        </div>
                        <div className="bg-red-200 rounded-2xl border border-gray-200 p-5">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                                Issues
                            </h2>

                            <div className="flex flex-col gap-1">
                                <div className="rounded-lg bg-red-50 border border-gray-200 p-3 w-full ">
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Provident, voluptates!
                                    </p>
                                </div>
                                <div className="rounded-lg bg-red-50 border border-gray-200 p-3 w-full ">
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Provident, voluptates!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-200 rounded-2xl border border-gray-200 p-5">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                                Need to improve
                            </h2>

                            <div className="flex flex-col gap-1">
                                <div className="rounded-lg bg-blue-50 border border-gray-200 p-3 w-full ">
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Provident, voluptates!
                                    </p>
                                </div>
                                <div className="rounded-lg bg-blue-50 border border-gray-200 p-3 w-full ">
                                    <p>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Provident, voluptates!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default Page;
