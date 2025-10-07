import ContainerWrapper from "@/components/common/containerWrapper";
import JobDescription from "@/components/common/jobDescription";
import BookMarkButton from "@/components/ui/bookMarkButton";
import { Button } from "@/components/ui/button";
import { dateFormate } from "@/utils/dateFormate";
import { fetcherSever } from "@/utils/fetcherSever";
import { salaryFormat } from "@/utils/salaryFormat";
import {
    BriefcaseBusiness,
    CircleDollarSign,
    Clock3,
    Copy,
    MapPin,
    SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params;

    const jobPromise = await fetcherSever(`/job/get-job/${jobId}`);
    const job = jobPromise.data;
    const salary = salaryFormat(job?.salaryRange);

    return (
        <>
            <div className="mt-16 pt-16 pb-12 bg-gradient-to-br from-transparent to-primary/20">
                <ContainerWrapper>
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-[150px] h-[150px] rounded-md overflow-hidden">
                            <Image
                                src="/logo-main.svg"
                                alt="job"
                                width={500}
                                height={500}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h2 className="text-2xl font-semibold text-accent-foreground capitalize">
                            {job?.title}
                        </h2>
                        <ul className="flex items-center gap-5 max-md:flex-wrap mt-4">
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <BriefcaseBusiness /> {job?.experienceLevel}
                            </li>
                            {job?.location && (
                                <li className="flex gap-2 font-normal text-muted-foreground">
                                    <MapPin /> {job.location}
                                </li>
                            )}

                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <Clock3 /> {dateFormate(job?.openings)}
                            </li>
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <CircleDollarSign /> {salary?.min} -{" "}
                                {salary?.max}
                            </li>
                        </ul>

                        <div className="mt-6 flex items-center gap-3">
                            <Button asChild>
                                <Link href={`/apply/${jobId}`}>
                                    Apply For Job
                                    <SquareArrowOutUpRight />
                                </Link>
                            </Button>
                            <BookMarkButton jobId={jobId} />
                            <Button>
                                <Copy />
                            </Button>
                        </div>
                    </div>
                </ContainerWrapper>
            </div>
            <ContainerWrapper>
                <JobDescription html={job?.description || ""} />
            </ContainerWrapper>
        </>
    );
};

export default Page;
