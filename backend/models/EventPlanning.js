import mongoose from 'mongoose';

const eventPlanningSchema = new mongoose.Schema({
  // Event Details
  eventDetails: {
    eventType: String,
    attendees: String,
    theme: String
  },
  
  // Constraints
  constraints: {
    budget: String,
    timeline: String,
    resources: String,
    space: String
  },
  
  // Goals and Priorities
  goals: String,
  priorities: {
    cost: Number,
    time: Number,
    quality: Number,
    impact: Number,
    risk: Number
  },
  
  // AI Generated Options
  options: [mongoose.Schema.Types.Mixed],
  
  // Trade-offs and Recommendation
  tradeoffs: [mongoose.Schema.Types.Mixed],
  
  recommendation: mongoose.Schema.Types.Mixed,
  
  confidence: Number,
  confidenceReason: String,
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

export default mongoose.model('EventPlanning', eventPlanningSchema);
