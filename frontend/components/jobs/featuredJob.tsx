/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetcherClient } from "@/utils/fetcherClient";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import ContainerWrapper from "../common/containerWrapper";
import SectionHeading from "../common/sectionHeading";
import { Button } from "../ui/button";
import FeaturedJobCard from "./featuredJobCard";

const FeaturedJob = () => {
    const [featuredJobs, setFeaturedJobs] = useState<Record<string, any>[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        let isMounted = true;

        const getData = async () => {
            try {
                const fetcer = await fetcherClient(
                    `/job/get-featured/?limit=2&page=${currentPage}`
                );
                if (isMounted && fetcer.success) {
                    setFeaturedJobs((prevData) =>
                        currentPage === 1
                            ? fetcer.data
                            : [...prevData, ...fetcer.data]
                    );
                    setTotalPage(fetcer.pagination.totalPages);
                }
            } catch (err) {
                console.log(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        getData();

        return () => {
            isMounted = false;
        };
    }, [currentPage]);

    useEffect(() => {
        setFeaturedJobs([]);
        setCurrentPage(1);
    }, []);

    const handlePage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <section className="border-y border-slate-200/70 bg-[#f7f8fc]">
            <ContainerWrapper>
                <div className="py-20 md:py-24">
                    <SectionHeading
                        title="Featured opportunities"
                        subHeading="A handpicked look at roles worth your next move."
                        tone="light"
                    />

                    <div className="grid md:grid-cols-2 gap-5">
                        {featuredJobs &&
                            featuredJobs?.map((item: Record<string, any>) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                    cardClassName="border-slate-200 bg-white text-slate-900 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
                                />
                            ))}
                    </div>
                    {currentPage !== totalPage && (
                        <div className="text-center mt-10">
                            <Button disabled={loading} onClick={handlePage}>
                                {" "}
                                {loading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Load More Jobs"
                                )}
                            </Button>
                        </div>
                    )}
                    <div className="mt-8 text-center">
                        <Link
                            href="/find-jobs/?page=1"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800"
                        >
                            Browse all jobs <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </ContainerWrapper>
        </section>
    );
};

export default FeaturedJob;
