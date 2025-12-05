import { Course, Grade, Student } from "@/interface";
import { ApiErrorHandler } from "@/lib/api-utils";
import { instance } from "@/lib/axios";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return ApiErrorHandler.badRequest("Invalid student ID");
    }

    const res = await instance.get(`/students/${id}`);
    const student: Student = res.data;

    const [coursesRes, gradesRes] = await Promise.all([
      instance.get(`/courses`),
      instance.get(`/grades`),
    ]);
    const courses: Course[] = coursesRes.data || [];
    const grades: Grade[] = gradesRes.data || [];

    if (!student) {
      return ApiErrorHandler.internalError("No student exists by this id.");
    }

    const studentGrades = grades.filter((g) => g.studentId === id);
    const enrolledCourses = courses.filter((c) =>
      student.enrolledCourses.includes(c.id)
    );

    return NextResponse.json({
      ...student,
      courses: enrolledCourses,
      grades: studentGrades,
    });
  } catch (error) {
    console.error("[api/students/[id]] Unexpected error:", error);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return ApiErrorHandler.badRequest("Invalid student ID");
    }

    const body = await req.json();
    const { enrolledCourses } = body;

    if (!Array.isArray(enrolledCourses)) {
      return ApiErrorHandler.badRequest("enrolledCourses must be an array");
    }

    if (!enrolledCourses.every((courseId) => typeof courseId === "string")) {
      return ApiErrorHandler.badRequest("All course IDs must be strings");
    }

    // Get current student data
    const studentRes = await instance.get(`/students/${id}`);
    const student: Student = studentRes.data;

    if (!student) {
      return ApiErrorHandler.internalError("No student exists by this id.");
    }

    // Merge with existing enrolled courses and remove duplicates
    const existingCourses = student.enrolledCourses || [];
    const uniqueCourses = Array.from(
      new Set([...existingCourses, ...enrolledCourses])
    );

    // Find newly added courses (not in existing courses)
    const newlyAddedCourses = enrolledCourses.filter(
      (courseId) => !existingCourses.includes(courseId)
    );

    // Update enrollment for newly added courses
    if (newlyAddedCourses.length > 0) {
      const coursesRes = await instance.get(`/courses`);
      const allCourses: Course[] = coursesRes.data || [];

      const enrollmentUpdates = newlyAddedCourses.map(async (courseId) => {
        const course = allCourses.find((c) => c.id === courseId);

        if (course) {
          const currentEnrollment = course.enrollment || 0;
          await instance.patch(`/courses/${courseId}`, {
            enrollment: currentEnrollment + 1,
          });
        }
      });

      await Promise.all(enrollmentUpdates);
    }

    // Update student with merged courses
    const updateRes = await instance.patch(`/students/${id}`, {
      enrolledCourses: uniqueCourses,
    });

    return NextResponse.json(updateRes.data);
  } catch (error) {
    console.error("[api/students/[id]] PATCH error:", error);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
