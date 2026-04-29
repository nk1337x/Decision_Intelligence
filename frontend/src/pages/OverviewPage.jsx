import { motion } from "framer-motion";
import {
  Activity,
  Layers,
  GitCompare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  BarChart2,
} from "lucide-react";

import Header from "../components/common/Header";
import DecisionSessionsChart from "../components/overview/AlertOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import TradeoffImpactChart from "../components/overview/AlertSourcesChart";

const OverviewPage = () => {
  const stats = [
    { name: "Decision Sessions", value: 128, icon: Activity, color: "violet", bgColor: "bg-violet-950/40", border: "border-violet-800/40" },
    { name: "Options Evaluated", value: 512, icon: Layers, color: "purple", bgColor: "bg-purple-950/40", border: "border-purple-800/40" },
    { name: "Trade-offs Documented", value: 340, icon: GitCompare, color: "indigo", bgColor: "bg-indigo-950/40", border: "border-indigo-800/40" },
    { name: "Avg. Decision Score", value: "87%", icon: TrendingUp, color: "violet", bgColor: "bg-violet-900/30", border: "border-violet-600/40" },
    { name: "High-Priority Decisions", value: 14, icon: AlertTriangle, color: "red", bgColor: "bg-red-950/30", border: "border-red-700/40" },
    { name: "Approved Decisions", value: 98, icon: CheckCircle, color: "violet", bgColor: "bg-violet-900/30", border: "border-violet-600/40" },
    { name: "Pending Review", value: 7, icon: Clock, color: "purple", bgColor: "bg-purple-950/40", border: "border-purple-800/40" },
    { name: "Constraints Flagged", value: 23, icon: XCircle, color: "red", bgColor: "bg-red-950/30", border: "border-red-700/40" },
  ];

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#0f0a1e]">
      <Header title="DecisionAI Dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-4"
        >
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium shadow-lg shadow-violet-900/40">
            <Plus className="w-5 h-5" />
            New Decision Session
          </button>
          <button className="bg-[#1a1035] hover:bg-violet-950/60 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all border border-violet-800/50 font-medium">
            <BarChart2 className="w-5 h-5" />
            View Trade-offs
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`${stat.bgColor} rounded-xl p-5 border ${stat.border} backdrop-blur-md shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <h3 className="text-gray-400 text-sm font-medium">{stat.name}</h3>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DecisionSessionsChart />
          <CategoryDistributionChart />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <TradeoffImpactChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
