import ContainerWrapper from "@/components/common/containerWrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const Page = () => {
    return (
        <>
            <ContainerWrapper>
                <div className="mt-6 pt-16 pb-12">
                    <div className="flex flex-col gap-5">
                        <div className="mt-10">
                            <Button
                                className="w-[200px] h-[300px] border border-dashed cursor-pointer"
                                variant={"ghost"}
                                asChild
                            >
                                <Link href="/build-resume/3212321/edit">
                                    <Plus className="font-bold text-xl" />
                                </Link>
                            </Button>
                            <p className="font-medium mt-3">
                                Create New Resume
                            </p>
                        </div>

                        <h2 className="text-2xl font-semibold text-foreground py-5">
                            Recent Resume's
                        </h2>

                        <div>
                            <Button
                                className="w-[200px] h-[300px] border border-dashed cursor-pointer"
                                variant={"ghost"}
                                asChild
                            ></Button>
                            <p className="font-medium mt-3">Resume 1</p>
                        </div>
                    </div>
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
