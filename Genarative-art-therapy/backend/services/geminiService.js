const axios = require('axios');

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const API_KEY = process.env.GOOGLE_API_KEY;

// Enhance emotion/description into detailed art prompt using Gemini
async function enhancePromptWithGemini({ emotion, description, focusWord, style }) {
  try {
    if (!API_KEY) {
      throw new Error('Google API key not configured');
    }

    const systemPrompt = `You are a therapeutic art prompt generator. Your role is to transform user emotions and descriptions into detailed, therapeutic art prompts that will guide AI image generation.

Guidelines:
- Create prompts that are therapeutic and healing-focused
- Use vivid, descriptive language that evokes emotions
- Include artistic style suggestions that match the emotional tone
- Keep prompts under 400 characters (DALL-E 3 limit)
- Focus on positive, healing imagery even for difficult emotions
- Use metaphors and symbolic language when appropriate

Examples:
- "I feel overwhelmed" → "A serene mountain landscape with gentle mist, soft watercolor style, peaceful and calming, representing finding clarity through nature"
- "I'm angry" → "A powerful storm clearing away dark clouds, dynamic brushstrokes, red and orange colors transforming to blue and white, symbolizing release and renewal"`;

    const userInput = buildUserInput({ emotion, description, focusWord, style });
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nUser Input: ${userInput}\n\nGenerate a therapeutic art prompt:`
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200
      }
    };

    console.log('🤖 Sending request to Gemini API...');
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (!response.data.candidates || !response.data.candidates[0]) {
      throw new Error('Invalid response from Gemini API');
    }

    const enhancedPrompt = response.data.candidates[0].content.parts[0].text.trim();
    
    console.log('✨ Gemini enhanced prompt:', enhancedPrompt);
    
    return enhancedPrompt;
    
  } catch (error) {
    console.error('❌ Gemini API error:', error.response?.data || error.message);
    
    // Fallback to basic prompt if Gemini fails
    return createFallbackPrompt({ emotion, description, focusWord, style });
  }
}

// Build user input string from emotion data
function buildUserInput({ emotion, description, focusWord, style }) {
  let input = '';
  
  if (emotion) {
    input += `Emotion: ${emotion}\n`;
  }
  
  if (description) {
    input += `Description: ${description}\n`;
  }
  
  if (focusWord) {
    input += `Focus word: ${focusWord}\n`;
  }
  
  if (style) {
    input += `Style preference: ${style}\n`;
  }
  
  return input.trim();
}

// Create fallback prompt if Gemini API fails
function createFallbackPrompt({ emotion, description, focusWord, style }) {
  const emotionPrompts = {
    'happy': 'A bright, joyful scene with warm colors, soft lighting, and peaceful elements',
    'sad': 'A gentle, melancholic landscape with soft blues and purples, representing healing and hope',
    'angry': 'A powerful storm clearing away darkness, dynamic energy transforming into calm',
    'anxious': 'A serene garden with flowing water, soft pastels, representing peace and tranquility',
    'calm': 'A peaceful mountain lake at sunrise, soft watercolor style, meditative and serene',
    'confused': 'A misty forest path leading to a clearing, soft light breaking through, representing clarity',
    'excited': 'A vibrant celebration of colors and movement, energetic yet harmonious'
  };

  let prompt = emotionPrompts[emotion?.toLowerCase()] || 'A beautiful, therapeutic artwork with soft colors and peaceful elements';
  
  if (style) {
    prompt += `, ${style} style`;
  }
  
  if (focusWord) {
    prompt += `, incorporating the theme of ${focusWord}`;
  }
  
  return prompt;
}

module.exports = {
  enhancePromptWithGemini
};
