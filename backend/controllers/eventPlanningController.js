import { analyzeWithGemini } from '../services/geminiService.js';

export const analyzeEventOptions = async (req, res) => {
  try {
    const { eventDetails, options, constraints, goals, priorities } = req.body;

    // Validate input
    if (!options || options.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one event planning option is required'
      });
    }

    // Use Gemini AI for analysis
    const analysis = await analyzeWithGemini(eventDetails, options, constraints, goals, priorities);

    // Map Gemini response to match frontend expectations
    const evaluatedOptions = analysis.options.map((opt, index) => ({
      ...options[index],
      id: options[index].id,
      scores: opt.scores,
      strengths: opt.strengths,
      weaknesses: opt.weaknesses
    }));

    // Sort by total score
    evaluatedOptions.sort((a, b) => b.scores.total - a.scores.total);

    res.json({
      success: true,
      data: {
        options: evaluatedOptions,
        recommendation: {
          ...evaluatedOptions[0],
          justification: analysis.recommendation.justification,
          tradeoffsAccepted: analysis.recommendation.tradeoffsAccepted
        },
        tradeoffs: analysis.tradeoffs.map(t => t.description || t),
        confidence: analysis.confidence,
        confidenceReason: analysis.confidenceReason
      }
    });

  } catch (error) {
    console.error('Error analyzing event options:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing event options',
      error: error.message
    });
  }
};
