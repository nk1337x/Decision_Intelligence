import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";
import Header from "../components/common/Header";

const EventPlanningPage = () => {
  const [eventDetails, setEventDetails] = useState({
    eventType: "",
    attendees: "",
    theme: "",
  });

  const [options, setOptions] = useState([
    { id: 1, name: "", venue: "", layout: "", decoration: "", setup: "" },
  ]);

  const [constraints, setConstraints] = useState({
    budget: "",
    timeline: "",
    resources: "",
    space: "",
  });

  const [goals, setGoals] = useState("");
  const [priorities, setPriorities] = useState({
    cost: 5,
    time: 5,
    quality: 5,
    impact: 5,
    risk: 5,
  });

  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addOption = () => {
    setOptions([
      ...options,
      {
        id: options.length + 1,
        name: "",
        venue: "",
        layout: "",
        decoration: "",
        setup: "",
      },
    ]);
  };

  const removeOption = (id) => {
    if (options.length > 1) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const updateOption = (id, field, value) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const analyzeOptions = async () => {
    setIsAnalyzing(true);

    try {
      const response = await fetch('http://localhost:5000/api/event-planning/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventDetails,
          options,
          constraints,
          goals,
          priorities,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults({
          options: data.data.options,
          recommendation: data.data.recommendation,
          confidence: data.data.confidence,
          tradeoffs: data.data.tradeoffs,
        });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error analyzing options:', error);
      alert('Failed to analyze options. Make sure the backend server is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTradeoffs = (evaluatedOptions) => {
    if (evaluatedOptions.length < 2) return [];

    const tradeoffs = [];
    const best = evaluatedOptions[0];
    const second = evaluatedOptions[1];

    if (best.scores.costEfficiency < second.scores.costEfficiency) {
      tradeoffs.push(
        `${best.name || "Top option"} sacrifices cost efficiency for better overall performance`
      );
    }

    if (best.scores.timeEfficiency < second.scores.timeEfficiency) {
      tradeoffs.push(
        `${best.name || "Top option"} requires more setup time but delivers higher quality`
      );
    }

    if (best.scores.riskScore < second.scores.riskScore) {
      tradeoffs.push(
        `${best.name || "Top option"} has slightly higher risk but better experience`
      );
    }

    return tradeoffs;
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-[#0f0a1e]">
      <Header title="Event Planning Decision Intelligence" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Event Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1035] rounded-xl p-6 border border-violet-800/40 mb-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-violet-400" />
            Event Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Event Type
              </label>
              <input
                type="text"
                placeholder="e.g., Wedding, Tech Fest, Cultural"
                value={eventDetails.eventType}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, eventType: e.target.value })
                }
                className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Expected Attendees
              </label>
              <input
                type="number"
                placeholder="e.g., 500"
                value={eventDetails.attendees}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, attendees: e.target.value })
                }
                className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Theme (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Modern, Traditional"
                value={eventDetails.theme}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, theme: e.target.value })
                }
                className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Event Planning Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1035] rounded-xl p-6 border border-violet-800/40 mb-6 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-violet-400" />
              Event Planning Options
            </h2>
            <button
              onClick={addOption}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>

          <div className="space-y-4">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="bg-[#0f0a1e] border border-violet-700/30 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-violet-300">
                    Option {index + 1}
                  </h3>
                  {options.length > 1 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Option Name"
                    value={option.name}
                    onChange={(e) =>
                      updateOption(option.id, "name", e.target.value)
                    }
                    className="bg-[#1a1035] border border-violet-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Venue Details"
                    value={option.venue}
                    onChange={(e) =>
                      updateOption(option.id, "venue", e.target.value)
                    }
                    className="bg-[#1a1035] border border-violet-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Layout Plan"
                    value={option.layout}
                    onChange={(e) =>
                      updateOption(option.id, "layout", e.target.value)
                    }
                    className="bg-[#1a1035] border border-violet-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Decoration Style"
                    value={option.decoration}
                    onChange={(e) =>
                      updateOption(option.id, "decoration", e.target.value)
                    }
                    className="bg-[#1a1035] border border-violet-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Setup Approach"
                    value={option.setup}
                    onChange={(e) =>
                      updateOption(option.id, "setup", e.target.value)
                    }
                    className="bg-[#1a1035] border border-violet-700/40 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500 md:col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Constraints Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1035] rounded-xl p-6 border border-violet-800/40 mb-6 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-violet-400" />
            Constraints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget
              </label>
              <input
                type="text"
                placeholder="e.g., Low, Medium, High, or $50,000"
                value={constraints.budget}
                onChange={(e) =>
                  setConstraints({ ...constraints, budget: e.target.value })
                }
                className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeline
              </label>
              <input
                type="text"
                placeholder="e.g., 2 weeks, 1 month"
                value={constraints.timeline}
                onChange={(e) =>
                  setConstraints({ ...constraints, timeline: e.target.value })
                }
                className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Resources
              </label>
              <input
                type="text"
                placeholder="e.g., Team of 10, Limited materials"
                value={constraints.resources}
                onChange={(e) =>
                  setConstraints({ ...constraints, resources: e.target.value })
                }
                className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Space Limitations
              </label>
              <input
                type="text"
                placeholder="e.g., 5000 sq ft, Outdoor only"
                value={constraints.space}
                onChange={(e) =>
                  setConstraints({ ...constraints, space: e.target.value })
                }
                className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Goals and Priorities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1035] rounded-xl p-6 border border-violet-800/40 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-violet-400" />
              Goals
            </h2>
            <textarea
              placeholder="e.g., Minimize cost, maximize experience, fast setup, high aesthetic appeal, crowd comfort"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={5}
              className="w-full bg-[#0f0a1e] border border-violet-700/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 resize-none"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1a1035] rounded-xl p-6 border border-violet-800/40 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-violet-400" />
              Priorities (Weight: 1-10)
            </h2>
            <div className="space-y-3">
              {Object.keys(priorities).map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-400 capitalize">
                      {key}
                    </label>
                    <span className="text-violet-400 font-semibold">
                      {priorities[key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={priorities[key]}
                    onChange={(e) =>
                      setPriorities({
                        ...priorities,
                        [key]: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-[#0f0a1e] rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-6"
        >
          <button
            onClick={analyzeOptions}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg flex items-center gap-3 transition-all font-semibold text-lg shadow-lg shadow-violet-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-6 h-6" />
                Analyze & Recommend
              </>
            )}
          </button>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Evaluation Results */}
            <div className="bg-[#1a1035] rounded-xl p-6 border border-violet-800/40 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-violet-400" />
                Event Options Evaluation
              </h2>
              <div className="space-y-4">
                {results.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`bg-[#0f0a1e] border rounded-lg p-4 ${
                      index === 0
                        ? "border-violet-500 shadow-lg shadow-violet-900/30"
                        : "border-violet-700/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {index === 0 && (
                          <CheckCircle className="w-5 h-5 text-violet-400" />
                        )}
                        {option.name || `Option ${index + 1}`}
                      </h3>
                      <span className="text-2xl font-bold text-violet-400">
                        {option.scores.total}/10
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-[#1a1035] rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Feasibility</p>
                        <p className="text-lg font-semibold text-white">
                          {option.scores.feasibility}/10
                        </p>
                      </div>
                      <div className="bg-[#1a1035] rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">
                          Cost Efficiency
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {option.scores.costEfficiency}/10
                        </p>
                      </div>
                      <div className="bg-[#1a1035] rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">
                          Time Efficiency
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {option.scores.timeEfficiency}/10
                        </p>
                      </div>
                      <div className="bg-[#1a1035] rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">
                          Space Utilization
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {option.scores.spaceUtilization}/10
                        </p>
                      </div>
                      <div className="bg-[#1a1035] rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">
                          Experience/Impact
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {option.scores.experience}/10
                        </p>
                      </div>
                      <div className="bg-[#1a1035] rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Risk Score</p>
                        <p className="text-lg font-semibold text-white">
                          {option.scores.riskScore}/10
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade-off Analysis */}
            <div className="bg-[#1a1035] rounded-xl p-6 border border-violet-800/40 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-violet-400" />
                Trade-off Analysis
              </h2>
              <div className="space-y-3">
                {results.tradeoffs.length > 0 ? (
                  results.tradeoffs.map((tradeoff, index) => (
                    <div
                      key={index}
                      className="bg-[#0f0a1e] border border-violet-700/30 rounded-lg p-4 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">{tradeoff}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">
                    No significant trade-offs identified between options.
                  </p>
                )}
              </div>
            </div>

            {/* Final Recommendation */}
            <div className="bg-gradient-to-br from-violet-950/60 to-purple-950/60 rounded-xl p-6 border border-violet-600/50 backdrop-blur-md shadow-xl shadow-violet-900/30">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-7 h-7 text-violet-400" />
                Final Recommendation
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Selected Option</p>
                  <p className="text-2xl font-bold text-violet-300">
                    {results.recommendation.name || "Option 1"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Justification</p>
                  <p className="text-gray-300">
                    This option achieves the highest weighted score of{" "}
                    <span className="text-violet-400 font-semibold">
                      {results.recommendation.scores.total}/10
                    </span>{" "}
                    based on your priorities. It balances feasibility, cost,
                    time, space utilization, experience, and risk management
                    effectively.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Trade-offs Accepted
                  </p>
                  <p className="text-gray-300">
                    {results.tradeoffs.length > 0
                      ? results.tradeoffs[0]
                      : "Minimal trade-offs - this option excels across all metrics."}
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-violet-700/30">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      Confidence Score
                    </p>
                    <p className="text-3xl font-bold text-violet-400">
                      {results.confidence}%
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-[#0f0a1e] rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${results.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default EventPlanningPage;
