import ContainerWrapper from "@/components/common/containerWrapper";
import ApplyJobForm from "@/components/jobs/applyJobForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const Page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params;

    // const jobPromise = await fetcherSever(`/job/get-job/${jobId}`);
    // const job = jobPromise.data;

    return (
        <div className="mt-16 pt-16 pb-12 ">
            <ContainerWrapper>
                <div className="grid grid-cols-1  md:grid-cols-3 gap-5">
                    <div className="border col-span-2 shadow-sm p-6 rounded-lg">
                        <h1 className="text-2xl font-bold mb-6">
                            Apply for this job
                        </h1>

                        <ApplyJobForm jobId={jobId} />
                    </div>

                    <div className="border shadow-sm p-6 rounded-lg overflow-y-auto max-h-[650px]">
                        <h1 className="text-xl font-bold mb-6">
                            Recent Applicant
                        </h1>

                        <div className="flex flex-col gap-4">
                            <Card className="py-2">
                                <CardContent className="px-2">
                                    <div className="flex items-center gap-5">
                                        <Avatar className="h-20 w-20 rounded-full relative ">
                                            <AvatarImage
                                                // src={data?.profilePicture}
                                                // alt={data?.name}
                                                src={""}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                {/* {data?.name?.slice(0, 2)} */}
                                                ma
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h6 className="font-medium">
                                                Mustak Ahmed kHan
                                            </h6>
                                            <p className="text-sm text-muted-foreground">
                                                Applied 2 days ago
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </ContainerWrapper>
        </div>
    );
};

export default Page;
