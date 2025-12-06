"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../global/DataTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Course, Grade, Student } from "@/interface";
import { ColumnDef } from "@tanstack/react-table";
import GlobalPagination from "../global/GlobalPagination";
import { delay } from "@/lib/utils";
import AddGraderDialog from "./AddGraderDialog";

const GradeManagement = () => {
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { data: gradesData, isLoading: gradesLoading } = useQuery({
    queryKey: ["grades", page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      // await delay(200);
      const res = await axios.get(`/api/grades?${params.toString()}`);
      return res.data || [];
    },
  });
  const grades: Grade[] = gradesData?.data || [];
  const total = gradesData?.pagination?.total || 0;

  // Fetch Courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses?limit=30");
      return res.data?.data || [];
    },
  });

  const courses: Course[] = coursesData || [];

  // Fetch Students
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axios.get("/api/students?limit=30");
      return res.data?.data || [];
    },
  });

  const students: Student[] = studentsData || [];

  const gradeColumns: ColumnDef<Grade>[] = [
    {
      accessorKey: "studentId",
      header: "Student",
      cell: ({ row }) => {
        const student = students.find((s) => s.id === row.original.studentId);
        return <div>{student?.name || row.original.studentId}</div>;
      },
    },
    {
      accessorKey: "courseId",
      header: "Course",
      cell: ({ row }) => {
        const course = courses.find((c) => c.id === row.original.courseId);
        return (
          <div>
            {course ? `${course.code} - ${course.name}` : row.original.courseId}
          </div>
        );
      },
    },
    {
      accessorKey: "grade",
      header: "Letter Grade",
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => <div>{row.original.score.toFixed(2)}</div>,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Grade List</CardTitle>
            <CardDescription>View and manage student grades</CardDescription>
          </div>
          <Button onClick={() => setGradeDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Grade
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          loading={gradesLoading}
          limit={limit}
          columns={gradeColumns}
          data={grades}
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
      </CardContent>

      <AddGraderDialog open={gradeDialogOpen} setOpen={setGradeDialogOpen} />
    </Card>
  );
};

export default GradeManagement;
