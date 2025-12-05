"use client";
import React, { useState } from "react";
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
import { Course } from "@/interface";
import { ColumnDef } from "@tanstack/react-table";
import CourseAssignDialog from "./CourseAssignDialog";

const CourseManagement = () => {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses");
      return res.data?.data || [];
    },
  });
  const courses: Course[] = coursesData || [];

  const courseColumns: ColumnDef<Course>[] = [
    {
      accessorKey: "code",
      header: "Course Code",
    },
    {
      accessorKey: "name",
      header: "Course Name",
    },
    {
      accessorKey: "credits",
      header: "Credits",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "enrolledStudents",
      header: "Enrolled Students",
      cell: ({ row }) => <div>{row.original?.enrollment || 0}</div>,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Course List</CardTitle>
            <CardDescription>
              View all courses and assign students
            </CardDescription>
          </div>
          <Button onClick={() => setAssignDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Assign Students
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          loading={coursesLoading}
          columns={courseColumns}
          data={courses}
        />
      </CardContent>

      <CourseAssignDialog
        open={assignDialogOpen}
        setOpen={setAssignDialogOpen}
      />
    </Card>
  );
};

export default CourseManagement;
