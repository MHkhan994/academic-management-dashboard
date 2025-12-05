import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import { StudentProfile } from "@/interface";

const fetchStudent = async (studentId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/students/${studentId}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch student: ${error}`);
    return null;
  }
};

export const revalidate = 60;

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student: StudentProfile | null = await fetchStudent(id);

  if (!student)
    return (
      <div className="p-8">
        <p>Student not found</p>
      </div>
    );

  return (
    <main className="p-4 space-y-3">
      <PageHeader
        title="Student Details"
        buttons={
          <Link href="/students">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        }
      />
      <div className="mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-3xl">{student.name}</CardTitle>
            <CardDescription>{student.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">GPA</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {student.gpa.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrollment Year</p>
                <p className="text-2xl font-bold">{student.enrollmentYear}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{student.courses.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Academic Year</p>
                <p className="text-2xl font-bold">{student.year}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Current and past courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Credits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.code}
                      </TableCell>
                      <TableCell className="text-xs">{course.name}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grades & Performance</CardTitle>
              <CardDescription>Academic grades and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.grades.map((grade, index) => {
                    const course = student.courses.find(
                      (c) => c.id === grade.courseId
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-xs">
                          {course?.code}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${
                              grade.score >= 90
                                ? "text-green-600 dark:text-green-400"
                                : grade.score >= 80
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {grade.grade}
                          </span>
                        </TableCell>
                        <TableCell>{grade.score}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
