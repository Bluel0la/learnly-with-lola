
import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: number | null;
  deltaLabel?: string;
  accentColor?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  delta,
  deltaLabel,
  accentColor = "blue",
  className = "",
}) => {
  const getDeltaSymbol = () => {
    if (delta == null) return "—";
    if (delta > 0) return <span className="text-green-600 mr-1">▲</span>;
    if (delta < 0) return <span className="text-red-500 mr-1">▼</span>;
    return <span className="text-muted-foreground mr-1">—</span>;
  };
  const getDeltaClass = () => {
    if (delta == null) return "text-muted-foreground";
    if (delta > 0) return "text-green-600";
    if (delta < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div
      className={`rounded-xl shadow-md p-4 lg:p-6 bg-gradient-to-br from-${accentColor}-50 to-${accentColor}-100 text-${accentColor}-900 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-${accentColor}-500 text-xs font-medium mb-1 flex items-center gap-1`}>
            {icon} {label}
          </p>
          <p className="text-2xl lg:text-3xl font-bold">{value}</p>
          {typeof delta !== "undefined" && (
            <p className={`mt-2 text-xs font-semibold flex items-center ${getDeltaClass()}`}>
              {getDeltaSymbol()} {Math.abs(delta ?? 0)} {deltaLabel}
            </p>
          )}
        </div>
        <div className={`h-8 w-8 opacity-70 flex items-center`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
