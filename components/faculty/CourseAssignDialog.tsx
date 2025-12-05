import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multiselect";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Course, Student } from "@/interface";
import { delay, errorHandler } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect } from "react";

// Zod Schema
const assignSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  studentIds: z.array(z.string()).min(1, "Please select at least one student"),
});

type AssignFormData = z.infer<typeof assignSchema>;

const CourseAssignDialog = ({
  open,
  setOpen,
  selectedCourse,
}: {
  open: boolean;
  setOpen: (_: boolean) => void;
  selectedCourse?: string;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<AssignFormData>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      courseId: selectedCourse || "",
      studentIds: [],
    },
  });

  // Pre-fill if selectedCourse passed (e.g. from course details page)
  useEffect(() => {
    if (selectedCourse) {
      form.setValue("courseId", selectedCourse);
    }
  }, [selectedCourse, form]);

  // Reset students when course changes
  const watchedCourseId = form.watch("courseId");
  useEffect(() => {
    form.setValue("studentIds", []);
  }, [watchedCourseId, form]);

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses?page=1&limit=100");
      return res.data?.data || [];
    },
  });

  const courses: Course[] = coursesData || [];

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["students", "available", watchedCourseId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/students?limit=100&excludeCourse=${watchedCourseId}`
      );
      return res.data?.data || [];
    },
    enabled: !!watchedCourseId,
  });

  const students: Student[] = studentsData || [];

  const assignStudentsMutation = useMutation({
    mutationFn: async (data: AssignFormData) => {
      await delay(200);
      return axios.post("/api/courses/assign", {
        courseId: data.courseId,
        studentIds: data.studentIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Students assigned successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Failed to assign:", error);
      errorHandler(error, "Failed to assign students. Please try again.");
    },
  });

  const onSubmit = (data: AssignFormData) => {
    assignStudentsMutation.mutate(data);
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Students to Course</DialogTitle>
          <DialogDescription>
            Choose a course and select students to enroll them.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5 py-4">
              {/* Course Selection */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel
                        tooltip="Students already enrolled in this course will be
                            excluded"
                      >
                        Select Course
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Combobox
                        placeholder="Search courses..."
                        value={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        options={courses.map((c) => ({
                          value: c.id,
                          label: `${c.code} - ${c.name}`,
                          searchValue: `${c.code} ${c.name}`,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Students Multi-Select */}
              <FormField
                control={form.control}
                name="studentIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel
                        tooltip="Only students not already enrolled in the selected
                            course are shown"
                      >
                        Select Students
                      </FormLabel>
                    </div>
                    <FormControl>
                      <MultiSelect
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder={
                          !watchedCourseId
                            ? "First select a course"
                            : studentsLoading
                            ? "Loading students..."
                            : "Search and select students"
                        }
                        options={students.map((s) => ({
                          value: s.id,
                          label: `${s.name} (${s.email})`,
                          searchValue: `${s.name} ${s.email}`,
                        }))}
                        readOnly={
                          !watchedCourseId ||
                          studentsLoading ||
                          assignStudentsMutation.isPending
                        }
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground mt-2">
                      {field.value?.length} student(s) selected
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={assignStudentsMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  assignStudentsMutation.isPending ||
                  !form.formState.isValid ||
                  !watchedCourseId
                }
              >
                {assignStudentsMutation.isPending
                  ? "Assigning..."
                  : "Assign Students"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseAssignDialog;
