import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { motion } from "framer-motion";

const sessionData = [
  { name: "Jul", sessions: 32 },
  { name: "Aug", sessions: 45 },
  { name: "Sep", sessions: 38 },
  { name: "Oct", sessions: 55 },
  { name: "Nov", sessions: 67 },
  { name: "Dec", sessions: 72 },
  { name: "Jan", sessions: 80 },
  { name: "Feb", sessions: 91 },
  { name: "Mar", sessions: 104 },
  { name: "Apr", sessions: 112 },
  { name: "May", sessions: 120 },
  { name: "Jun", sessions: 128 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1035] border border-violet-500/30 rounded-lg p-3 shadow-xl">
        <p className="text-gray-200 font-semibold mb-1">{label}</p>
        <p className="text-violet-400 font-bold text-lg">{payload[0].value} sessions</p>
        <p className="text-gray-400 text-xs mt-1">
          {payload[0].value >= 100 ? "📈 High activity" : payload[0].value >= 60 ? "📊 Moderate" : "📉 Low activity"}
        </p>
      </div>
    );
  }
  return null;
};

const DecisionSessionsChart = () => {
  return (
    <motion.div
      className="bg-[#1a1035]/80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-violet-900/40 hover:border-violet-500/40 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
        Decision Sessions Over Time
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sessionData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d1f5e" opacity={0.5} />
            <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} tickLine={false}>
              <Label value="Months" offset={-10} position="insideBottom" style={{ fill: "#6b7280", fontSize: "12px" }} />
            </XAxis>
            <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} tickLine={false} axisLine={false}>
              <Label value="Sessions" angle={-90} position="insideLeft" style={{ fill: "#6b7280", fontSize: "12px" }} />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#8B5CF6"
              fill="url(#colorSessions)"
              strokeWidth={3}
              animationDuration={1500}
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DecisionSessionsChart;
