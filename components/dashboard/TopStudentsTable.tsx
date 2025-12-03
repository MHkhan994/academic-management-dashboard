import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Student } from "@/interface";

interface TopStudentsTableProps {
  students: Student[];
}

export function TopStudentsTable({ students }: TopStudentsTableProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top-Ranking Students</CardTitle>
        <CardDescription>Sorted by GPA</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>GPA</TableHead>
              <TableHead>Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-green-600 dark:text-green-400 font-semibold">
                  {student.gpa.toFixed(2)}
                </TableCell>
                <TableCell>{student.enrollmentYear}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
