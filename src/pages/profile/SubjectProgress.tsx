
import React from "react";

const SubjectProgress = ({
  subject,
  progress,
  onClick,
}: {
  subject: string;
  progress: number;
  onClick?: () => void;
}) => (
  <div className="group" tabIndex={0} onClick={onClick} onKeyDown={e => { if (e.key === 'Enter') onClick?.(); }} role={onClick ? "button" : undefined}>
    <div className="flex justify-between items-center mb-0.5">
      <span className="text-sm">{subject}</span>
      <span className="text-xs font-medium">{Math.round(progress * 100)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full animate-fade-in"
        style={{ width: `${progress * 100}%`, transition: "width 1s cubic-bezier(.4,2,.3,1)" }}
      />
    </div>
  </div>
);

export default SubjectProgress;
