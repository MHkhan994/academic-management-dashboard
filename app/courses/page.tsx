"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Download, X, BookOpen, Users, CreditCard } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import useDebounce from "@/hooks/useDebounce";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/DataTable";
import GlobalPagination from "@/components/global/GlobalPagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { exportCoursesToCsv } from "@/lib/utils";

export interface Course {
  id: string;
  name: string;
  code: string;
  faculty: string[];
  enrollment: number;
  credits: number;
}

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 300);
  const [isExporting, setisExporting] = useState(false);
  // Fetch courses with React Query
  const { data: response, isLoading } = useQuery({
    queryKey: ["courses", page, limit, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append("search", debouncedSearch);

      const res = await axios.get(`/api/courses?${params.toString()}`);
      return res.data;
    },
    staleTime: 1000 * 60, // 30 seconds
  });

  const courses: Course[] = response?.data || [];
  const total = response?.pagination?.total || 0;

  // Export mutation
  const handleExport = () => {
    if (courses.length === 0) return;
    setisExporting(true);
    try {
      exportCoursesToCsv(courses);
    } catch (err) {
      console.log(err);
    } finally {
      setisExporting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters = search.trim() !== "";

  const courseColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-primary">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Course Name",
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-medium truncate" title={row.original.name}>
            {row.original.name}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "faculty",
      header: "Faculty",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.faculty?.length > 0
            ? `${row.original.faculty.length} assigned`
            : "Unassigned"}
        </div>
      ),
    },
    {
      accessorKey: "enrollment",
      header: "Students",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.enrollment}</span>
        </div>
      ),
    },
    {
      accessorKey: "credits",
      header: "Credits",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          {row.original.credits}
        </div>
      ),
    },
  ];

  return (
    <main className="p-4 space-y-3">
      <PageHeader
        title="Course Management"
        subtitle="View and manage all courses in the system"
        buttons={
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        }
      />

      {/* Search Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Search Courses
              </CardTitle>
              <CardDescription>
                Filter by course code, name, or faculty
              </CardDescription>
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="ghost" size="sm">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses List</CardTitle>
          <CardDescription>
            Showing {courses.length} of {total} course{total !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={courseColumns}
            data={courses}
            loading={isLoading}
            limit={limit}
          />

          <div className="mt-4">
            <GlobalPagination
              itemsPerPage={limit}
              currentPage={page}
              totalItems={total}
              onPageChange={(newPage, newLimit) => {
                setPage(newPage);
                setLimit(newLimit);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
