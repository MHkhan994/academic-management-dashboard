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
