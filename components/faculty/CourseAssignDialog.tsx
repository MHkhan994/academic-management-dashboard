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
import { MultiSelect } from "../ui/multiselect";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Course, Student } from "@/interface";
import { delay } from "@/lib/utils";
import { toast } from "sonner";

const CourseAssignDialog = ({
  open,
  setOpen,
  selectedCourse,
}: {
  open: boolean;
  setOpen: (_: boolean) => void;
  selectedCourse?: string;
}) => {
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState(
    selectedCourse || ""
  );
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses?page=1&limit=30");
      return res.data?.data || [];
    },
  });
  const courses: Course[] = coursesData || [];

  const { data: studentsData } = useQuery({
    queryKey: ["students", selectedCourseForAssign],
    queryFn: async () => {
      const res = await axios.get(
        `/api/students?limit=30&excludeCourse=${selectedCourseForAssign}`
      );
      return res.data?.data || [];
    },
    enabled: !!selectedCourseForAssign,
  });

  const students: Student[] = studentsData || [];

  const queryClient = useQueryClient();

  const assignStudentsMutation = useMutation({
    mutationFn: async (data: { courseId: string; studentIds: string[] }) => {
      await delay(500);
      return await axios.post("/api/courses/assign", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast("Students assigned successfully");
      setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              readOnly={!selectedCourseForAssign || isLoading}
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
              setOpen(false);
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
  );
};

export default CourseAssignDialog;
