import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  AlertCircle,
  CheckCircle,
  MapPin,
  Layout,
  Palette,
  Settings,
  PieChart,
  BarChart2,
  Activity,
  TrendingUp,
  ArrowRight,
  Image,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-violet-500 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}/10
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function EventPlanningVisualization({ analysisResult }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOption, setSelectedOption] = useState(0);
  const navigate = useNavigate();

  // Prevent scroll restoration on tab change
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  if (!analysisResult) return null;

  const { options, recommendation, tradeoffs, confidence, confidenceReason } = analysisResult;

  // Find the recommended option
  const recommendedOption = options.find(
    (opt) => opt.name === recommendation.selectedOptionName
  );

  // Colors for charts
  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
  const OPTION_COLORS = ['#8b5cf6', '#ec4899', '#f59e0b'];

  // Prepare data for score comparison chart
  const scoreComparisonData = options.map((option) => ({
    name: option.name,
    total: option.scores.total,
    feasibility: option.scores.feasibility,
    costEfficiency: option.scores.costEfficiency,
    timeEfficiency: option.scores.timeEfficiency,
    spaceUtilization: option.scores.spaceUtilization,
    experience: option.scores.experience,
    riskScore: option.scores.riskScore,
  }));

  // Prepare data for pie chart (selected option scores breakdown)
  const selectedOptionData = options[selectedOption];
  const pieChartData = [
    { name: 'Feasibility', value: selectedOptionData.scores.feasibility },
    { name: 'Cost Efficiency', value: selectedOptionData.scores.costEfficiency },
    { name: 'Time Efficiency', value: selectedOptionData.scores.timeEfficiency },
    { name: 'Space Utilization', value: selectedOptionData.scores.spaceUtilization },
    { name: 'Experience', value: selectedOptionData.scores.experience },
  ];

  // Prepare data for radar chart
  const radarData = [
    {
      metric: 'Feasibility',
      ...options.reduce((acc, opt, idx) => ({ ...acc, [`Option ${idx + 1}`]: opt.scores.feasibility }), {})
    },
    {
      metric: 'Cost',
      ...options.reduce((acc, opt, idx) => ({ ...acc, [`Option ${idx + 1}`]: opt.scores.costEfficiency }), {})
    },
    {
      metric: 'Time',
      ...options.reduce((acc, opt, idx) => ({ ...acc, [`Option ${idx + 1}`]: opt.scores.timeEfficiency }), {})
    },
    {
      metric: 'Space',
      ...options.reduce((acc, opt, idx) => ({ ...acc, [`Option ${idx + 1}`]: opt.scores.spaceUtilization }), {})
    },
    {
      metric: 'Experience',
      ...options.reduce((acc, opt, idx) => ({ ...acc, [`Option ${idx + 1}`]: opt.scores.experience }), {})
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-2">
          Event Planning Analysis Results
        </h2>
        <p className="text-gray-400">AI-generated options with interactive visualizations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-4 flex-wrap py-4">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          <Award size={20} />
          Overview
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setActiveTab("charts")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === "charts"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          <BarChart2 size={20} />
          Charts
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setActiveTab("comparison")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            activeTab === "comparison"
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          <Activity size={20} />
          Comparison
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Recommended Option Highlight */}
          {recommendedOption && (
            <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 rounded-2xl p-6 border-2 border-violet-500 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-yellow-400" size={32} />
                <div>
                  <h3 className="text-2xl font-bold text-white">Recommended Option</h3>
                  <p className="text-violet-300">{recommendedOption.name}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-violet-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Venue</p>
                      <p className="text-white">{recommendedOption.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Layout className="text-violet-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Layout</p>
                      <p className="text-white">{recommendedOption.layout}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Palette className="text-violet-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Decoration</p>
                      <p className="text-white">{recommendedOption.decoration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Settings className="text-violet-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Setup</p>
                      <p className="text-white">{recommendedOption.setup}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-300 leading-relaxed">{recommendation.justification}</p>
              </div>
            </div>
          )}

          {/* All Options Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {options.map((option, index) => {
              const isRecommended = option.name === recommendation.selectedOptionName;
              
              return (
                <div
                  key={index}
                  className={`bg-gray-800 rounded-xl p-6 border-2 transition-all hover:scale-105 cursor-pointer ${
                    isRecommended
                      ? "border-violet-500 shadow-lg shadow-violet-500/20"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setSelectedOption(index)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{option.name}</h3>
                    {isRecommended && (
                      <Award className="text-yellow-400" size={24} />
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Venue</p>
                      <p className="text-white text-sm">{option.venue}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Layout</p>
                      <p className="text-white text-sm">{option.layout}</p>
                    </div>
                  </div>

                  {/* Score Bars */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Total Score</span>
                      <span className="text-violet-400 font-bold">{option.scores.total}/10</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(option.scores.total / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confidence Score */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">Confidence Score</h3>
              </div>
              <div className="text-3xl font-bold text-green-400">{confidence}%</div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all flex items-center justify-end pr-2"
                style={{ width: `${confidence}%` }}
              >
                <CheckCircle size={16} className="text-white" />
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">{confidenceReason}</p>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === "charts" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Option Selector */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-3">Select an option to view detailed breakdown:</p>
            <div className="flex gap-3 flex-wrap">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setSelectedOption(index)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedOption === index
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pie Chart - Score Breakdown */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="text-violet-400" size={24} />
              <h3 className="text-xl font-bold text-white">
                Score Breakdown - {selectedOptionData.name}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <RechartsPie>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - All Options Comparison */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <BarChart2 className="text-violet-400" size={24} />
              <h3 className="text-xl font-bold text-white">Total Score Comparison</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBar data={scoreComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="total" fill="#8b5cf6" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </RechartsBar>
            </ResponsiveContainer>
          </div>

          {/* Area Chart - Detailed Metrics */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-violet-400" size={24} />
              <h3 className="text-xl font-bold text-white">Detailed Metrics Comparison</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={scoreComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="feasibility" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="costEfficiency" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                <Area type="monotone" dataKey="timeEfficiency" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Area type="monotone" dataKey="experience" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === "comparison" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Radar Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-violet-400" size={24} />
              <h3 className="text-xl font-bold text-white">Multi-Dimensional Comparison</h3>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#9ca3af" />
                <Radar name="Option 1" dataKey="Option 1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Radar name="Option 2" dataKey="Option 2" stroke="#ec4899" fill="#ec4899" fillOpacity={0.5} />
                <Radar name="Option 3" dataKey="Option 3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Score Table */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 overflow-x-auto">
            <h3 className="text-xl font-bold text-white mb-6">Detailed Score Matrix</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3 text-gray-400 font-semibold">Metric</th>
                  {options.map((option, index) => (
                    <th key={index} className="pb-3 text-center text-gray-400 font-semibold">
                      {option.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['feasibility', 'costEfficiency', 'timeEfficiency', 'spaceUtilization', 'experience', 'riskScore'].map((metric) => (
                  <tr key={metric} className="border-b border-gray-700/50">
                    <td className="py-3 text-white capitalize">
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    {options.map((option, index) => {
                      const value = option.scores[metric];
                      const isHighest = Math.max(...options.map(o => o.scores[metric])) === value;
                      return (
                        <td key={index} className="py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                            isHighest ? 'bg-violet-500 text-white' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {value}/10
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-violet-500">
                  <td className="py-3 text-white font-bold">Total Score</td>
                  {options.map((option, index) => {
                    const isHighest = Math.max(...options.map(o => o.scores.total)) === option.scores.total;
                    return (
                      <td key={index} className="py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-bold text-lg ${
                          isHighest ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {option.scores.total}/10
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Trade-offs Analysis */}
          {tradeoffs && tradeoffs.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-orange-400" size={24} />
                <h3 className="text-xl font-bold text-white">Trade-offs Analysis</h3>
              </div>
              <div className="space-y-3">
                {tradeoffs.map((tradeoff, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-all"
                  >
                    <div className="bg-orange-500/20 rounded-full p-2 mt-0.5">
                      <span className="text-orange-400 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-300 flex-1">{tradeoff.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Navigate to Image Processing Button */}
      <div className="mt-8 text-center space-y-4">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => navigate('/image-processing')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
        >
          <Image size={24} />
          <span>Visualize with Venue Image</span>
          <ArrowRight size={20} />
        </button>
        
        <p className="text-gray-400 text-sm">
          Upload your venue image to generate optimized layout variations
        </p>
      </div>
    </div>
  );
}
