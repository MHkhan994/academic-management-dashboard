import { Course, Student } from "@/interface";
import { ApiErrorHandler } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const year = searchParams.get("year");
    const course = searchParams.get("course");

    const res = await fetch(`${process.env.API_URL}/students`);

    if (!res.ok) {
      return ApiErrorHandler.internalError("Failed to fetch students");
    }

    const students: Student[] = await res.json();

    let filtered = students;

    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (year) {
      filtered = filtered.filter((s) => s.year === year);
    }

    if (course) {
      filtered = filtered.filter((s) => s.enrolledCourses.includes(course));
    }

    const sorted = filtered.sort((a, b) => b.gpa - a.gpa);

    let courses: Course[] = [];

    try {
      const courseRes = await fetch(`${process.env.API_URL}/courses`);
      if (courseRes) {
        courses = await courseRes.json();
      }
    } catch (err) {
      console.log(err);
    }

    const populated = sorted?.map((student) => ({
      ...student,
      enrolledCourses: student.enrolledCourses?.map((course) =>
        courses?.find((c) => c.code === course)
      ),
    }));

    return NextResponse.json(populated);
  } catch (error) {
    console.error("API Error:", error);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
