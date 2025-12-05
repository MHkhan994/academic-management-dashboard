"use client";

import { useState } from "react";
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
import { Search, Download, X, BookOpen } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/DataTable";
import { Course, Student } from "@/interface";
import Link from "next/link";
import GlobalPagination from "@/components/global/GlobalPagination";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "@/components/ui/combobox";
import StudentAssignDialog from "@/components/student/StudentAssignDialog";
import { delay, exportStudentsToCsv } from "@/lib/utils";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("");
  const [gpaMin, setGpaMin] = useState("");
  const [gpaMax, setGpaMax] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("gpa");
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");

  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses?page=1&limit=30");
      console.log(res);
      return res.data?.data || [];
    },
  });

  const courses: Course[] = coursesData || [];

  const debounceSearch = useDebounce(search, 300);
  const debounceGpaMin = useDebounce(gpaMin, 300);
  const debounceGpaMax = useDebounce(gpaMax, 300);

  const { data: studentsData, isLoading: loading } = useQuery({
    queryKey: [
      "students",
      page,
      limit,
      debounceSearch,
      yearFilter,
      courseFilter,
      debounceGpaMin,
      debounceGpaMax,
      dateFilter,
      sortBy,
    ],
    queryFn: async () => {
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

      await delay(500);

      const res = await axios.get(`/api/students?${params.toString()}`);
      return res.data;
    },
    staleTime: 60000,
  });

  const students = studentsData?.data || [];
  const total = studentsData?.pagination?.total || 0;

  const clearFilters = () => {
    setSearch("");
    setYearFilter("all");
    setCourseFilter("");
    setGpaMin("");
    setGpaMax("");
    setDateFilter("");
    setSortBy("gpa");
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      exportStudentsToCsv(students);
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
        <div className="flex items-center gap-2">
          <Link href={`/students/${row.original.id}`}>
            <Button variant={"secondary"}>View Details</Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpenAssignDialog(true);
              setSelectedStudent(row.original.id);
            }}
            className="gap-1"
          >
            <BookOpen className="h-4 w-4" />
            Assign Course
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters =
    search ||
    yearFilter !== "all" ||
    courseFilter ||
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

            <Combobox
              placeholder="Filter by course"
              value={courseFilter}
              onChange={setCourseFilter}
              options={courses?.map((course) => ({
                value: course.id,
                searchValue: course.name,
                label: course.name,
              }))}
            />

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

      <StudentAssignDialog
        open={openAssignDialog}
        setOpen={setOpenAssignDialog}
        selectedStudent={selectedStudent}
      />
    </main>
  );
}
