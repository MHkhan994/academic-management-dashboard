import { Course, Faculty, Student } from "@/interface";
import { ApiErrorHandler } from "@/lib/api-utils";
import { instance } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const [studentsRes, coursesRes, facultyRes] = await Promise.all([
      instance.get(`/students`),
      instance.get(`/courses`),
      instance.get(`/faculty`),
    ]);

    const students: Student[] = studentsRes.data || [];
    const courses: Course[] = coursesRes.data || [];
    const faculties: Faculty[] = facultyRes.data || [];

    const topStudents = students
      .sort((a, b) => (b.gpa || 0) - (a.gpa || 0))
      .slice(0, 5);
    const popularCourses = courses
      .sort((a, b) => (b.enrollment || 0) - (a.enrollment || 0))
      .slice(0, 5);

    const courseEnrollmentData = courses.map((course) => ({
      name: course.code || "Unknown",
      enrollment: course.enrollment || 0,
    }));

    const statistics = {
      totalStudents: students.length,
      totalCourses: courses.length,
      totalFaculty: faculties.length,
      topStudents,
      popularCourses,
      courseEnrollmentData,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("[api/dashboard] Unexpected error:", error);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
