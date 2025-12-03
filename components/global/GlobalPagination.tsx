import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (_page: number, _limit: number) => void;
  className?: string;
}

const GlobalPagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  onPageChange,
  currentPage: page,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [limit, setLimit] = useState(itemsPerPage);

  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (page: number) => {
    console.log({ page });
    setCurrentPage(page);
    onPageChange(page, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    const newTotalPages = Math.ceil(totalItems / newLimit);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    setLimit(newLimit);
    setCurrentPage(newCurrentPage);
    onPageChange(newCurrentPage, newLimit);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(
          <Button
            size={"sm"}
            key={i}
            onClick={() => (currentPage === i ? null : handlePageChange(i))}
            className={`rounded-md px-3 py-1 text-sm font-medium ${
              currentPage === i
                ? "bg-primary text-pure-white cursor-not-allowed"
                : "hover:bg-primary bg-background text-black hover:text-white"
            }`}
          >
            {i}
          </Button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(
          <span key={i} className="text-gray px-3 py-1">
            ...
          </span>
        );
      }
    }
    return pageNumbers;
  };

  const startRange = (currentPage - 1) * limit + 1;
  const endRange =
    currentPage * limit < totalItems ? currentPage * limit : totalItems;

  return (
    <nav
      className={cn(
        "flex flex-col items-center justify-between px-1 pt-3 sm:flex-row sm:justify-normal sm:px-0",
        `${totalItems === 0 && "hidden"}`,
        className
      )}
    >
      <div className="flex flex-col items-center justify-center sm:flex-1 sm:flex-row sm:items-center sm:justify-between md:flex-col lg:flex-row">
        <div className="flex items-center justify-between gap-4 sm:mb-0">
          <p className="text-gray text-sm">
            Showing {startRange} to {endRange} | Page{" "}
            <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>

          <div className="flex items-center lg:hidden">
            <Select
              defaultValue={limit.toString()}
              onValueChange={(value) => handleLimitChange(Number(value))}
            >
              <SelectTrigger className="min-w-[110px]">
                <SelectValue placeholder={limit.toString() + " / Page "} />
              </SelectTrigger>
              <SelectContent className="min-w-[70px]">
                <SelectItem className="min-w-[70px]" value="5">
                  5 / Page
                </SelectItem>
                <SelectItem className="min-w-[70px]" value="10">
                  10 / Page
                </SelectItem>
                <SelectItem className="min-w-[70px]" value="15">
                  15 / Page
                </SelectItem>
                <SelectItem className="min-w-[70px]" value="20">
                  20 / Page
                </SelectItem>
                <SelectItem className="min-w-[70px]" value="25">
                  25 / Page
                </SelectItem>
                <SelectItem className="min-w-[70px]" value="30">
                  30 / Page
                </SelectItem>
                <SelectItem className="min-w-[70px]" value="50">
                  50 / Page
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 space-x-1 sm:mt-0">
          <nav
            className="isolate inline-flex -space-x-px rounded-md"
            aria-label="Pagination"
          >
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`hover:text-primary text-gray relative inline-flex items-center px-1 hover:bg-transparent sm:px-2 ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <div className="space-x-1">{renderPageNumbers()}</div>
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`hover:text-primary text-gray relative inline-flex cursor-pointer items-center rounded-r-md px-1 hover:bg-transparent sm:px-2 ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </nav>
        </div>

        <div className="hidden items-center lg:block">
          <Select
            defaultValue={limit.toString()}
            onValueChange={(value) => handleLimitChange(Number(value))}
          >
            <SelectTrigger
              className="min-w-32"
              // disabled={totalItems <= 10}
            >
              <SelectValue placeholder={limit.toString() + " / Page "} />
            </SelectTrigger>
            <SelectContent className="min-w-0">
              <SelectItem value="5">5 / Page </SelectItem>
              <SelectItem value="10">10 / Page </SelectItem>
              <SelectItem value="15">15 / Page </SelectItem>
              <SelectItem value="20">20 / Page </SelectItem>
              <SelectItem value="25">25 / Page </SelectItem>
              <SelectItem value="30">30 / Page </SelectItem>
              <SelectItem value="50">50 / Page </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
};

export default GlobalPagination;
