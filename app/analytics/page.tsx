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
import { Download, TrendingUp, Award, Calendar } from "lucide-react";
import PageHeader from "@/components/global/PageHeader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { YearPicker } from "@/components/ui/year-picker";
import { Label } from "@/components/ui/label";
import { Course, EnrollmentTrend, TopStudent } from "@/interface";
import { exportEnrollmentTrends, exportTopStudents } from "@/lib/utils";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedYear, setselectedYear] = useState(2023);
  const { theme } = useTheme();

  const { data: trends } = useQuery<EnrollmentTrend[]>({
    queryKey: ["analytics", "enrollments", selectedYear],
    queryFn: () =>
      axios
        .get(`/api/analytics/enrollments?year=${selectedYear}`)
        .then((r) => r.data.data),
  });

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 380,
      toolbar: { show: true },
      background: "transparent",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    colors: ["#3b82f6"],
    xaxis: {
      categories: trends?.map((t) => t.month),
      title: { text: "Month" },
    },
    yaxis: {
      title: { text: "New Enrollments" },
      min: 0,
    },
    tooltip: {
      x: { format: "MMM yyyy" },
      y: { formatter: (val) => `${val} students` },
    },
    title: {
      text: `Student Enrollment Trend - ${selectedYear}`,
      align: "center",
      style: { fontSize: "18px", fontWeight: "bold" },
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
    theme: {
      mode: (theme as "dark" | "light") || "dark",
      palette: "palette4",
      monochrome: {
        enabled: false,
        color: "var(--chart-3)",
        shadeTo: (theme as "dark" | "light") || "dark",
        shadeIntensity: 0.65,
      },
    },
  };

  const chartSeries = [
    {
      name: "Enrollments",
      data: trends?.map((t) => t.enrollments),
    },
  ];

  const { data: topStudents = [] } = useQuery<TopStudent[]>({
    queryKey: ["analytics", "top-students", selectedCourse],
    queryFn: async () => {
      const res = await axios.get(
        `/api/analytics/top-students?course=${selectedCourse}`
      );
      console.log(res);
      return res.data?.data;
    },
    enabled: !!selectedCourse,
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: () => axios.get("/api/courses?limit=100").then((r) => r.data.data),
  });

  return (
    <main className="p-4 space-y-3">
      <PageHeader
        title="Analytics & Reporting"
        subtitle="Track enrollment trends and student performance across the institute"
        buttons={
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportEnrollmentTrends(trends)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Trends
            </Button>
            {selectedCourse && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  exportTopStudents(
                    topStudents,
                    courses.find((c) => c.id === selectedCourse)?.code || ""
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Export Top Students
              </Button>
            )}
          </div>
        }
      />

      <Tabs defaultValue="enrollments">
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
            <CardHeader className="flex flex-wrap gap-2 justify-between items-center flex-row">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Course Enrollment Over Time
                </CardTitle>
                <CardDescription>
                  Monthly enrollment count across all courses
                </CardDescription>
              </div>
              <div className="space-y-2">
                <Label>Select Year</Label>
                <YearPicker value={selectedYear} onChange={setselectedYear} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <Chart
                  options={chartOptions}
                  series={chartSeries as any}
                  type="area"
                  height="100%"
                  width="100%"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Performing Students */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 items-center justify-between">
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
