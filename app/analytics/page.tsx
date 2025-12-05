"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, TrendingUp, Users, Award, Calendar } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Types
interface EnrollmentTrend {
  month: string;
  enrollments: number;
}

interface TopStudent {
  id: string;
  name: string;
  email: string;
  courseName: string;
  courseCode: string;
  grade: string;
  score: number;
  rank: number;
}

export default function AnalyticsPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  // Fetch enrollment trends
  const { data: trends } = useQuery<EnrollmentTrend[]>({
    queryKey: ["analytics", "enrollments"],
    queryFn: () =>
      axios.get("/api/analytics/enrollments").then((r) => r.data.data),
  });

  // Fetch top students
  const { data: topStudents = [] } = useQuery<TopStudent[]>({
    queryKey: ["analytics", "top-students", selectedCourse],
    queryFn: () =>
      axios
        .get(`/api/analytics/top-students?course=${selectedCourse}`)
        .then((r) => r.data.data),
  });

  // Fetch all courses for filter
  const { data: courses = [] } = useQuery<any[]>({
    queryKey: ["courses"],
    queryFn: () => axios.get("/api/courses?limit=100").then((r) => r.data.data),
  });

  // CSV Export: Enrollment Trends
  const exportEnrollmentTrends = () => {
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

  // CSV Export: Top Students
  const exportTopStudents = () => {
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
      `top-students-${
        selectedCourse === "all"
          ? "institute"
          : courses.find((c) => c.id === selectedCourse)?.code || ""
      }-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-6 space-y-6">
      <PageHeader
        title="Analytics & Reporting"
        subtitle="Track enrollment trends and student performance across the institute"
        buttons={
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={exportEnrollmentTrends}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Trends
            </Button>
            <Button variant="outline" size="sm" onClick={exportTopStudents}>
              <Download className="h-4 w-4 mr-2" />
              Export Top Students
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="enrollments" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="enrollments" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Enrollment Trends
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <Award className="h-4 w-4" />
            Top Performers
          </TabsTrigger>
        </TabsList>

        {/* Enrollment Trends */}
        <TabsContent value="enrollments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Course Enrollment Over Time
              </CardTitle>
              <CardDescription>
                Monthly enrollment count across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))" }}
                      name="Enrollments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Performing Students */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Performing Students
                  </CardTitle>
                  <CardDescription>
                    Highest scoring students per course or across the institute
                  </CardDescription>
                </div>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Courses (Institute-wide)
                    </SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        No grades recorded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    topStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-bold text-lg">
                          #{student.rank}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.courseName}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.courseCode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {student.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {student.score.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
