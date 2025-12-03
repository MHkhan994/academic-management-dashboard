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

interface DepartmentCoursesChartProps {
  departmentMap: Record<string, number>;
}

export function DepartmentCoursesChart({
  departmentMap,
}: DepartmentCoursesChartProps) {
  const { theme } = useTheme();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      fontFamily: "var(--font-sans)",
      background: "transparent",
    },
    colors: [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ],
    labels: Object.keys(departmentMap),
    legend: {
      labels: {
        colors: "var(--gray)",
      },
      position: "bottom",
      fontSize: "12px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    tooltip: {
      theme: theme,
      y: {
        formatter: (val: number) => `${val} courses`,
      },
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

  const chartSeries = Object.values(departmentMap);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Courses by Department
        </CardTitle>
        <CardDescription className="text-sm">
          Course distribution across departments
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={300}
        />
      </CardContent>
    </Card>
  );
}
