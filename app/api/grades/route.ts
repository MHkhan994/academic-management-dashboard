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
