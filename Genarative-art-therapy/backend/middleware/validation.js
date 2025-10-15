// Validation middleware for API requests

// Validate art generation request
function validateArtRequest(req, res, next) {
  const { emotion, description, focusWord, style } = req.body;
  
  // At least one of emotion or description must be provided
  if (!emotion && !description) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Either emotion or description must be provided'
    });
  }
  
  // Validate emotion if provided
  if (emotion) {
    const validEmotions = ['happy', 'sad', 'angry', 'anxious', 'calm', 'confused', 'excited'];
    if (!validEmotions.includes(emotion.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: `Invalid emotion. Must be one of: ${validEmotions.join(', ')}`
      });
    }
  }
  
  // Validate description length
  if (description && description.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Description must be less than 1000 characters'
    });
  }
  
  // Validate focus word length
  if (focusWord && focusWord.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Focus word must be less than 100 characters'
    });
  }
  
  // Validate style length
  if (style && style.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Style must be less than 100 characters'
    });
  }
  
  // Sanitize inputs
  req.body.emotion = emotion?.toLowerCase().trim();
  req.body.description = description?.trim();
  req.body.focusWord = focusWord?.trim();
  req.body.style = style?.trim();
  
  next();
}

// Validate mood journal request
function validateMoodRequest(req, res, next) {
  const { emotion, description, intensity, notes } = req.body;
  
  // Emotion is required
  if (!emotion) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Emotion is required'
    });
  }
  
  // Validate emotion
  const validEmotions = ['happy', 'sad', 'angry', 'anxious', 'calm', 'confused', 'excited'];
  if (!validEmotions.includes(emotion.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: `Invalid emotion. Must be one of: ${validEmotions.join(', ')}`
    });
  }
  
  // Validate intensity (1-10 scale)
  if (intensity !== undefined) {
    const intensityNum = parseInt(intensity);
    if (isNaN(intensityNum) || intensityNum < 1 || intensityNum > 10) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Intensity must be a number between 1 and 10'
      });
    }
    req.body.intensity = intensityNum;
  }
  
  // Validate description length
  if (description && description.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Description must be less than 1000 characters'
    });
  }
  
  // Validate notes length
  if (notes && notes.length > 2000) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Notes must be less than 2000 characters'
    });
  }
  
  // Sanitize inputs
  req.body.emotion = emotion.toLowerCase().trim();
  req.body.description = description?.trim();
  req.body.notes = notes?.trim();
  
  next();
}

// Validate pagination parameters
function validatePagination(req, res, next) {
  const { limit, offset } = req.query;
  
  // Validate limit
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Limit must be a number between 1 and 100'
      });
    }
    req.query.limit = limitNum;
  }
  
  // Validate offset
  if (offset !== undefined) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Offset must be a non-negative number'
      });
    }
    req.query.offset = offsetNum;
  }
  
  next();
}

module.exports = {
  validateArtRequest,
  validateMoodRequest,
  validatePagination
};
