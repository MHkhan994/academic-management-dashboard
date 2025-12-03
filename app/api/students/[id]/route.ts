import { Student } from "@/interface";
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

    const res = await instance.get("/students");

    const students: Student[] = res.data;

    if (!students) {
      return ApiErrorHandler.internalError(
        "Sorry, Failed to get student data."
      );
    }

    const student = students.find((s) => s.id === id);

    if (student) {
      return ApiErrorHandler.internalError("No student exists by this id.");
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("[api/students/[id]] Unexpected error:", error);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
