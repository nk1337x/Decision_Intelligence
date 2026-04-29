import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('Testing available Gemini models...\n');
    
    const models = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-flash-latest',
      'gemini-pro-vision'
    ];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Try a simple text generation
        const result = await model.generateContent('Hello');
        console.log(`✅ ${modelName} - WORKS (text)`);
        
        // Try with image
        try {
          const imagePart = {
            inlineData: {
              data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              mimeType: 'image/png'
            }
          };
          const imageResult = await model.generateContent(['Test', imagePart]);
          console.log(`✅ ${modelName} - WORKS (text + image)`);
        } catch (imgError) {
          console.log(`⚠️  ${modelName} - Works for text only, not images`);
        }
      } catch (error) {
        console.log(`❌ ${modelName} - NOT AVAILABLE`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
