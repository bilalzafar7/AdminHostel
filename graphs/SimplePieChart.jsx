import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { samplePieData } from "@/utils/constants";

export default function SimplePieChart({ data }) {
    const chartData = data ? data : samplePieData;
    const colorPalette = ["#E8AA33AA", "#E8AA66CC", "#E8AA66FF", "#E8AA88", "#E8AA99"];

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={200}
          fill="#8884d8"
        >
          {chartData.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={colorPalette[index%colorPalette.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
