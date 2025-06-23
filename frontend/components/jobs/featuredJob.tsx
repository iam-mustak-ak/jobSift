"use client";

import { fetcherClient } from "@/utils/fetcherClient";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ContainerWrapper from "../common/containerWrapper";
import SectionHeading from "../common/sectionHeading";
import { Button } from "../ui/button";
import FeaturedJobCard from "./featuredJobCard";

const FeaturedJob = () => {
    const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        try {
            const getData = async () => {
                const fetcer = await fetcherClient(
                    `/job/get-featured/?limit=2&page=${currentPage}`
                );
                if (fetcer.success) {
                    setFeaturedJobs((prevData) => [
                        ...prevData,
                        ...fetcer.data,
                    ]);
                    setTotalPage(fetcer.pagination.totalPages);
                }
            };
            getData();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    const handlePage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <div className="bg-primary/5">
            <ContainerWrapper>
                <div className="py-24">
                    <SectionHeading
                        title="Featured Jobs"
                        subHeading="Know your worth and find the job that qualify your life"
                    />

                    <div className="grid md:grid-cols-2 gap-5">
                        {featuredJobs &&
                            featuredJobs.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
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
                </div>
            </ContainerWrapper>
        </div>
    );
};

export default FeaturedJob;
