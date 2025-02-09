import React from "react";

const StatCard = ({ title, value, change, period }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-400">
      <h3 className="text-sm text-gray-600 mb-4">{title}</h3>
      <div className="text-2xl font-semibold text-gray-800 mb-2">{value}</div>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-emerald-600">{change}</span>
        <span className="text-xs text-gray-700">{period}</span>
      </div>
    </div>
  );
};

export default StatCard;
