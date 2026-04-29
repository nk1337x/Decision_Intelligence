import { createContext, useContext, useState } from "react";

const EventDataContext = createContext(null);

export const EventDataProvider = ({ children }) => {
  const [eventPlanningData, setEventPlanningData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const storeEventData = (data) => {
    setEventPlanningData(data);
    // Also store in localStorage as backup
    localStorage.setItem("eventPlanningData", JSON.stringify(data));
  };

  const storeAnalysisResult = (result) => {
    setAnalysisResult(result);
    // Also store in localStorage as backup
    localStorage.setItem("analysisResult", JSON.stringify(result));
  };

  const getEventData = () => {
    if (eventPlanningData) return eventPlanningData;
    // Try to get from localStorage
    const stored = localStorage.getItem("eventPlanningData");
    if (stored) {
      const data = JSON.parse(stored);
      setEventPlanningData(data);
      return data;
    }
    return null;
  };

  const getAnalysisResult = () => {
    if (analysisResult) return analysisResult;
    // Try to get from localStorage
    const stored = localStorage.getItem("analysisResult");
    if (stored) {
      const data = JSON.parse(stored);
      setAnalysisResult(data);
      return data;
    }
    return null;
  };

  const clearEventData = () => {
    setEventPlanningData(null);
    setAnalysisResult(null);
    localStorage.removeItem("eventPlanningData");
    localStorage.removeItem("analysisResult");
  };

  return (
    <EventDataContext.Provider
      value={{
        eventPlanningData,
        analysisResult,
        storeEventData,
        storeAnalysisResult,
        getEventData,
        getAnalysisResult,
        clearEventData,
      }}
    >
      {children}
    </EventDataContext.Provider>
  );
};

export const useEventData = () => {
  const context = useContext(EventDataContext);
  if (!context) {
    throw new Error("useEventData must be used within an EventDataProvider");
  }
  return context;
};
