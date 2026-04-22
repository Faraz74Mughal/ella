import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import AppSelect from "../ui/app-select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageSelect?: (perPage: number) => void;
  perPage?: number;
}
type PageItem = number | "ellipsis";

const getPages = (currentPage: number, totalPages: number): PageItem[] => {
  const pages: PageItem[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return pages;
};

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPerPageSelect,
  perPage,
}: PaginationProps) => {
  const pages = getPages(currentPage, totalPages);

  return (
    <div className="flex justify-between items-center px-10 my-6">
      <div className="flex gap-2 w-full items-center">
        <label className="text-sm font-medium text-muted-foreground">
          Rows per page:
        </label>
        <AppSelect
          value={perPage}
          onChange={(val: any) => onPerPageSelect?.(Number(val))}
          className="max-w-24"
          options={[
            { label: "10", value: 10 },
            { label: "20", value: 20 },
            { label: "50", value: 50 },
            { label: "100", value: 100 },
          ]}
          placeholder="Rows per page"
        />
      </div>
      <Pagination>
        <PaginationContent>
          {/* Prev */}

          <PaginationItem>
            <PaginationPrevious
              className={`${currentPage !== 1 ? "cursor-pointer" : "cursor-not-allowed bg-muted text-muted-foreground"}`}
              onClick={() => currentPage !== 1 && onPageChange(currentPage - 1)}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  className={`${currentPage === page ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "cursor-pointer bg-transparent text-foreground hover:bg-muted"}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          {/* Next */}

          <PaginationItem>
            <PaginationNext
              className={`${currentPage !== totalPages ? "cursor-pointer" : "cursor-not-allowed bg-muted text-muted-foreground"}`}
              onClick={() =>
                currentPage !== totalPages && onPageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
