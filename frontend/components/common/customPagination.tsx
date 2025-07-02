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
};

const CustomPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
}) => {
    const pageNumbers = [];

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
                        href={`/find-jobs/?page=${currentPage - 1}`}
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
                            <PaginationLink href={`/find-jobs/?page=1`}>
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

                {pageNumbers.map((num) => (
                    <PaginationItem key={num}>
                        <PaginationLink
                            href={`/find-jobs/?page=${num}`}
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
                                href={`/find-jobs/?page=${totalPages}`}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                <PaginationItem>
                    <PaginationNext
                        href={`/find-jobs/?page=${currentPage + 1}`}
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
