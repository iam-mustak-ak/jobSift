import ContainerWrapper from "@/components/common/containerWrapper";
import CustomSelect from "@/components/common/customSelect";
import SectionBanner from "@/components/common/sectionBanner";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const Page = () => {
    return (
        <>
            <SectionBanner />
            <ContainerWrapper>
                <div className="pt-12 pb-12">
                    <div className="flex items-center justify-between mb-12">
                        <p className="text-muted-foreground">
                            {" "}
                            <span className="font-semibold text-secondary-foreground">
                                16
                            </span>{" "}
                            jobs available
                        </p>

                        <form action="">
                            <CustomSelect
                                name="Sortby"
                                placeholder="Sort by (default)"
                            />
                        </form>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {[...Array(8)].map((item, i) => (
                            <FeaturedJobCard key={i} />
                        ))}
                    </div>
                    <Pagination className="mt-12">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="/hhh" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="/job/1212">
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
