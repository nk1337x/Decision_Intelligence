import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeWithGemini = async (eventDetails, options, constraints, goals, priorities) => {
  try {
    // Use gemini-flash-latest (correct model name)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    const prompt = `You are an AI-powered Product Decision & Trade-off Intelligence System specialized in Event Planning.

EVENT DETAILS:
- Event Type: ${eventDetails.eventType || 'Not specified'}
- Expected Attendees: ${eventDetails.attendees || 'Not specified'}
- Theme: ${eventDetails.theme || 'Not specified'}

EVENT PLANNING OPTIONS:
${options.map((opt, idx) => `
Option ${idx + 1}: ${opt.name || `Option ${idx + 1}`}
- Venue: ${opt.venue || 'Not specified'}
- Layout: ${opt.layout || 'Not specified'}
- Decoration: ${opt.decoration || 'Not specified'}
- Setup: ${opt.setup || 'Not specified'}
`).join('\n')}

CONSTRAINTS:
- Budget: ${constraints.budget || 'Not specified'}
- Timeline: ${constraints.timeline || 'Not specified'}
- Resources: ${constraints.resources || 'Not specified'}
- Space Limitations: ${constraints.space || 'Not specified'}

GOALS:
${goals || 'Not specified'}

PRIORITIES (Weight 1-10):
- Cost: ${priorities.cost}/10
- Time: ${priorities.time}/10
- Quality: ${priorities.quality}/10
- Impact: ${priorities.impact}/10
- Risk: ${priorities.risk}/10

TASK:
Evaluate each option and provide scores (0-10) for:
1. Feasibility
2. Cost Efficiency
3. Time Efficiency
4. Space Utilization
5. Experience/Impact
6. Risk Score (higher = lower risk)

Then provide:
- Trade-off analysis comparing options
- Final recommendation with justification
- Confidence score (0-100%)

Respond ONLY with valid JSON in this exact format:
{
  "options": [
    {
      "optionId": 1,
      "optionName": "Option name",
      "scores": {
        "feasibility": 8.5,
        "costEfficiency": 7.0,
        "timeEfficiency": 8.0,
        "spaceUtilization": 7.5,
        "experience": 9.0,
        "riskScore": 8.0,
        "total": 8.0
      },
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"]
    }
  ],
  "tradeoffs": [
    {
      "type": "cost",
      "description": "Trade-off description"
    }
  ],
  "recommendation": {
    "selectedOptionId": 1,
    "selectedOptionName": "Option name",
    "justification": "Detailed justification",
    "tradeoffsAccepted": ["trade-off 1", "trade-off 2"]
  },
  "confidence": 92,
  "confidenceReason": "Reason for confidence level"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(jsonText);
    return analysis;

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to analyze with Gemini: ${error.message}`);
  }
};
