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
  faculty: string; // facultyId
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
