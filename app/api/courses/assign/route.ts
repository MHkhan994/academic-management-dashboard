import { NextRequest, NextResponse } from "next/server";
import { instance } from "@/lib/axios";
import { ApiErrorHandler } from "@/lib/api-utils";
import { Course, Student } from "@/interface";

interface AssignCourseRequest {
  courseId: string;
  studentIds: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: AssignCourseRequest = await req.json();
    const { courseId, studentIds } = body;

    if (!courseId || !Array.isArray(studentIds) || studentIds.length === 0) {
      return ApiErrorHandler.badRequest(
        "courseId and non-empty studentIds array are required"
      );
    }

    const studentsCount = studentIds.length;

    const [studentsRes, courseRes] = await Promise.all([
      instance.get(`/students`),
      instance.get(`/courses/${courseId}`),
    ]);

    const course: Course = courseRes.data;
    const students: Student[] = studentsRes.data;

    const studentUpdatePromises = studentIds.map((studentId) => {
      const student = students?.find((s) => s.id === studentId);
      if (!student) throw new Error(`Student not found`);

      return instance.patch(`/students/${studentId}`, {
        enrolledCourses: [...student?.enrolledCourses, courseId],
      });
    });

    const courseUpdatePromise = instance.patch(`/courses/${courseId}`, {
      enrollment: Number(studentsCount) + Number(course.enrollment),
    });

    await Promise.all([...studentUpdatePromises, courseUpdatePromise]);

    return NextResponse.json(
      {
        success: true,
        message: `Course assigned to ${studentsCount} student(s) successfully`,
        data: {
          courseId,
          assignedTo: studentsCount,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error assigning course:", err.response?.data || err.message);
    return ApiErrorHandler.internalError("Failed to assign course");
  }
}
