
import React from "react";

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  highlightBg = "from-white to-blue-50",
  onClick,
}: {
  icon?: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  highlightBg?: string;
  onClick?: () => void;
}) => (
  <div
    className={`flex flex-col p-4 rounded-xl bg-gradient-to-br ${highlightBg} shadow hover:scale-105 transition-transform cursor-pointer animate-fade-in`}
    tabIndex={0}
    onClick={onClick}
    onKeyDown={e => { if (e.key === 'Enter') onClick?.(); }}
    role={onClick ? "button" : undefined}
    aria-pressed="false"
  >
    <div className="flex items-center gap-2 mb-1">{icon}{value && <span className="text-xl font-bold">{value}</span>}</div>
    <div className="text-gray-600 font-semibold">{title}</div>
    {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
  </div>
);

export default StatCard;
