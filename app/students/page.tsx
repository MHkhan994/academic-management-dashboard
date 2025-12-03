"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import { Search, Download, X } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/DataTable";
import { Course, Student } from "@/interface";
import Link from "next/link";
import GlobalPagination from "@/components/global/GlobalPagination";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [gpaMin, setGpaMin] = useState("");
  const [gpaMax, setGpaMax] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("gpa");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);

  const debounceSearch = useDebounce(search, 300);
  const debounceGpaMin = useDebounce(gpaMin, 300);
  const debounceGpaMax = useDebounce(gpaMax, 300);

  useEffect(() => {
    fetchStudents();
  }, [page, limit]);
  useEffect(() => {
    setPage(1);

    if (page === 1) {
      fetchStudents();
    }
  }, [
    debounceSearch,
    yearFilter,
    courseFilter,
    debounceGpaMin,
    debounceGpaMax,
    dateFilter,
    sortBy,
  ]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (debounceSearch) params.append("search", debounceSearch);
      if (yearFilter !== "all") params.append("year", yearFilter);
      if (courseFilter !== "all") params.append("course", courseFilter);
      if (debounceGpaMin) params.append("gpaMin", debounceGpaMin);
      if (debounceGpaMax) params.append("gpaMax", debounceGpaMax);
      if (dateFilter) params.append("date", dateFilter);
      if (sortBy) params.append("sortBy", sortBy);

      const res = await axios.get(`/api/students?${params.toString()}`);
      const data = res.data;
      console.log(data.data);
      setStudents(data?.data || []);
      setTotal(data?.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      // simulating loading time. cause its too fast to see the loading skeleton i have spent time to add 😊😊
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setYearFilter("all");
    setCourseFilter("all");
    setGpaMin("");
    setGpaMax("");
    setDateFilter("");
    setSortBy("gpa");
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/students");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      a.click();
    } catch (error) {
      console.error("Failed to export:", error);
    } finally {
      setExporting(false);
    }
  };

  const studentColumn: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "gpa",
      header: "GPA",
    },
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "enrollmentDate",
      header: "Enrollment Date",
      cell: ({ row }) => (
        <p>{dayjs(row.original.enrollmentDate).format("MMMM D, YYYY")}</p>
      ),
    },
    {
      accessorKey: "enrolledCourses",
      header: "Enrolled Courses",
      cell: ({ row }) => <div>{row.original?.enrolledCourses?.length}</div>,
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/students/${row.original.id}`}>
          <Button variant={"secondary"}>View Details</Button>
        </Link>
      ),
    },
  ];

  const hasActiveFilters =
    search ||
    yearFilter !== "all" ||
    courseFilter !== "all" ||
    gpaMin ||
    gpaMax ||
    dateFilter ||
    sortBy !== "gpa";

  return (
    <main className="p-4 space-y-3">
      <PageHeader
        title="Student Management"
        subtitle="Manage and monitor all enrolled students"
        buttons={
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
        }
      />

      <Card className="mb-4">
        <CardHeader className="gap-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>
                Find students by name, email, GPA, year, course, or enrollment
                date
              </CardDescription>
            </div>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {["Freshman", "Sophomore", "Junior", "Senior"].map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Enrollment year (e.g., 2024)"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* Filters Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              step="0.01"
              placeholder="Min GPA"
              value={gpaMin}
              onChange={(e) => setGpaMin(e.target.value)}
            />

            <Input
              type="number"
              step="0.01"
              placeholder="Max GPA"
              value={gpaMax}
              onChange={(e) => setGpaMax(e.target.value)}
            />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpa">GPA (High to Low)</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="enrollmentDate">Enrollment Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Total: {students.length} students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DataTable
              loading={loading}
              limit={limit}
              columns={studentColumn}
              data={students}
            />
            <GlobalPagination
              itemsPerPage={limit}
              currentPage={page}
              totalItems={total}
              onPageChange={(page, limit) => {
                setPage(page);
                setLimit(limit);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
