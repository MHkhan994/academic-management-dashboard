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
import { Search, Download } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/DataTable";
import { Student } from "@/interface";
import Link from "next/link";
import GlobalPagination from "@/components/global/GlobalPagination";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const debounceSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchStudents();
  }, [debounceSearch, page, limit]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/students?page=${page}&limit=${limit}&search=${debounceSearch}`
      );
      const data = res.data;
      console.log(data);
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      // simulating loading time. cause its too fast to see the loading skeleton i have spent time to add 😊😊
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
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
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find students by name, email, or enrollment year
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by enrollment year" />
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
