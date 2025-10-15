const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { enhancePromptWithGemini } = require('./geminiService');
const { generateImageWithStability } = require('./stabilityService');
const { saveArtwork } = require('./galleryService');

// Main art generation service
async function generateArt({ emotion, description, focusWord, style }) {
  try {
    const requestId = uuidv4();
    console.log(`🎨 Starting art generation for request ${requestId}`);
    
    // Step 1: Enhance the emotion/description with Gemini
    const enhancedPrompt = await enhancePromptWithGemini({
      emotion,
      description,
      focusWord,
      style
    });
    
    console.log('✨ Enhanced prompt:', enhancedPrompt);
    
    // Step 2: Generate image with Stability AI
    const imageResult = await generateImageWithStability(enhancedPrompt);
    
    console.log('🖼️ Image generated:', imageResult.url);
    
    // Step 3: Save to gallery
    const artwork = await saveArtwork({
      imageUrl: imageResult.url,
      prompt: enhancedPrompt,
      originalPrompt: description,
      emotion,
      focusWord,
      style,
      metadata: {
        requestId,
        model: 'stable-diffusion-xl',
        size: imageResult.size || '1024x1024',
        isPlaceholder: imageResult.isPlaceholder || false,
        seed: imageResult.seed
      }
    });
    
    return {
      requestId,
      imageUrl: imageResult.url,
      prompt: enhancedPrompt,
      artwork,
      status: 'completed'
    };
    
  } catch (error) {
    console.error('❌ Art generation failed:', error);
    throw new Error(`Art generation failed: ${error.message}`);
  }
}

// Get art generation status
async function getArtStatus(requestId) {
  // In a real implementation, you'd check from a database or cache
  // For now, we'll return a simple status
  return {
    requestId,
    status: 'completed',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  generateArt,
  getArtStatus
};
