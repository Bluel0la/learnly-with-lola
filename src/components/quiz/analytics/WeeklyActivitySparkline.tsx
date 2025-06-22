
import React from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

interface WeeklyActivitySparklineProps {
  data: { day: string; count: number }[];
}

const WeeklyActivitySparkline: React.FC<WeeklyActivitySparklineProps> = ({ data }) => (
  <div className="h-56 flex items-center">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Bar dataKey="count" fill="#38bdf8" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default WeeklyActivitySparkline;
