import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StackedLineChart = ({ data }) => {
  const chartData = data
    ? data
    : [
        {
          name: 'Page A',
          uv: 590,
          pv: 800,
          amt: 1400,
        },
        {
          name: 'Page B',
          uv: 868,
          pv: 967,
          amt: 1506,
        },
        {
          name: 'Page C',
          uv: 1397,
          pv: 1098,
          amt: 989,
        },
        {
          name: 'Page D',
          uv: 1480,
          pv: 1200,
          amt: 1228,
        },
        {
          name: 'Page E',
          uv: 1520,
          pv: 1108,
          amt: 1100,
        },
        {
          name: 'Page F',
          uv: 1400,
          pv: 680,
          amt: 1700,
        },
      ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={500}
        height={400}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* Specify Line components for each data key */}
        <Line type="monotone" dataKey="uv" stroke="#E8AA33" />
        <Line type="monotone" dataKey="pv" stroke="#E8AA99" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StackedLineChart;
