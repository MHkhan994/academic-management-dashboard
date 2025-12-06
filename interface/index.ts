export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentYear: number;
  enrollmentDate: string;
  year: "Freshman" | "Sophomore" | "Junior" | "Senior";
  gpa: number;
  enrolledCourses: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  faculty: string[]; // facultyId
  enrollment: number;
  credits: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  courses: string[]; // courseIds
  department: string;
}

export interface Grade {
  studentId: string;
  courseId: string;
  grade: string; // e.g. "A+", "A", "B+"
  score: number;
}

export interface UniversityData {
  students: Student[];
  courses: Course[];
  faculty: Faculty[];
  grades: Grade[];
}

export interface Enrollment {
  studentId: string;
  courseId: string;
  enrolledDate: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  gpa: number;
  enrollmentYear: number;
  year: Student["year"];
  enrolledCourses: string[];
  grades: Array<{
    courseId: string;
    grade: string;
    score: number;
  }>;
  courses: Array<{
    id: string;
    name: string;
    code: string;
    faculty: string;
    credits: number;
  }>;
}

export type GradeResult = {
  letter: string;
  gpa: number;
  isPassing: boolean;
};

export interface EnrollmentTrend {
  month: string;
  enrollments: number;
}

export interface TopStudent {
  id: string;
  name: string;
  email: string;
  courseName: string;
  courseCode: string;
  grade: string;
  score: number;
  rank: number;
}
