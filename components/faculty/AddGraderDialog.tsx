import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Course, Student } from "@/interface";
import { autoSuggestGrade } from "@/lib/utils";
import { useEffect } from "react";

const gradeSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  courseId: z.string().min(1, "Please select a course"),
  grade: z.string().min(1, "Please select a letter grade"),
  score: z
    .number()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
      {
        message: "Score must be between 0 and 100",
      }
    ),
});

type GradeFormData = z.infer<typeof gradeSchema>;

const AddGraderDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (_: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
      score: 0,
      grade: "",
    },
  });

  const course = form.watch("courseId");

  useEffect(() => {
    if (course) {
      form.setValue("studentId", "");
      form.setValue("grade", "");
      form.setValue("score", 0);
    }
  }, [course, form]);

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", form.watch("studentId")],
    queryFn: async () => {
      const res = await axios.get("/api/courses?limit=30");
      return res.data?.data || [];
    },
  });

  const courses: Course[] = coursesData || [];

  // Fetch Students
  const { data: studentsData } = useQuery({
    queryKey: ["students", course],
    queryFn: async () => {
      const res = await axios.get(`/api/students?course=${course}&limit=30`);
      return res.data?.data || [];
    },
  });

  const students: Student[] = studentsData || [];

  const addGradeMutation = useMutation({
    mutationFn: async (data: GradeFormData) => {
      return await axios.post("/api/grades", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      toast.success("Grade added successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Failed to add grade:", error?.response);
      toast.error(
        error?.response?.data?.error?.message ||
          "Failed to add grade. Please try again."
      );
    },
  });

  const onSubmit = (data: GradeFormData) => {
    addGradeMutation.mutate(data);
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Grade</DialogTitle>
          <DialogDescription>
            Select a student and course, then enter their grade and score.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 py-4">
              {/* Course Select */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel tooltip="Start by selecting a course first">
                      Select Course
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      defaultValue={field.value}
                      disabled={addGradeMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Student Select */}
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel tooltip="Select a course first to see enrolled students">
                      Select Student
                    </FormLabel>
                    <Select
                      key={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("grade", "");
                        form.setValue("score", 0);
                      }}
                      defaultValue={field.value}
                      disabled={
                        addGradeMutation.isPending ||
                        coursesLoading ||
                        !form.watch("courseId")
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Score Input */}
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel tooltip="Enter score and letter grade will be auto-suggested">
                      Score (0–100) (Passing score: 42)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="e.g. 92.5"
                        {...field}
                        value={field.value?.toString()}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          const suggested = autoSuggestGrade(e.target.value);
                          if (suggested) {
                            form.setValue("grade", suggested); // Auto-fill letter grade
                          }
                        }}
                        disabled={addGradeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel tooltip="Auto-filled based on score entered above">
                      Letter Grade
                    </FormLabel>
                    {field.value}
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
                disabled={addGradeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addGradeMutation.isPending}
                className="min-w-[120px]"
              >
                {addGradeMutation.isPending ? "Submitting..." : "Submit Grade"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGraderDialog;
