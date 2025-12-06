import { Course, Grade, Student } from "@/interface";
import { ApiErrorHandler } from "@/lib/api-utils";
import { instance } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const courseId = searchParams.get("course");

    const [studentsRes, coursesRes, gradesRes] = await Promise.all([
      instance.get(`/students`),
      instance.get(`/courses`),
      instance.get(`/grades`),
    ]);

    console.log(courseId);

    const students: Student[] = studentsRes.data || [];
    const courses: Course[] = coursesRes.data || [];
    const grades: Grade[] = gradesRes.data || [];

    let gradesWithDetails = grades
      .map((g) => {
        const student = students.find((s) => s.id === g.studentId);
        const course = courses.find((c) => c.id === g.courseId);
        if (!student || !course) return null;

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          courseName: course.name,
          courseCode: course.code,
          grade: g.grade,
          score: g.score,
        };
      })
      .filter(Boolean) as any[];

    if (courseId && courseId !== "all") {
      gradesWithDetails = gradesWithDetails.filter(
        (g) => g.courseCode === courseId
      );
    }

    // Sort by score descending
    gradesWithDetails.sort((a, b) => b.score - a.score);

    // Add rank
    const withRank = gradesWithDetails.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    return NextResponse.json({ data: withRank.slice(0, 20) });
  } catch (err) {
    console.log(err);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
