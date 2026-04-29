import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#8B5CF6", "#A78BFA", "#7C3AED", "#6D28D9"];

const TRADEOFF_DATA = [
  { name: "Technical Feasibility", value: 87 },
  { name: "Business Value", value: 74 },
  { name: "Timeline Impact", value: 61 },
  { name: "Resource Cost", value: 53 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1035] border border-violet-500/30 rounded-lg p-3 shadow-xl">
        <p className="text-gray-200 font-semibold mb-1">{payload[0].payload.name}</p>
        <p className="text-violet-400 font-bold text-lg">{payload[0].value} score</p>
      </div>
    );
  }
  return null;
};

const TradeoffImpactChart = () => {
  return (
    <motion.div
      className="bg-[#1a1035]/80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-violet-900/40 hover:border-violet-500/40 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      whileHover={{ y: -2 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
        Trade-off Impact by Dimension
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={TRADEOFF_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {TRADEOFF_DATA.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d1f5e" opacity={0.5} />
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} tickLine={false} />
            <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139, 92, 246, 0.1)" }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={80} animationDuration={1000} animationBegin={300}>
              {TRADEOFF_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#colorGradient${index})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TradeoffImpactChart;
