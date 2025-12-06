"use client";

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
import { MultiSelect } from "@/components/ui/multiselect";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Course, StudentProfile } from "@/interface";
import { delay, errorHandler } from "@/lib/utils";
import { Label } from "../ui/label";

const assignSchema = z.object({
  courseIds: z.array(z.string()).min(1, "Please select at least one course"),
});

type AssignFormData = z.infer<typeof assignSchema>;

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

  const form = useForm<AssignFormData>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      courseIds: [],
    },
  });

  // Fetch all courses
  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("/api/courses?page=1&limit=100");
      return (res.data?.data || []) as Course[];
    },
  });

  // Fetch selected student
  const {
    data: studentData,
    isLoading: studentLoading,
    isError,
  } = useQuery({
    queryKey: ["student", selectedStudent],
    queryFn: async () => {
      const res = await axios.get(`/api/students/${selectedStudent}`);
      return res.data as StudentProfile;
    },
    enabled: !!selectedStudent && open,
    staleTime: 0,
  });

  const alreadyEnrolledCourseIds = studentData?.courses?.map((c) => c.id) || [];

  const availableCourses = coursesData?.filter(
    (course) => !alreadyEnrolledCourseIds.includes(course.id)
  );

  const assignCourseMutation = useMutation({
    mutationFn: async (data: { studentId: string; courseIds: string[] }) => {
      // await delay(200);
      return axios.patch(`/api/students/${data.studentId}`, {
        enrolledCourses: data.courseIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", selectedStudent] });
      toast.success("Courses assigned successfully");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to assign courses:", error);
      errorHandler(error, "Failed to assign courses. Please try again.");
    },
  });

  const onSubmit = (data: AssignFormData) => {
    assignCourseMutation.mutate({
      studentId: selectedStudent,
      courseIds: data.courseIds,
    });
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Courses</DialogTitle>
          <DialogDescription>
            Assign new courses to <strong>{studentData?.name || "..."}</strong>
          </DialogDescription>
        </DialogHeader>

        {studentLoading ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : isError ? (
          <p className="text-destructive py-8 text-center">
            Failed to load student data
          </p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* New Courses to Assign */}
              <FormField
                control={form.control}
                name="courseIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel tooltip="Only courses the student is not already enrolled in are shown">
                      Select Courses to Assign
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        selected={field.value || []}
                        onChange={field.onChange}
                        placeholder={
                          availableCourses?.length === 0
                            ? "No new courses available"
                            : "Search and select courses..."
                        }
                        options={
                          availableCourses?.map((course) => ({
                            value: course.id,
                            label: `${course.code} - ${course.name} (${course.credits} credits)`,
                            searchValue: `${course.code} ${course.name}`,
                          })) || []
                        }
                        readOnly={
                          assignCourseMutation.isPending ||
                          availableCourses?.length === 0
                        }
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground">
                      {field.value?.length} course(s) selected
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currently Enrolled Courses */}
              {studentData?.courses && studentData.courses.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium">
                      Currently Enrolled ({studentData.courses.length})
                    </Label>
                  </div>
                  <div className="grid gap-3 max-h-72 overflow-y-auto">
                    {studentData.courses.map((course) => (
                      <Card key={course.id} className="border py-0">
                        <CardContent className="p-3 py-2">
                          <h4 className="font-medium">{course.name}</h4>
                          <div className="text-sm text-muted-foreground space-y-1 mt-1">
                            <p>Code: {course.code}</p>
                            <p>Credits: {course.credits}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={assignCourseMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    assignCourseMutation.isPending ||
                    !form.formState.isValid ||
                    form.getValues("courseIds").length === 0
                  }
                >
                  {assignCourseMutation.isPending
                    ? "Assigning..."
                    : "Assign Courses"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentAssignDialog;
