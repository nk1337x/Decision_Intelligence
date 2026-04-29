import axios from 'axios';

/**
 * Generate images using Pollinations.ai (FREE, unlimited, no API key needed)
 * Note: Can be slow and may timeout occasionally
 */
export const generateImageWithPollinations = async (prompt, options = {}) => {
  try {
    const {
      width = 1024,
      height = 1024,
      seed = Math.floor(Math.random() * 1000000),
      nologo = true,
      enhance = false
    } = options;

    console.log('🎨 Generating image with Pollinations.ai (FREE)...');

    // Simplify and shorten prompt for better results
    const simplifiedPrompt = prompt.substring(0, 300);

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(simplifiedPrompt)}`;
    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString(),
      nologo: nologo.toString(),
    });

    if (enhance) {
      params.append('enhance', 'true');
    }

    const imageUrl = `${url}?${params.toString()}`;

    console.log('📡 Requesting image from Pollinations...');

    // Fetch the image with extended timeout
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 90000, // 90 seconds timeout
      maxRedirects: 5,
      validateStatus: (status) => status === 200
    });

    console.log('✅ Pollinations image generated successfully');

    return {
      success: true,
      imageBuffer: Buffer.from(response.data),
      imageUrl: imageUrl,
      mimeType: 'image/jpeg'
    };

  } catch (error) {
    console.error('Pollinations Image Generation Error:', error.message);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Image generation timed out. Pollinations.ai is slow right now. Try again or use predefined images.');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Pollinations.ai is busy. Wait a moment and try again.');
    } else if (error.response?.status === 503) {
      throw new Error('Pollinations.ai service unavailable. Try again in a moment.');
    }
    
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};

/**
 * Generate layout visualization using Pollinations
 */
export const generateLayoutVisualization = async (layoutDescription, venueType, eventType) => {
  try {
    // Create simple, clear prompt
    const prompt = `professional event venue floor plan, top view, ${layoutDescription}, ${venueType}, ${eventType}, clean diagram, labeled areas`;

    const result = await generateImageWithPollinations(prompt, {
      width: 1024,
      height: 1024,
      enhance: false // Disable enhance for faster generation
    });

    return result;

  } catch (error) {
    console.error('Layout Visualization Error:', error);
    throw error;
  }
};

/**
 * Generate multiple layout variations using Pollinations
 */
export const generateMultipleLayouts = async (layouts, venueType, eventType) => {
  try {
    const results = [];

    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];
      
      // Create short, simple prompt for faster generation
      const prompt = `${layout.name} event floor plan, ${venueType}, ${eventType}, top view, clean diagram`;

      try {
        console.log(`🎨 Generating layout ${i + 1}/${layouts.length}: ${layout.name}`);
        console.log('⏳ This may take 30-60 seconds...');
        
        const result = await generateImageWithPollinations(prompt, {
          width: 1024,
          height: 1024,
          seed: Math.floor(Math.random() * 1000000),
          enhance: false
        });

        results.push({
          layoutName: layout.name,
          imageBuffer: result.imageBuffer,
          imageUrl: result.imageUrl
        });

        console.log(`✅ Generated image ${i + 1}/${layouts.length}: ${layout.name}`);
      } catch (error) {
        console.error(`⚠️ Failed to generate image for ${layout.name}:`, error.message);
        
        // Add placeholder result
        results.push({
          layoutName: layout.name,
          imageBuffer: null,
          imageUrl: null,
          error: error.message
        });
      }

      // Longer delay between requests to avoid rate limiting
      if (i < layouts.length - 1) {
        console.log('⏳ Waiting 5 seconds before next generation...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    return results;

  } catch (error) {
    console.error('Multiple Layouts Generation Error:', error);
    throw error;
  }
};
