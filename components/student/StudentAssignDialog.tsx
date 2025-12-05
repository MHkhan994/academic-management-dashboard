"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Course, StudentProfile } from "@/interface";
import { MultiSelect } from "../ui/multiselect";
import { Activity, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";
import { delay } from "@/lib/utils";

const StudentAssignDialog = ({
  open,
  setOpen,
  selectedStudent,
}: {
  open: boolean;
  setOpen: (_: boolean) => void;
  selectedStudent: string;
}) => {
  const queryClient = useQueryClient();
  const [courseToAssign, setcourseToAssign] = useState<string[]>([]);
  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses?page=1&limit=30");
      return res.data?.data || [];
    },
  });
  const courses: Course[] = coursesData || [];

  const { data: studentData, isLoading } = useQuery({
    queryKey: [`student+${selectedStudent}`],
    queryFn: async () => {
      const res = await axios.get(`/api/students/${selectedStudent}`);
      return res.data as StudentProfile;
    },
    enabled: !!selectedStudent && open,
    staleTime: 0,
  });

  const assignCourseMutation = useMutation({
    mutationFn: async (data: { studentId: string; courses: string[] }) => {
      await delay(500);
      return await axios.patch(`/api/students/${data.studentId}`, {
        enrolledCourses: data.courses,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
      setcourseToAssign([]);
      toast.success("Course assigned successfully");
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to assign course:", error?.message);
      toast.error("Failed to assign course. Please try again.");
    },
  });

  const handleAssignCourse = () => {
    if (!selectedStudent || !courseToAssign) {
      toast.warning("Missing Information, Please select a course");
      return;
    }

    assignCourseMutation.mutate({
      studentId: selectedStudent,
      courses: courseToAssign,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Course</DialogTitle>
          <DialogDescription>
            Assign a new course to {studentData?.name}
          </DialogDescription>
        </DialogHeader>

        <Activity mode={isLoading ? "visible" : "hidden"}>
          <div className="space-y-2">
            <Skeleton className="w-full h-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="w-full h-9" />
          </div>
        </Activity>

        <Activity mode={isLoading ? "hidden" : "visible"}>
          <div className="space-y-3 py-4">
            <div className="space-y-2">
              <Label htmlFor="assignCourse">Select Courses</Label>
              <MultiSelect
                selected={courseToAssign}
                onChange={setcourseToAssign}
                placeholder="Choose courses"
                options={courses?.map((course) => ({
                  value: course.id,
                  searchValue: course.name,
                  label: course.name,
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Assigned Courses</Label>
              <div className="space-y-1.5">
                {studentData?.courses?.map((c) => (
                  <Card className="space-y-2 py-2" key={c.id}>
                    <CardContent className="px-3">
                      <h2>{c.name}</h2>
                      <p>Code: {c.code}</p>
                      <p>Credits: {c.credits}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={assignCourseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignCourse}
              disabled={assignCourseMutation.isPending}
            >
              {assignCourseMutation.isPending
                ? "Assigning..."
                : "Assign Course"}
            </Button>
          </DialogFooter>
        </Activity>
      </DialogContent>
    </Dialog>
  );
};

export default StudentAssignDialog;
