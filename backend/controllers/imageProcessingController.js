import { generateWithImage } from '../services/geminiGenerateService.js';
import { generateMultipleLayouts } from '../services/imageGenerationService.js';
import { getLayoutImages, hasPredefinedImages } from '../services/layoutImageMappingService.js';

/**
 * Generate layout variations based on venue image and event planning data
 */
export const generateLayouts = async (req, res) => {
  try {
    const { eventData, analysisResult } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    if (!eventData || !analysisResult) {
      return res.status(400).json({
        success: false,
        message: 'Event data and analysis result are required'
      });
    }

    const parsedEventData = JSON.parse(eventData);
    const parsedAnalysisResult = JSON.parse(analysisResult);

    // Convert image buffer to base64
    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Create prompt for Gemini
    const prompt = `
You are an expert event planner and venue layout designer. Analyze the provided venue image and generate 3 optimized layout variations.

**Event Details:**
- Event Type: ${parsedEventData.eventType}
- Attendees: ${parsedEventData.attendees}
- Theme: ${parsedEventData.theme || 'Not specified'}
- Budget: ${parsedEventData.budget}
- Timeline: ${parsedEventData.timeline}
- Resources: ${parsedEventData.resources}
- Space Limitations: ${parsedEventData.space || 'None specified'}
- Goals: ${parsedEventData.goals}

**Previous Analysis Results:**
${parsedAnalysisResult.options.map((opt, idx) => `
Option ${idx + 1}: ${opt.name}
- Venue: ${opt.venue}
- Layout: ${opt.layout}
- Decoration: ${opt.decoration}
- Setup: ${opt.setup}
`).join('\n')}

**Recommended Option:** ${parsedAnalysisResult.recommendation.selectedOptionName}
**Reason:** ${parsedAnalysisResult.recommendation.justification}

**Task:**
1. Analyze the venue image carefully:
   - Identify the space type (indoor/outdoor, dimensions, shape)
   - Note any architectural features, columns, windows, doors
   - Assess lighting conditions
   - Identify any existing furniture or fixtures
   - Estimate capacity based on visible space
   - Note any limitations or constraints

2. Generate 3 distinct layout variations that:
   - Align with the event type and goals
   - Accommodate the number of attendees
   - Work within the identified space constraints
   - Incorporate the recommended option's concepts
   - Are realistic and implementable
   - Consider traffic flow, accessibility, and safety

3. For each layout provide:
   - A descriptive name
   - Detailed description of the layout arrangement
   - 3-5 key features that make this layout effective
   - 2-4 trade-offs or considerations

4. Recommend the best layout with clear reasoning

**Output Format (JSON):**
{
  "venueAnalysis": {
    "spaceType": "description of space (e.g., 'Large indoor hall with high ceilings')",
    "capacity": "estimated capacity (e.g., '200-250 people')",
    "features": "key features (e.g., 'Natural lighting, hardwood floors, stage area')",
    "limitations": "any constraints (e.g., 'Fixed columns in center, limited electrical outlets')"
  },
  "layouts": [
    {
      "name": "Layout name",
      "description": "Detailed description of the layout arrangement",
      "keyFeatures": ["feature 1", "feature 2", "feature 3"],
      "tradeoffs": ["tradeoff 1", "tradeoff 2"]
    }
  ],
  "recommendation": {
    "selectedLayout": "Name of recommended layout",
    "reason": "Detailed explanation of why this layout is best"
  }
}

Ensure all outputs are realistic, constraint-aware, and clearly explained. Be specific about spatial arrangements.
`;

    // Call Gemini API with image
    const result = await generateWithImage(prompt, imageBase64, mimeType);

    // Check if we have predefined images for this event type
    const usePredefinedImages = hasPredefinedImages(parsedEventData.eventType);
    
    if (usePredefinedImages) {
      console.log('✅ Using predefined layout images for:', parsedEventData.eventType);
      result.layouts = getLayoutImages(result.layouts, parsedEventData.eventType);
    } else {
      // No predefined images - use Pollinations.ai to generate them (FREE!)
      console.log('🎨 No predefined images found. Generating with Pollinations.ai (FREE)...');
      console.log('⚠️  Note: Pollinations can be slow (30-90 seconds per image)');
      
      try {
        const generatedImages = await generateMultipleLayouts(
          result.layouts,
          result.venueAnalysis.spaceType,
          parsedEventData.eventType
        );

        // Map generated images to layouts
        result.layouts = result.layouts.map((layout, index) => ({
          ...layout,
          imageBuffer: generatedImages[index]?.imageBuffer || null,
          imageUrl: generatedImages[index]?.imageUrl || null,
          usePredefinedImage: false,
          aiGenerated: true
        }));

        console.log('✅ Layout images generated successfully with Pollinations.ai');
      } catch (error) {
        console.error('⚠️ Failed to generate layout images:', error.message);
        
        // Provide helpful error message
        let errorMessage = 'Image generation failed';
        if (error.message.includes('timeout')) {
          errorMessage = 'Image generation timed out. Pollinations.ai is slow right now. Please try again or use predefined images.';
        } else if (error.message.includes('Rate limit')) {
          errorMessage = 'Pollinations.ai is busy. Please wait a moment and try again.';
        } else if (error.message.includes('unavailable')) {
          errorMessage = 'Pollinations.ai service temporarily unavailable. Please try again.';
        }
        
        result.layouts = result.layouts.map(layout => ({
          ...layout,
          imageUrl: null,
          usePredefinedImage: false,
          error: errorMessage
        }));
        
        console.log('💡 Tip: Add predefined images to frontend/public/layout-images/ for instant, reliable results');
      }
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error generating layouts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate layouts',
      error: error.message
    });
  }
};
