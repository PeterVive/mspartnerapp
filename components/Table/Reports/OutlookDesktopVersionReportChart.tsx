import type { Contract } from "@microsoft/microsoft-graph-types-beta";
import { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

type ReportChartProps = {
  report: any;
  tenant: Contract;
};

export default function OutlookDesktopVersionReportChart({
  report,
  tenant,
}: ReportChartProps) {
  const [chartData, setChartData] = useState<any>();
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Unique users by Outlook desktop version",
      },
    },
  };

  const chartBarData = {
    chartLabels,
    datasets: [
      {
        label: "test",
        data: chartData,
      },
    ],
  };

  useMemo(() => {
    console.log(chartLabels);
    console.log("HUAHU");
    if (report && report.length > 0) {
      console.log("UES");
      if (chartLabels.length == 0) {
        console.log("AHUSDHM");
        Object.keys(report[0]).forEach((key) => {
          console.log("KEY");
          setChartLabels([...chartLabels, key]);
        });
        console.log(chartLabels);
        setChartData([
          report[0]["Outlook M365"],
          report[0]["Outlook 2019"],
          report[0]["Outlook 2016"],
          report[0]["Outlook 2013"],
          report[0]["Outlook 2010"],
          report[0]["Outlook 2007"],
          report[0]["Undetermined"],
        ]);
      }
    }
  }, [report, chartLabels]);

  return <Bar options={options} data={chartBarData} />;
}
