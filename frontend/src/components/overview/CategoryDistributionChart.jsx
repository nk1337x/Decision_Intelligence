import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from "recharts";
import { useState } from "react";

const DECISION_CATEGORY_DATA = [
  { name: "Prioritization", value: 38 },
  { name: "Architecture", value: 25 },
  { name: "Scope Definition", value: 20 },
  { name: "Resource Allocation", value: 12 },
  { name: "Risk Assessment", value: 5 },
];

const COLORS = ["#8B5CF6", "#A78BFA", "#7C3AED", "#6D28D9", "#C4B5FD"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#1a1035] border border-violet-500/30 rounded-lg p-3 shadow-xl">
        <p className="text-gray-200 font-semibold mb-1">{data.name}</p>
        <p className="text-violet-400 font-bold text-lg">{data.value}%</p>
        <p className="text-gray-400 text-xs mt-1">of all decisions</p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 10} outerRadius={outerRadius + 12} fill={fill} />
    </g>
  );
};

const CategoryDistributionChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <motion.div
      className="bg-[#1a1035]/80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-violet-900/40 hover:border-violet-500/40 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
        Decision Category Breakdown
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DECISION_CATEGORY_DATA}
              cx="50%"
              cy="45%"
              labelLine={false}
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              animationBegin={300}
              animationDuration={1200}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-sm font-bold">
                    {`${(percent * 100).toFixed(1)}%`}
                  </text>
                );
              }}
            >
              {DECISION_CATEGORY_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={activeIndex === index ? "#4C1D95" : "transparent"}
                  strokeWidth={activeIndex === index ? 3 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#9ca3af", paddingTop: "10px" }} iconType="circle" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;
