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
    const popularCourses = courses.sort(
      (a, b) => (b.enrollment || 0) - (a.enrollment || 0)
    );

    const totalCourses = courses.length;

    const courseEnrollmentData = [...popularCourses]
      .map((course) => ({
        name: course.code || "Unknown",
        enrollment: course.enrollment || 0,
      }))
      .slice(0, 10);

    const gpaBins = {
      "3.9-4.0": 0,
      "3.7-3.8": 0,
      "3.5-3.6": 0,
      "3.3-3.4": 0,
      "3.0-3.2": 0,
      "Below 3.0": 0,
    };

    students.forEach((student) => {
      if (student.gpa >= 3.9) gpaBins["3.9-4.0"]++;
      else if (student.gpa >= 3.7) gpaBins["3.7-3.8"]++;
      else if (student.gpa >= 3.5) gpaBins["3.5-3.6"]++;
      else if (student.gpa >= 3.3) gpaBins["3.3-3.4"]++;
      else if (student.gpa >= 3.0) gpaBins["3.0-3.2"]++;
      else gpaBins["Below 3.0"]++;
    });

    const departmentMap: Record<string, number> = {};

    courses.forEach((course) => {
      const dept = course.name;
      departmentMap[dept] = (departmentMap[dept] || 0) + 1;
    });

    const statistics = {
      totalStudents: students.length,
      totalCourses,
      totalFaculty: faculties.length,
      topStudents,
      popularCourses: popularCourses.slice(0, 5),
      courseEnrollmentData,
      gpaBins,
      departmentMap,
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("[api/dashboard] Unexpected error:", error);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
