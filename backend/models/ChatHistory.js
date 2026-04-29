import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  // Session Info
  sessionId: { type: String, required: true, index: true },
  
  // Messages
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Event Planning Reference (if applicable)
  eventPlanningId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventPlanning' },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now }
});

// Index for faster queries
chatHistorySchema.index({ sessionId: 1, lastMessageAt: -1 });

export default mongoose.model('ChatHistory', chatHistorySchema);
