import { generateOptionsWithGroq } from '../services/geminiGenerateService.js';
import EventPlanning from '../models/EventPlanning.js';

export const generateEventOptions = async (req, res) => {
  try {
    const { eventDetails, constraints, goals, priorities } = req.body;

    // Validate input
    if (!eventDetails || !eventDetails.eventType) {
      return res.status(400).json({
        success: false,
        message: 'Event type is required'
      });
    }

    // Use Groq AI to generate options (faster and better free tier)
    const analysis = await generateOptionsWithGroq(eventDetails, constraints, goals, priorities);

    // Save to MongoDB
    const eventPlanning = new EventPlanning({
      eventDetails,
      constraints,
      goals,
      priorities,
      options: analysis.options,
      tradeoffs: analysis.tradeoffs,
      recommendation: analysis.recommendation,
      confidence: analysis.confidence,
      confidenceReason: analysis.confidenceReason
    });

    await eventPlanning.save();
    console.log('✅ Event planning saved to MongoDB:', eventPlanning._id);

    res.json({
      success: true,
      data: analysis,
      savedId: eventPlanning._id
    });

  } catch (error) {
    console.error('Error generating event options:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating event options',
      error: error.message
    });
  }
};
