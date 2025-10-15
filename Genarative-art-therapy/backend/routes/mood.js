const express = require('express');
const router = express.Router();
const { saveMoodEntry, getMoodHistory } = require('../services/moodService');
const { validateMoodRequest } = require('../middleware/validation');

// Save mood journal entry
router.post('/journal', validateMoodRequest, async (req, res) => {
  try {
    const { emotion, description, intensity, notes } = req.body;
    
    console.log('📝 Mood journal entry:', { emotion, description, intensity });
    
    const entry = await saveMoodEntry({
      emotion,
      description,
      intensity,
      notes,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: entry,
      message: 'Mood entry saved successfully'
    });
    
  } catch (error) {
    console.error('❌ Mood save error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save mood entry',
      message: error.message
    });
  }
});

// Get mood history
router.get('/journal', async (req, res) => {
  try {
    const { limit = 30, offset = 0 } = req.query;
    
    const history = await getMoodHistory({
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: history,
      message: 'Mood history retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Mood history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve mood history',
      message: error.message
    });
  }
});

// Get mood analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = 'week' } = req.query; // week, month, year
    
    const analytics = await getMoodAnalytics(period);
    
    res.json({
      success: true,
      data: analytics,
      message: 'Mood analytics retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Mood analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve mood analytics',
      message: error.message
    });
  }
});

module.exports = router;
