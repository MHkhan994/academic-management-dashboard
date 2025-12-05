import { Grade } from "@/interface";
import { ApiErrorHandler } from "@/lib/api-utils";
import { instance } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const res = await instance.get("/grades");
    const gradesDAta = res.data || [];
    const grades: Grade[] = [...gradesDAta];

    const total = grades.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = grades.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Omit<Grade, "id"> = await req.json();

    const { studentId, courseId, grade, score } = body;

    // Validation
    if (!studentId || !courseId || grade === undefined || score === undefined) {
      return ApiErrorHandler.badRequest(
        "studentId, courseId, grade, and score are required"
      );
    }

    if (typeof score !== "number" || score < 0 || score > 100) {
      return ApiErrorHandler.badRequest(
        "score must be a number between 0 and 100"
      );
    }

    if (
      ![
        "A+",
        "A",
        "A-",
        "B+",
        "B",
        "B-",
        "C+",
        "C",
        "C-",
        "D",
        "D+",
        "D-",
        "F",
      ].includes(grade)
    ) {
      return ApiErrorHandler.badRequest(
        "Invalid grade. Allowed: A+, A, A-, B+, B, B-, C+, C, C-, D, D+, D-, F"
      );
    }

    // Optional: Check if student and course exist
    try {
      const [studentRes, courseRes] = await Promise.all([
        instance.get(`/students/${studentId}`),
        instance.get(`/courses/${courseId}`),
      ]);

      if (!studentRes.data) {
        return ApiErrorHandler.notFound(
          `Student with id ${studentId} not found`
        );
      }
      if (!courseRes.data) {
        return ApiErrorHandler.notFound(`Course with id ${courseId} not found`);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        return ApiErrorHandler.notFound("Student or Course not found");
      }
    }

    // Optional: Prevent duplicate grade for same student + course
    const existingGrades = await instance.get("/grades");
    const duplicate = existingGrades.data.find(
      (g: Grade) => g.studentId === studentId && g.courseId === courseId
    );

    if (duplicate) {
      return ApiErrorHandler.badRequest(
        "Grade already exists for this student and course"
      );
    }

    // Create new grade object
    const newGrade: Grade = {
      studentId,
      courseId,
      grade,
      score,
    };

    // Save to JSON Server
    const response = await instance.post("/grades", newGrade);

    return NextResponse.json(
      {
        success: true,
        message: "Grade added successfully",
        data: response.data,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error adding grade:", err);
    return ApiErrorHandler.internalError("Failed to add grade");
  }
}
