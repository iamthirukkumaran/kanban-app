// components/StatsBar.js
import React from "react";

const StatItem = ({ label, count, isLast }) => (
  <div className={`flex-1 text-center transition-transform duration-300 hover:-translate-y-1 relative ${
    !isLast ? 'after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-10 after:bg-gradient-to-b after:from-transparent after:via-gray-300 after:to-transparent' : ''
  }`}>
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold text-gray-900 drop-shadow-sm bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
        {count}
      </span>
      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
      </span>
    </div>
  </div>
);

const StatsBar = ({ columns, taskCounts }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-1 mb-4 backdrop-blur-sm ">
      <div className="flex justify-between gap-4">
        {columns.map((col, index) => (
          <StatItem
            key={col}
            label={col}
            count={taskCounts[col]}
            isLast={index === columns.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsBar;