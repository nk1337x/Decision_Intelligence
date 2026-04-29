import { generateLayoutVisualization, generateMultipleLayouts } from '../services/imageGenerationService.js';

/**
 * Generate visual layout images for the analyzed layouts
 */
export const generateLayoutImages = async (req, res) => {
  try {
    const { layouts, venueType, eventType } = req.body;

    if (!layouts || !Array.isArray(layouts) || layouts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Layouts array is required'
      });
    }

    // Generate images for all layouts
    const results = await generateMultipleLayouts(layouts, venueType, eventType);

    // Convert buffers to base64 for sending to frontend
    const imagesData = results.map(result => ({
      layoutName: result.layoutName,
      imageUrl: result.imageUrl,
      imageBase64: result.imageBuffer.toString('base64')
    }));

    res.json({
      success: true,
      data: imagesData
    });

  } catch (error) {
    console.error('Error generating layout images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate layout images',
      error: error.message
    });
  }
};

/**
 * Generate a single layout visualization
 */
export const generateSingleLayout = async (req, res) => {
  try {
    const { layoutDescription, venueType, eventType } = req.body;

    if (!layoutDescription) {
      return res.status(400).json({
        success: false,
        message: 'Layout description is required'
      });
    }

    const result = await generateLayoutVisualization(
      layoutDescription,
      venueType || 'event venue',
      eventType || 'event'
    );

    res.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
        imageBase64: result.imageBuffer.toString('base64')
      }
    });

  } catch (error) {
    console.error('Error generating single layout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate layout image',
      error: error.message
    });
  }
};
