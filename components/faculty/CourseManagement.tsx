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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Course, Student } from "@/interface";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Combobox } from "../ui/combobox";
import { Checkbox } from "../ui/checkbox";
import { MultiSelect } from "../ui/multiselect";
import { toast } from "sonner";

const CourseManagement = () => {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses");
      return res.data?.data || [];
    },
  });
  const courses: Course[] = coursesData || [];

  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axios.get(`/api/students?limit=30`);
      return res.data?.data || [];
    },
  });

  const students: Student[] = studentsData || [];

  const queryClient = useQueryClient();

  const assignStudentsMutation = useMutation({
    mutationFn: async (data: { courseId: string; studentIds: string[] }) => {
      return await axios.post("/api/students/assign-course", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast("Students assigned successfully");
      setAssignDialogOpen(false);
      setSelectedCourseForAssign("");
      setSelectedStudents([]);
    },
    onError: (error) => {
      console.error("Failed to assign students:", error);
      toast.error("Failed to assign students. Please try again.");
    },
  });

  const handleAssignStudents = () => {
    if (!selectedCourseForAssign || selectedStudents.length === 0) {
      toast.warning("Please select a course and at least one student");
      return;
    }

    assignStudentsMutation.mutate({
      courseId: selectedCourseForAssign,
      studentIds: selectedStudents,
    });
  };

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

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Students to Course</DialogTitle>
            <DialogDescription>
              Select a course and students to assign
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assignCourse">Select Course</Label>

              <Combobox
                placeholder="Choose a course"
                value={selectedCourseForAssign}
                onChange={setSelectedCourseForAssign}
                options={courses?.map((course) => ({
                  value: course.id,
                  searchValue: course.name,
                  label: course.name,
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Students</Label>
              <MultiSelect
                selected={selectedStudents}
                onChange={setSelectedStudents}
                placeholder="Select students"
                options={students?.map((course) => ({
                  value: course.id,
                  searchValue: course.name,
                  label: course.name,
                }))}
              />
              <p className="text-sm text-muted-foreground">
                {selectedStudents.length} student(s) selected
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAssignDialogOpen(false);
                setSelectedCourseForAssign("");
                setSelectedStudents([]);
              }}
              disabled={assignStudentsMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignStudents}
              disabled={assignStudentsMutation.isPending}
            >
              {assignStudentsMutation.isPending
                ? "Assigning..."
                : "Assign Students"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CourseManagement;
