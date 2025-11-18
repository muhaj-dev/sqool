import React from "react";

interface MultiLevelProgressBarProps {
  completionPercent: number;
}

const MultiLevelProgressBar: React.FC<MultiLevelProgressBarProps> = ({ completionPercent }) => {
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col w-full bg-[#F8F8FD] px-2 py-4 rounded-md">
      <div className="flex items-center justify-between">
        <p>Performer </p>
        <div className="text-[#26A4FF] flex items-center gap-1">
          <div className="h-3 w-3 rounded-md bg-[#26A4FF]" />
          <span>{`${completionPercent}%`}</span>
        </div>
      </div>
      <div className="flex">
        {levels.map((level) => {
          const sectionCompletion = 20;
          const remainder = completionPercent % 20;
          const isCompleted = completionPercent >= level * 20;
          return (
            <div
              key={level}
              className={`flex items-center justify-center h-4 border border-gray-300,
            ${isCompleted && "bg-[#26A4FF] text-white"}`}
              style={{ width: `${sectionCompletion}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MultiLevelProgressBar;
