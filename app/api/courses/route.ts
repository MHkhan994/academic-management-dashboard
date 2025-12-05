import { ApiErrorHandler } from "@/lib/api-utils";
import { instance } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const res = await instance.get("/courses");
    const courseData = res.data || [];
    let courses = [...courseData];

    if (search) {
      const searchLower = search.toLowerCase();
      courses = courses.filter(
        (f) =>
          f.name?.toLowerCase().includes(searchLower) ||
          f.email?.toLowerCase().includes(searchLower) ||
          f.department?.toLowerCase().includes(searchLower)
      );
    }

    const total = courses.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = courses.slice(startIndex, endIndex);

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
