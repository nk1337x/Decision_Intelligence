import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import ChatbotAnimation from "../../assets/lottie/Chatbot.json";
import { Send, Sparkles, BarChart3, ArrowRight, Image } from "lucide-react";
import EventPlanningVisualization from "../components/EventPlanningVisualization";
import { useEventData } from "../context/EventDataContext";
import { useNavigate } from "react-router-dom";

function ChatBotWindow() {
  const backend_url = "http://localhost:5000";
  const [isTyping, setIsTyping] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    eventType: "",
    attendees: "",
    theme: "",
    options: [],
    budget: "",
    timeline: "",
    resources: "",
    space: "",
    goals: "",
    priorities: { cost: 5, time: 5, quality: 5, impact: 5, risk: 5 },
  });
  const [currentOption, setCurrentOption] = useState({
    name: "",
    venue: "",
    layout: "",
    decoration: "",
    setup: "",
  });
  const [optionCount, setOptionCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPrioritySliders, setShowPrioritySliders] = useState(false);
  const [tempPriorities, setTempPriorities] = useState({
    cost: 5,
    time: 5,
    quality: 5,
    impact: 5,
    risk: 5,
  });
  const inputRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Add context and navigation
  const { storeEventData, storeAnalysisResult } = useEventData();
  const navigate = useNavigate();

  // Scroll to bottom only when needed
  useEffect(() => {
    if (chatContainerRef.current && shouldAutoScroll) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, shouldAutoScroll]);

  // Keep input focused and prevent auto-scroll when typing
  const handleInputFocus = () => {
    setShouldAutoScroll(false);
  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
    setShouldAutoScroll(false); // Disable auto-scroll while typing
  };

  // Initial greeting with typing animation
  useEffect(() => {
    // First message
    setTimeout(() => {
      addMessage(
        "bot",
        "Hi! 👋 I'm your AI Event Planning Assistant. I'll help you design the perfect event by understanding your needs and generating customized planning options for you!",
        true
      );
    }, 500);

    // Second message
    setTimeout(() => {
      addMessage(
        "bot",
        "Let's start! What type of event are you planning? (e.g., tech fest, Birthday Party, Wedding, Corporate Event)",
        true
      );
    }, 4000);
  }, []);

  const addMessage = useCallback((sender, message, shouldType = false) => {
    if (shouldType && sender === "bot") {
      // Add empty message first
      setChatHistory((prev) => [...prev, { sender, message: "", isTyping: true }]);
      
      // Type character by character
      let currentIndex = 0;
      const typingSpeed = 20; // milliseconds per character
      
      const typeInterval = setInterval(() => {
        if (currentIndex <= message.length) {
          const currentText = message.substring(0, currentIndex);
          setChatHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = {
              sender,
              message: currentText,
              isTyping: currentIndex < message.length,
            };
            return newHistory;
          });
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          // Auto-focus input after bot finishes typing
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 100);
        }
      }, typingSpeed);
    } else {
      setChatHistory((prev) => [...prev, { sender, message, isTyping: false }]);
    }
  }, []);

  const addBotMessage = (text, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage("bot", text, true); // Enable typing animation
      // Auto-focus input after bot message is queued
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, text.length * 20 + 200); // Wait for typing to complete
    }, delay);
  };

  const handleMessageChange = (e) => {
    handleInputChange(e);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      // Prevent blur and keep focus
      e.target.focus();
    }
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    const inputElement = inputRef.current;
    
    addMessage("user", userMessage, false);
    processUserInput(userMessage);
    setUserMessage("");
    setShouldAutoScroll(true);
    
    // Multiple attempts to keep focus
    if (inputElement) {
      inputElement.focus();
      
      // Try again after state update
      setTimeout(() => {
        inputElement.focus();
      }, 10);
      
      // And once more for good measure
      requestAnimationFrame(() => {
        inputElement.focus();
      });
    }
  };

  const handlePrioritySubmit = () => {
    setShowPrioritySliders(false);
    const finalData = { ...eventData, priorities: tempPriorities };
    setEventData(finalData);
    
    addMessage("user", `Priorities set:\n• Cost: ${tempPriorities.cost}/10\n• Time: ${tempPriorities.time}/10\n• Quality: ${tempPriorities.quality}/10\n• Impact: ${tempPriorities.impact}/10\n• Risk: ${tempPriorities.risk}/10`, false);
    
    addBotMessage(`🎉 Perfect! I have all the information I need. Let me generate event planning options for you using AI...`, 800);
    setTimeout(() => analyzeWithAI(finalData), 1500);
    setCurrentStep(10);
  };
  
  const handleNavigateToImageProcessing = () => {
    navigate("/image-processing");
  };

  const processUserInput = (input) => {
    const trimmedInput = input.trim();

    switch (currentStep) {
      case 1: // Event Type
        setEventData((prev) => ({ ...prev, eventType: trimmedInput }));
        addBotMessage(`Great! A ${trimmedInput} sounds exciting. How many attendees are you expecting?`);
        setCurrentStep(2);
        break;

      case 2: // Attendees
        setEventData((prev) => ({ ...prev, attendees: trimmedInput }));
        addBotMessage(`Perfect! ${trimmedInput} attendees. Do you have a specific theme in mind? (or type 'skip' if none)`);
        setCurrentStep(3);
        break;

      case 3: // Theme
        const theme = trimmedInput.toLowerCase() === "skip" ? "" : trimmedInput;
        setEventData((prev) => ({ ...prev, theme }));
        addBotMessage(`Great! Now let's talk about constraints. What's your budget? (e.g., "Low", "Medium", "High", or "$50,000")`);
        setCurrentStep(4);
        break;

      case 4: // Budget
        setEventData((prev) => ({ ...prev, budget: trimmedInput }));
        addBotMessage(`Got it! What's your timeline for preparation? (e.g., "2 weeks", "1 month")`);
        setCurrentStep(5);
        break;

      case 5: // Timeline
        setEventData((prev) => ({ ...prev, timeline: trimmedInput }));
        addBotMessage(`Understood! What resources do you have available? (e.g., "Team of 10", "Limited materials")`);
        setCurrentStep(6);
        break;

      case 6: // Resources
        setEventData((prev) => ({ ...prev, resources: trimmedInput }));
        addBotMessage(`Thanks! Any space limitations? (e.g., "5000 sq ft", "Outdoor only", or type 'none')`);
        setCurrentStep(7);
        break;

      case 7: // Space
        const space = trimmedInput.toLowerCase() === "none" ? "" : trimmedInput;
        setEventData((prev) => ({ ...prev, space }));
        addBotMessage(`Almost done! What are your main goals? (e.g., "Minimize cost, maximize experience")`);
        setCurrentStep(8);
        break;

      case 8: // Goals
        setEventData((prev) => ({ ...prev, goals: trimmedInput }));
        addBotMessage(`Excellent! Now, let's set your priorities using interactive sliders. Please adjust the sliders below based on what's most important to you! 🎚️`, 800);
        setTimeout(() => {
          setShowPrioritySliders(true);
        }, 1200);
        setCurrentStep(9);
        break;

      case 9: // Priorities - handled by slider submission
        // This case is now handled by handlePrioritySubmit
        break;

      case 10: // After analysis
        if (trimmedInput.toLowerCase().includes("restart")) {
          window.location.reload();
        } else {
          addBotMessage(`Type 'restart' to start a new analysis!`);
        }
        break;

      default:
        break;
    }
  };

  const analyzeWithAI = async (data) => {
    setIsAnalyzing(true);

    try {
      const response = await axios.post(
        `${backend_url}/api/event-planning/generate`,
        {
          eventDetails: {
            eventType: data.eventType,
            attendees: data.attendees,
            theme: data.theme,
          },
          constraints: {
            budget: data.budget,
            timeline: data.timeline,
            resources: data.resources,
            space: data.space,
          },
          goals: data.goals,
          priorities: data.priorities,
        }
      );

      const result = response.data;

      if (result.success) {
        const analysis = result.data;
        
        // Store the analysis result for visualization
        setAnalysisResult(analysis);
        
        // Store in context for image processing page
        storeEventData(data);
        storeAnalysisResult(analysis);

        // Display all 3 generated options with typing animation
        setTimeout(() => {
          addMessage("bot", `✨ I've generated 3 event planning options for you! Check out the detailed visualizations below. 📊`, true);
        }, 1000);

        // Simple completion message
        const completionDelay = 2000;
        setTimeout(() => {
          addMessage(
            "bot",
            `🎉 Analysis complete! Scroll down to explore:\n\n📊 Interactive charts and comparisons\n🏆 My recommendation with detailed reasoning\n⚖️ Trade-offs analysis\n🎯 Confidence score: ${analysis.confidence}%\n\n💡 Want to visualize these layouts with your venue image? Click the button below!`,
            true
          );
          setCurrentStep(14);
        }, completionDelay);
      } else {
        addMessage(
          "bot",
          "Sorry, there was an error generating options. Please try again.",
          true
        );
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage(
        "bot",
        "Oops! I couldn't connect to the AI service. Make sure the backend is running.",
        true
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-6">
          <div className="text-4xl tracking-wider">
            <span className="bg-gradient-to-tr from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Hi, I'm Your Event Planning Assistant
            </span>
          </div>
          <p className="text-sm mt-2 text-gray-400">Let me help you find the perfect event planning solution</p>
        </div>

        <div className="relative w-full max-w-2xl">
          {isAnalyzing && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
              <div className="flex flex-col items-center p-8 rounded-2xl bg-gray-800 bg-opacity-80 shadow-lg border border-gray-700">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-violet-500 bg-opacity-20 rounded-full animate-ping absolute inset-0"></div>
                  <div className="w-20 h-20 flex items-center justify-center relative">
                    <div className="w-16 h-16 border-4 border-gray-700 border-t-violet-500 border-r-violet-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BarChart3 size={24} className="text-violet-400" />
                    </div>
                  </div>
                </div>
                <p className="text-white font-medium text-lg">Analyzing Options</p>
                <div className="flex space-x-1 mt-1 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
                <p className="text-gray-300 text-sm mt-1 max-w-xs text-center">AI is evaluating your event planning options...</p>
              </div>
            </div>
          )}

          <Player autoplay loop src={ChatbotAnimation} className="w-28 h-28 mx-auto mb-2" />

          <div className="bg-gray-800 shadow-lg rounded-3xl w-full overflow-hidden transition-all duration-300 border border-gray-700">
            <div className="p-4 flex justify-between items-center bg-gray-700 border-b border-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-violet-500 mr-2 animate-pulse"></div>
                <p className="font-medium">Event Planning Bot</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-violet-400" />
                <span className="text-xs text-gray-400">AI Powered</span>
              </div>
            </div>

            <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 flex flex-col space-y-4">
              {chatHistory
                .filter((chat) => chat.message.length > 0) // Only show messages with content
                .map((chat, index) => (
                  <div key={index} className={`p-4 rounded-2xl max-w-[80%] ${chat.sender === "user" ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white self-end shadow-md" : "bg-gray-700 self-start"}`}>
                    <div className="leading-relaxed whitespace-pre-line">
                      {chat.message}
                      {chat.isTyping && (
                        <span className="inline-block w-1 h-4 bg-violet-400 ml-1 animate-pulse"></span>
                      )}
                    </div>
                  </div>
                ))}
              
              {/* Interactive Priority Sliders */}
              {showPrioritySliders && (
                <div className="bg-gray-700 rounded-2xl p-6 w-full shadow-lg border border-violet-500/30">
                  <h3 className="text-lg font-semibold text-violet-300 mb-4 flex items-center gap-2">
                    <Sparkles size={20} />
                    Set Your Priorities
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">Drag the sliders to set importance (1-10)</p>
                  
                  <div className="space-y-5">
                    {Object.keys(tempPriorities).map((key) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-300 capitalize flex items-center gap-2">
                            {key === 'cost' && '💰'}
                            {key === 'time' && '⏱️'}
                            {key === 'quality' && '⭐'}
                            {key === 'impact' && '🎯'}
                            {key === 'risk' && '🛡️'}
                            {key}
                          </label>
                          <span className="text-violet-400 font-bold text-lg min-w-[3ch] text-right">
                            {tempPriorities[key]}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={tempPriorities[key]}
                          onChange={(e) =>
                            setTempPriorities({
                              ...tempPriorities,
                              [key]: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-violet"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(tempPriorities[key] - 1) * 11.11}%, #4b5563 ${(tempPriorities[key] - 1) * 11.11}%, #4b5563 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handlePrioritySubmit}
                    className="w-full mt-6 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Submit Priorities
                  </button>
                </div>
              )}
              
              {isTyping && (
                <div className="p-4 rounded-2xl max-w-[80%] bg-gray-700 self-start">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-700 border-t border-gray-600">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-400 mr-4"
                  type="text"
                  value={userMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={(e) => {
                    // Prevent blur unless clicking outside chat area
                    e.preventDefault();
                    e.target.focus();
                  }}
                  placeholder="Type your answer..."
                  disabled={isTyping || isAnalyzing}
                  autoFocus
                />
                <button
                  className="p-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || isTyping || isAnalyzing}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      {analysisResult && (
        <EventPlanningVisualization analysisResult={analysisResult} />
      )}
    </div>
  );
}

export default function ChatbotEventPlanningPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1e]">
      <ChatBotWindow />
    </div>
  );
}
