import { Users, BookOpen, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardHeaderProps {
  totalStudents: number;
  totalCourses: number;
  totalFaculty: number;
}

export function DashboardHeader({
  totalStudents,
  totalCourses,
  totalFaculty,
}: DashboardHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                {totalStudents}
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-300 dark:text-blue-400 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {totalCourses}
              </p>
            </div>
            <BookOpen className="h-12 w-12 text-green-300 dark:text-green-400 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Faculty Members</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                {totalFaculty}
              </p>
            </div>
            <Briefcase className="h-12 w-12 text-purple-300 dark:text-purple-400 opacity-50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
