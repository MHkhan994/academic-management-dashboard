import { Student } from "@/interface";
import { ApiErrorHandler } from "@/lib/api-utils";
import { instance } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const yearParam = searchParams.get("year");
    const targetYear = yearParam ? Number(yearParam) : new Date().getFullYear();

    if (isNaN(targetYear) || targetYear < 2000 || targetYear > 2100) {
      return ApiErrorHandler.badRequest(
        "Invalid year. Use a valid year (e.g., 2023)"
      );
    }

    const res = await instance.get("/students");
    const students: Student[] = res?.data || [];

    // Filter students enrolled in the target year
    const studentsInYear = students.filter((s) => {
      const enrollmentYear = new Date(s.enrollmentDate).getFullYear();
      return enrollmentYear === targetYear;
    });

    // Count enrollments by month (1–12)
    const monthlyCount = Array(12).fill(0);

    studentsInYear.forEach((student) => {
      const monthIndex = new Date(student.enrollmentDate).getMonth(); // 0 = Jan, 11 = Dec
      monthlyCount[monthIndex]++;
    });

    console.log(monthlyCount);

    // Format as expected by chart
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const trends = monthNames.map((month, index) => ({
      month: `${month} ${targetYear}`,
      enrollments: monthlyCount[index],
    }));

    return NextResponse.json({ data: trends });
  } catch (err) {
    console.log(err);
    return ApiErrorHandler.internalError("An unexpected error occurred");
  }
}
