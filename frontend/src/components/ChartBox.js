import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function ChartBox({data}) {
  return (
    <LineChart width={250} height={150} data={data}>
      <XAxis dataKey="name"/>
      <YAxis/>
      <Tooltip/>
      <Line dataKey="value" stroke="#6366f1"/>
    </LineChart>
  );
}