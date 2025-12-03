import { Student } from "@/interface";
import { ApiErrorHandler } from "@/lib/api-utils";
import { instance } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const year = searchParams.get("year");
    const course = searchParams.get("course");
    const gpaMin = searchParams.get("gpaMin");
    const gpaMax = searchParams.get("gpaMax");
    const date = searchParams.get("date");
    const sortBy = searchParams.get("sortBy");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const res = await instance.get(`/students`);

    if (!res) {
      return ApiErrorHandler.internalError("Failed to fetch students");
    }

    let students: Student[] = res.data;

    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchLower) ||
          s.email?.toLowerCase().includes(searchLower)
      );
    }

    if (year && year !== "all") {
      students = students.filter((s) => s.year === year);
    }

    if (course && course !== "all") {
      students = students.filter((s) =>
        s.enrolledCourses?.some((c: any) =>
          typeof c === "string" ? c === course : c.id === course
        )
      );
    }

    if (gpaMin) {
      const min = Number(gpaMin);
      students = students.filter((s) => s.gpa >= min);
    }

    if (gpaMax) {
      const max = Number(gpaMax);
      students = students.filter((s) => s.gpa <= max);
    }

    if (date) {
      const y = Number(date);
      if (!isNaN(y)) {
        students = students.filter((s) => {
          const enrollmentYear = new Date(s.enrollmentDate).getFullYear();
          return enrollmentYear === y;
        });
      }
    }

    let sorted = [...students];

    if (sortBy && sorted.length > 0) {
      sorted = students.sort((a, b) => {
        const av = a[sortBy as keyof Student];
        const bv = b[sortBy as keyof Student];

        if (typeof av === "number" && typeof bv === "number") {
          return bv - av;
        }

        if (typeof av === "string" && typeof bv === "string") {
          return av.localeCompare(bv);
        }

        if (av instanceof Date && bv instanceof Date) {
          return bv.getTime() - av.getTime();
        }

        return 0;
      });
    }

    const total = sorted.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = sorted.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedStudents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
