import {
  Course,
  EnrollmentTrend,
  Faculty,
  GradeResult,
  Student,
  TopStudent,
} from "@/interface";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

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

  downloadCSV(
    csvContent,
    `students_${new Date().toISOString().slice(0, 10)}.csv`
  );
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
    c.faculty?.join(","),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\r\n");

  downloadCSV(
    csvContent,
    `courses_${new Date().toISOString().slice(0, 10)}.csv`
  );
};

export const exportFacultyToCsv = (faculites: Faculty[]) => {
  const headers = ["Faculty Name", "Email", "Department", "Courses"];
  const rows = faculites.map((c) => [
    c.name,
    `"${c.name.replace(/"/g, '""')}"`, // escape quotes
    c.email,
    c.department,
    c.courses?.join(", "),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\r\n");

  downloadCSV(
    csvContent,
    `faculties_${new Date().toISOString().slice(0, 10)}.csv`
  );
};

export const errorHandler = (error: unknown, message: string) => {
  if (error instanceof AxiosError) {
    toast.error(error?.response?.data?.error?.message || message);
  } else {
    toast.error(message);
  }
};

export const exportEnrollmentTrends = (trends?: EnrollmentTrend[]) => {
  if (!trends || trends.length === 0) return;
  const csv = [
    ["Month", "Total Enrollments"],
    ...trends.map((t) => [t.month, t.enrollments]),
  ]
    .map((row) => row.join(","))
    .join("\r\n");

  downloadCSV(
    csv,
    `enrollment-trends-${new Date().toISOString().slice(0, 10)}.csv`
  );
};

export const exportTopStudents = (
  topStudents: TopStudent[],
  course: string
) => {
  if (topStudents.length === 0) return;
  const csv = [
    ["Rank", "Name", "Email", "Course", "Code", "Grade", "Score"],
    ...topStudents.map((s) => [
      s.rank,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      `"${s.courseName.replace(/"/g, '""')}"`,
      s.courseCode,
      s.grade,
      s.score,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\r\n");

  downloadCSV(
    csv,
    `top-students-${course || ""}-${new Date().toISOString().slice(0, 10)}.csv`
  );
};
