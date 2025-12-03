import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course } from "@/interface";
import { Users } from "lucide-react";

interface PopularCoursesListProps {
  courses: Course[];
}

export function PopularCoursesList({ courses }: PopularCoursesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Popular Courses</CardTitle>
        <CardDescription>Sorted by enrollment count</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
          >
            <div>
              <p className="font-semibold text-sm">{course.code}</p>
              <p className="text-xs text-muted-foreground">
                {course.name.substring(0, 40)}...
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{course.enrollment}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
