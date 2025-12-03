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

interface GPADistributionChartProps {
  gpaBins: Record<string, number>;
}

export function GPADistributionChart({ gpaBins }: GPADistributionChartProps) {
  const { theme } = useTheme();

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "pie",
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
      "var(--chart-6)",
    ],
    labels: Object.keys(gpaBins),
    legend: {
      labels: {
        colors: "var(--gray)",
      },
      position: "bottom",
      fontSize: "12px",
    },
    tooltip: {
      theme: (theme as "dark" | "light") || "dark",
      y: {
        formatter: (val: number) => `${val} students`,
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

  const chartSeries = Object.values(gpaBins);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          GPA Distribution
        </CardTitle>
        <CardDescription className="text-sm">
          Student distribution by GPA range
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="pie"
          height={300}
        />
      </CardContent>
    </Card>
  );
}
