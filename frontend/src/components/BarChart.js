import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({
  className,
  data,
  title,
  isHorizontal = false,
  height = "300px",
  showLegend = true,
  valueFormatter = (value) => `${value.toLocaleString()}L`,
}) => {
  const defaultOptions = {
    indexAxis: isHorizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: "#fff",
    scales: {
      [isHorizontal ? "x" : "y"]: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
          drawBorder: false,
        },
        ticks: {
          font: {
            family:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
          },
          color: "#86868b",
          padding: 10,
          callback: valueFormatter,
        },
        title: {
          display: false,
        },
      },
      [isHorizontal ? "y" : "x"]: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
          },
          color: "#86868b",
          padding: 10,
        },
      },
    },
    plugins: {
      legend: {
        display: showLegend,
        position: "top",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            family:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          family:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 13,
        },
        bodyFont: {
          family:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${valueFormatter(context.raw)}`;
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: {
          [isHorizontal ? "topRight" : "topLeft"]: 6,
          [isHorizontal ? "bottomRight" : "topRight"]: 6,
          [isHorizontal ? "topLeft" : "bottomLeft"]: 0,
          [isHorizontal ? "bottomLeft" : "bottomRight"]: 0,
        },
        borderSkipped: false,
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
  };
  //apply variable classname to the div
  return (
    <div className={`${className}`} style={{ height }}>
      {title && <h3 className="text-gray-600 text-lg mb-4">{title}</h3>}
      <Bar data={data} options={defaultOptions} />
    </div>
  );
};

export default BarChart;
