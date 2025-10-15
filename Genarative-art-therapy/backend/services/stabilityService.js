const axios = require('axios');

// Stability AI API configuration
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';
const API_KEY = process.env.STABILITY_API_KEY;

// Generate image using Stability AI
async function generateImageWithStability(prompt) {
  try {
    if (!API_KEY) {
      throw new Error('Stability AI API key not configured');
    }

    // Ensure prompt is within reasonable limits
    const truncatedPrompt = prompt.length > 500 ? prompt.substring(0, 497) + '...' : prompt;
    
    const requestBody = {
      text_prompts: [
        {
          text: truncatedPrompt,
          weight: 1
        }
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
      style_preset: 'enhance'
    };

    console.log('🎨 Sending request to Stability AI API...');
    console.log('📝 Prompt:', truncatedPrompt);
    
    const response = await axios.post(STABILITY_API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 60000 // 60 seconds timeout for image generation
    });

    if (!response.data.artifacts || !response.data.artifacts[0]) {
      throw new Error('Invalid response from Stability AI API');
    }

    const imageData = response.data.artifacts[0];
    
    // Convert base64 to data URL
    const imageUrl = `data:image/png;base64,${imageData.base64}`;
    
    console.log('🖼️ Stability AI image generated successfully');
    
    return {
      url: imageUrl,
      size: '1024x1024',
      revisedPrompt: truncatedPrompt,
      createdAt: new Date().toISOString(),
      seed: imageData.seed
    };
    
  } catch (error) {
    console.error('❌ Stability AI API error:', error.response?.data || error.message);
    
    // Return a placeholder image URL for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Returning placeholder image');
      return {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSIjNEE5MEUyIi8+Cjx0ZXh0IHg9IjUxMiIgeT0iNTEyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R2VuZXJhdGVkIEFydCBQbGFjZWhvbGRlcjwvdGV4dD4KPC9zdmc+',
        size: '1024x1024',
        revisedPrompt: prompt,
        createdAt: new Date().toISOString(),
        isPlaceholder: true
      };
    }
    
    throw new Error(`Stability AI image generation failed: ${error.message}`);
  }
}

// Validate prompt for Stability AI
function validatePrompt(prompt) {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }
  
  if (prompt.length > 500) {
    console.warn('⚠️ Prompt exceeds 500 characters, will be truncated');
  }
  
  // Check for potentially problematic content
  const problematicTerms = ['violence', 'harmful', 'explicit', 'nsfw'];
  const lowerPrompt = prompt.toLowerCase();
  
  for (const term of problematicTerms) {
    if (lowerPrompt.includes(term)) {
      throw new Error('Prompt contains potentially problematic content');
    }
  }
  
  return true;
}

module.exports = {
  generateImageWithStability,
  validatePrompt
};
