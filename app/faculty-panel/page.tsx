import CourseManagement from "@/components/faculty/CourseManagement";
import GradeManagement from "@/components/faculty/GradeManagement";
import PageHeader from "@/components/global/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const FacultyPanel = () => {
  return (
    <div className="p-4 space-y-3">
      <PageHeader
        title="Faculty Panel"
        subtitle="Manage courses, student assignments, and grades"
      />
      <Tabs defaultValue="course">
        <TabsList>
          <TabsTrigger value="course">Manage Course</TabsTrigger>
          <TabsTrigger value="grade">Manage Grades</TabsTrigger>
        </TabsList>
        <TabsContent value="course">
          <CourseManagement />
        </TabsContent>
        <TabsContent value="grade" className="space-y-4">
          <GradeManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyPanel;
