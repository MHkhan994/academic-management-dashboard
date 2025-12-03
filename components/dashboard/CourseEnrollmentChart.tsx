"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CourseEnrollmentChartProps {
  data: Array<{ name: string; enrollment: number }>;
}

export function CourseEnrollmentChart({ data }: CourseEnrollmentChartProps) {
  const { theme } = useTheme();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      fontFamily: "var(--font-sans)",
      background: "transparent",
    },
    colors: ["var(--chart-2)", "var(--chart-3)", "var(--chart-4)"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        fontSize: "12px",
        colors: ["var(--chart-1)"],
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} students`,
      },
      theme: theme,
    },
    xaxis: {
      categories: data.map((item) => item.name),
      title: {
        text: "Courses",
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      title: {
        text: "Enrollment Count",
        style: {
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: "var(--border)",
    },
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
      name: "Enrollment",
      data: data.map((item) => item.enrollment),
    },
  ];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="gap-0">
        <CardTitle className="text-lg font-semibold">
          Course Enrollment
        </CardTitle>
        <CardDescription className="text-sm">
          Student enrollment by course
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={300}
        />
      </CardContent>
    </Card>
  );
}
