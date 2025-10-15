const express = require('express');
const router = express.Router();
const { generateArt } = require('../services/artService');
const { validateArtRequest } = require('../middleware/validation');

// Generate art from emotion input
router.post('/generate', validateArtRequest, async (req, res) => {
  try {
    const { emotion, description, focusWord, style } = req.body;
    
    console.log('🎨 Art generation request:', { emotion, description, focusWord, style });
    
    const result = await generateArt({
      emotion,
      description,
      focusWord,
      style
    });
    
    res.json({
      success: true,
      data: result,
      message: 'Art generated successfully'
    });
    
  } catch (error) {
    console.error('❌ Art generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate art',
      message: error.message
    });
  }
});

// Get art generation status (for webhook polling)
router.get('/status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    // In a real implementation, you'd check the status from your storage
    res.json({
      success: true,
      status: 'completed', // or 'processing', 'failed'
      requestId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get status'
    });
  }
});

module.exports = router;
