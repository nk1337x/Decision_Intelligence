import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import eventPlanningRoutes from './routes/eventPlanning.js';
import eventPlanningGenerateRoutes from './routes/eventPlanningGenerate.js';
import imageProcessingRoutes from './routes/imageProcessing.js';
import layoutVisualizationRoutes from './routes/layoutVisualization.js';
import chatHistoryRoutes from './routes/chatHistory.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/event-planning', eventPlanningRoutes);
app.use('/api/event-planning', eventPlanningGenerateRoutes);
app.use('/api/image-processing', imageProcessingRoutes);
app.use('/api/layout-visualization', layoutVisualizationRoutes);
app.use('/api/chat-history', chatHistoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DecisionAI Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
