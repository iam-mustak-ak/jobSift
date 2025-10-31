import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    uri: string;
};

const CustomPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    uri,
}) => {
    const pageNumbers = [];

    const getQueryString = (page: number) => {
        if (typeof window === "undefined") return `?page=${page}`;
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        params.set("page", page.toString());

        const allowed = [
            "title",
            "location",
            "jobCategory",
            "jobType",
            "experienceLevel",
            "page",
        ];
        for (const key of Array.from(params.keys())) {
            if (!allowed.includes(key)) {
                params.delete(key);
            }
        }

        return `?${params.toString()}`;
    };

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination className="mt-12">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={`${uri}/${getQueryString(currentPage - 1)}`}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>

                {startPage > 1 && (
                    <>
                        <PaginationItem>
                            <PaginationLink
                                href={`${uri}/${getQueryString(1)}`}
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        {startPage > 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                    </>
                )}

                {pageNumbers?.map((num) => (
                    <PaginationItem key={num}>
                        <PaginationLink
                            href={`${uri}/${getQueryString(num)}`}
                            isActive={currentPage === num}
                        >
                            {num}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink
                                href={`${uri}/${getQueryString(totalPages)}`}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext
                        href={`${uri}/?page=${currentPage + 1}`}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;
