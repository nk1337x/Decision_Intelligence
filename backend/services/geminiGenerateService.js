import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateOptionsWithGroq = async (eventDetails, constraints, goals, priorities) => {
  try {
    const prompt = `You are an AI-powered Event Planning Expert. Generate 3 creative and practical event planning options based on the requirements below.

EVENT DETAILS:
- Event Type: ${eventDetails.eventType || 'Not specified'}
- Expected Attendees: ${eventDetails.attendees || 'Not specified'}
- Theme: ${eventDetails.theme || 'Not specified'}

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
Generate 3 distinct event planning options. For each option, provide:
1. Option Name (creative and descriptive)
2. Venue Details (specific venue type and characteristics)
3. Layout Plan (detailed seating/space arrangement)
4. Decoration Style (theme, colors, elements)
5. Setup Approach (logistics, timeline, team requirements)

Then evaluate each option with scores (0-10) for:
- Feasibility
- Cost Efficiency
- Time Efficiency
- Space Utilization
- Experience/Impact
- Risk Score (higher = lower risk)

Finally provide:
- Trade-off analysis comparing the 3 options
- Best recommendation with justification
- Confidence score (0-100%)

Respond ONLY with valid JSON in this exact format:
{
  "options": [
    {
      "optionId": 1,
      "name": "Option name",
      "venue": "Detailed venue description",
      "layout": "Detailed layout plan",
      "decoration": "Detailed decoration style",
      "setup": "Detailed setup approach",
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

    console.log('🚀 Generating with Groq (llama-3.3-70b)...');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert event planning AI assistant. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
      max_tokens: 8192,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(jsonText);
    console.log('✅ Groq generation successful');
    return analysis;

  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(`Failed to generate options with Groq: ${error.message}`);
  }
};

export const generateOptionsWithGemini = async (eventDetails, constraints, goals, priorities) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    const prompt = `You are an AI-powered Event Planning Expert. Generate 3 creative and practical event planning options based on the requirements below.

EVENT DETAILS:
- Event Type: ${eventDetails.eventType || 'Not specified'}
- Expected Attendees: ${eventDetails.attendees || 'Not specified'}
- Theme: ${eventDetails.theme || 'Not specified'}

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
Generate 3 distinct event planning options. For each option, provide:
1. Option Name (creative and descriptive)
2. Venue Details (specific venue type and characteristics)
3. Layout Plan (detailed seating/space arrangement)
4. Decoration Style (theme, colors, elements)
5. Setup Approach (logistics, timeline, team requirements)

Then evaluate each option with scores (0-10) for:
- Feasibility
- Cost Efficiency
- Time Efficiency
- Space Utilization
- Experience/Impact
- Risk Score (higher = lower risk)

Finally provide:
- Trade-off analysis comparing the 3 options
- Best recommendation with justification
- Confidence score (0-100%)

Respond ONLY with valid JSON in this exact format:
{
  "options": [
    {
      "optionId": 1,
      "name": "Option name",
      "venue": "Detailed venue description",
      "layout": "Detailed layout plan",
      "decoration": "Detailed decoration style",
      "setup": "Detailed setup approach",
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

    // Extract JSON from response
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
    throw new Error(`Failed to generate options with Gemini: ${error.message}`);
  }
};

export const generateWithImage = async (prompt, imageBase64, mimeType) => {
  try {
    // Use gemini-flash-latest which supports vision
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response with better error handling
    let jsonText = text.trim();
    
    // Remove markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    // Remove any trailing commas before closing brackets (common JSON error)
    jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
    
    // Try to find JSON object if there's extra text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Problematic JSON:', jsonText.substring(0, 500));
      throw new Error(`Invalid JSON response from Gemini: ${parseError.message}`);
    }
    
    return analysis;

  } catch (error) {
    console.error('Gemini Image API Error:', error);
    throw new Error(`Failed to generate with image: ${error.message}`);
  }
};
