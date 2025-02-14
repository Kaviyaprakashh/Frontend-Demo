import React from "react";
import { BarChartProps } from "../../@Types/ComponentProps";
import ReactApexChart from "react-apexcharts";

export default function CommonAreaChart({
  series,
  color,
  xtitle,
  ytitle,
}: BarChartProps) {
  const options: any = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: color ?? ["var(--COLOR_PRIMARY)"],
    plotOptions: {
      bar: {
        borderRadius: 5,
        dataLabels: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      title: {
        text: xtitle ?? "Month",
        style: {
          colors: "var(--COLOR_THEME_BLACK)",
          fontSize: "11px",
          fontFamily: "var(--FONT_POPPINS_MEDIUM)",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      labels: {
        style: {
          colors: "var(--COLOR_THEME_BLACK)",
          fontSize: "11px",
          fontFamily: "var(--FONT_POPPINS_MEDIUM)",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      position: "bottom",

      //   axisTicks: {
      //     show: false,
      //   },

      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      title: {
        text: ytitle ?? "Order Count",
        style: {
          colors: "var(--COLOR_THEME_BLACK)",
          fontSize: "11px",
          fontFamily: "var(--FONT_POPPINS_MEDIUM)",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      labels: {
        style: {
          colors: "var(--COLOR_THEME_BLACK)",
          fontSize: "11px",
          fontFamily: "var(--FONT_POPPINS_MEDIUM)",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
}
