import { motion } from "framer-motion";
import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

const DECISIONS = [
  { id: 1, name: "API Gateway Migration", effort: 35, value: 90, category: "Architecture" },
  { id: 2, name: "AI Decision Engine", effort: 75, value: 95, category: "Prioritization" },
  { id: 3, name: "UI Redesign", effort: 40, value: 70, category: "Scope Definition" },
  { id: 4, name: "Auth Revamp", effort: 60, value: 80, category: "Architecture" },
  { id: 5, name: "Data Pipeline Opt.", effort: 50, value: 65, category: "Resource Allocation" },
  { id: 6, name: "Caching Layer", effort: 20, value: 60, category: "Architecture" },
  { id: 7, name: "Notification System", effort: 25, value: 55, category: "Scope Definition" },
  { id: 8, name: "ML Model Upgrade", effort: 80, value: 88, category: "Prioritization" },
  { id: 9, name: "Legacy DB Cleanup", effort: 70, value: 40, category: "Resource Allocation" },
  { id: 10, name: "Mobile App MVP", effort: 85, value: 72, category: "Scope Definition" },
  { id: 11, name: "CI/CD Automation", effort: 30, value: 78, category: "Architecture" },
  { id: 12, name: "Risk Dashboard", effort: 45, value: 82, category: "Risk Assessment" },
];

// Quadrant logic: effort < 50 = low effort, value >= 65 = high value
const getQuadrant = (effort, value) => {
  const highValue = value >= 65;
  const lowEffort = effort < 50;
  if (highValue && lowEffort) return { label: "Quick Wins", color: "#22C55E" };
  if (highValue && !lowEffort) return { label: "Strategic Bets", color: "#3B82F6" };
  if (!highValue && lowEffort) return { label: "Low Priority", color: "#F59E0B" };
  return { label: "Reconsider", color: "#EF4444" };
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const q = getQuadrant(d.effort, d.value);
    return (
      <div className="bg-gray-800 bg-opacity-95 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 shadow-xl min-w-[180px]">
        <p className="text-gray-200 font-semibold mb-1">{d.name}</p>
        <p className="text-xs text-gray-400 mb-2">{d.category}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Business Value:</span>
            <span className="text-blue-400 font-bold">{d.value}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Effort:</span>
            <span className="text-blue-400 font-bold">{d.effort}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Quadrant:</span>
            <span className="font-semibold" style={{ color: q.color }}>{q.label}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const quadrantLegend = [
  { label: "Quick Wins", color: "#22C55E", desc: "High value, Low effort" },
  { label: "Strategic Bets", color: "#3B82F6", desc: "High value, High effort" },
  { label: "Low Priority", color: "#F59E0B", desc: "Low value, Low effort" },
  { label: "Reconsider", color: "#EF4444", desc: "Low value, High effort" },
];

const PriorityMatrix = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 hover:border-blue-500/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          Decision Priority Matrix
        </h2>
        <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1.5 rounded-lg">
          Value vs. Implementation Effort
        </span>
      </div>

      {/* Quadrant Labels */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="text-center py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">⚡ Quick Wins (High Value / Low Effort)</div>
        <div className="text-center py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">🎯 Strategic Bets (High Value / High Effort)</div>
        <div className="text-center py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">⚠ Low Priority (Low Value / Low Effort)</div>
        <div className="text-center py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">✗ Reconsider (Low Value / High Effort)</div>
      </div>

      {/* Scatter Chart */}
      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="effort"
              name="Effort"
              domain={[0, 100]}
              stroke="#9CA3AF"
              tick={{ fill: "#D1D5DB", fontSize: 11 }}
              tickLine={false}
              label={{ value: "Implementation Effort →", position: "insideBottom", offset: -10, fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="value"
              name="Value"
              domain={[0, 100]}
              stroke="#9CA3AF"
              tick={{ fill: "#D1D5DB", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Business Value →", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 12 }}
            />
            {/* Midpoint reference lines to create 4 quadrants */}
            <ReferenceLine x={50} stroke="#4B5563" strokeDasharray="6 3" strokeWidth={1.5} />
            <ReferenceLine y={65} stroke="#4B5563" strokeDasharray="6 3" strokeWidth={1.5} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              data={DECISIONS}
              animationBegin={400}
              animationDuration={1200}
            >
              {DECISIONS.map((d, index) => {
                const { color } = getQuadrant(d.effort, d.value);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    fillOpacity={hovered === d.id ? 1 : 0.8}
                    stroke={hovered === d.id ? "#fff" : color}
                    strokeWidth={hovered === d.id ? 2 : 1}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {quadrantLegend.map((q) => (
          <div key={q.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: q.color }} />
            <span className="text-xs text-gray-400">
              <span className="font-medium" style={{ color: q.color }}>{q.label}</span>
              {" — "}
              {q.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Decision List */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {DECISIONS.map((d) => {
          const { color, label } = getQuadrant(d.effort, d.value);
          return (
            <motion.div
              key={d.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 bg-gray-900/40 rounded-lg px-3 py-2 border border-gray-700/40 cursor-default"
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <div className="min-w-0">
                <p className="text-xs text-gray-200 font-medium truncate">{d.name}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PriorityMatrix;
