
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalyticsDonutChartProps {
  data: { name: string; value: number; color: string }[];
  width?: number;
  height?: number;
}

const AnalyticsDonutChart: React.FC<AnalyticsDonutChartProps> = ({
  data,
  width = 230,
  height = 230,
}) => {
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 text-sm gap-3 w-full max-w-xs mx-auto">
        {data.map((item) => (
          <span key={item.name} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.color }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDonutChart;
