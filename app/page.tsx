import { CourseEnrollmentChart } from "@/components/dashboard/CourseEnrollmentChart";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DepartmentCoursesChart } from "@/components/dashboard/DepartmentCoursesChart";
import { GPADistributionChart } from "@/components/dashboard/GPADistributionChart";
import { PopularCoursesList } from "@/components/dashboard/PopularCoursesList";
import { TopStudentsTable } from "@/components/dashboard/TopStudentsTable";
import PageHeader from "@/components/global/PageHeader";
import { Course, Student } from "@/interface";
interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  totalFaculty: number;
  topStudents: Student[];
  popularCourses: Course[];
  courseEnrollmentData: Array<{ name: string; enrollment: number }>;
  gpaBins: Record<string, number>;
  departmentMap: Record<string, number>;
}

const getDashboardData = async (): Promise<DashboardData | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default async function Home() {
  const data = await getDashboardData();

  if (!data) {
    return <></>;
  }

  return (
    <div className="min-h-screen p-4 space-y-3">
      <PageHeader
        title="Academic Management Dashboard"
        subtitle="Manage students, courses, and faculty members with real-time analytics"
      />

      <div className="space-y-4">
        <DashboardHeader
          totalStudents={data.totalStudents || 0}
          totalCourses={data.totalCourses || 0}
          totalFaculty={data.totalFaculty || 0}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <TopStudentsTable students={data.topStudents || []} />
          <CourseEnrollmentChart data={data.courseEnrollmentData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <PopularCoursesList courses={data.popularCourses} />
          <GPADistributionChart gpaBins={data.gpaBins} />
          <DepartmentCoursesChart departmentMap={data.departmentMap} />
        </div>
      </div>
    </div>
  );
}
