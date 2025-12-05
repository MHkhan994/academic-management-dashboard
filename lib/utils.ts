import { Course, GradeResult, Student } from "@/interface";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const scoreToGrade = (score: number): GradeResult => {
  if (isNaN(score) || score < 0 || score > 100) {
    return { letter: "Invalid", gpa: 0, isPassing: false };
  }

  if (score >= 90) return { letter: "A+", gpa: 4.0, isPassing: true };
  if (score >= 85) return { letter: "A", gpa: 4.0, isPassing: true };
  if (score >= 83) return { letter: "A-", gpa: 3.7, isPassing: true };

  if (score >= 80) return { letter: "B+", gpa: 3.3, isPassing: true };
  if (score >= 77) return { letter: "B", gpa: 3.0, isPassing: true };
  if (score >= 72) return { letter: "B-", gpa: 2.7, isPassing: true };

  if (score >= 60) return { letter: "C+", gpa: 2.3, isPassing: true };
  if (score >= 57) return { letter: "C", gpa: 2.0, isPassing: true };
  if (score >= 52) return { letter: "C-", gpa: 1.7, isPassing: true };

  if (score >= 50) return { letter: "D+", gpa: 1.3, isPassing: false };
  if (score >= 47) return { letter: "D", gpa: 1.0, isPassing: false };
  if (score >= 42) return { letter: "D-", gpa: 0.7, isPassing: false };

  return { letter: "F", gpa: 0.0, isPassing: false };
};

export const autoSuggestGrade = (scoreStr: string | number): string => {
  const score = parseFloat(String(scoreStr));
  if (isNaN(score)) return "";
  return scoreToGrade(score).letter;
};

export const exportStudentsToCsv = (students: Student[]) => {
  if (students.length === 0) {
    alert("No students to export");
    return;
  }

  const headers = [
    "Student ID",
    "Name",
    "Email",
    "Academic Year",
    "Enrolled Courses",
    "Enrollement Date",
  ];

  const rows = students.map((student) => [
    student.id,
    `"${(student.name || "").replace(/"/g, '""')}"`, // escape quotes
    student.email || "",
    student.year || "N/A",
    student.enrolledCourses?.length || 0,
    `${dayjs(student.enrollmentDate).format("MMMM D, YYYY")}`,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportCoursesToCsv = (courses: Course[]) => {
  const headers = [
    "Code",
    "Course Name",
    "Credits",
    "Enrolled Students",
    "Faculty Assigned",
  ];
  const rows = courses.map((c) => [
    c.code,
    `"${c.name.replace(/"/g, '""')}"`, // escape quotes
    c.credits,
    c.enrollment,
    c.faculty.join(","),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `courses_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
