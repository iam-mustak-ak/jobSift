import ApplyJobButton from "@/components/common/applyJobButton";
import ContainerWrapper from "@/components/common/containerWrapper";
import JobDescription from "@/components/common/jobDescription";
import BookMarkButton from "@/components/ui/bookMarkButton";
import { dateFormate } from "@/utils/dateFormate";
import { fetcherSever } from "@/utils/fetcherSever";
import { salaryFormat } from "@/utils/salaryFormat";
import {
    BriefcaseBusiness,
    CircleDollarSign,
    Clock3,
    MapPin,
} from "lucide-react";

const Page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params;

    const jobPromise = await fetcherSever(`/job/get-job/${jobId}`);

    const job = jobPromise.data;

    const compnay = await fetcherSever(`/company/get-company/${job.company}`);

    const salary = salaryFormat(job?.salaryRange);

    return (
        <>
            <div className="mt-16 pt-16 pb-12 bg-gradient-to-br from-transparent to-primary/20">
                <ContainerWrapper>
                    <div className="flex flex-col items-center justify-center">
                        {/* <div className="w-[150px] h-[150px] rounded-md overflow-hidden">
                            <Image
                                src="/logo-main.svg"
                                alt="job"
                                width={500}
                                height={500}
                                className="w-full h-full object-contain"
                            />
                        </div> */}
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
                                <Clock3 />{" "}
                                {job?.isActive ? (
                                    job?.deadline &&
                                    new Date(job.deadline) <= new Date() ? (
                                        dateFormate(job?.deadline)
                                    ) : (
                                        dateFormate(job?.openings)
                                    )
                                ) : (
                                    <span className="text-destructive">
                                        Expired
                                    </span>
                                )}
                            </li>
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <CircleDollarSign /> {salary?.min} -{" "}
                                {salary?.max}
                            </li>
                        </ul>

                        <div className="mt-6 flex items-center gap-3">
                            {/* <Button asChild>
                                <Link
                                    href={
                                        job?.url ? job.url : `/apply/${jobId}`
                                    }
                                    target={job?.url ? "_blank" : "_self"}
                                >
                                    Apply For Job
                                    <SquareArrowOutUpRight />
                                </Link>
                            </Button> */}

                            <ApplyJobButton job={job} jobId={jobId} />
                            <BookMarkButton jobId={jobId} />
                        </div>
                    </div>
                </ContainerWrapper>
            </div>
            <ContainerWrapper>
                <JobDescription
                    html={job?.description || ""}
                    company={compnay.data}
                />
            </ContainerWrapper>
        </>
    );
};

export default Page;
