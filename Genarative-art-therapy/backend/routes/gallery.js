const express = require('express');
const router = express.Router();
const { getGallery, saveArtwork, deleteArtwork } = require('../services/galleryService');

// Get user's art gallery
router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0, emotion, dateFrom, dateTo } = req.query;
    
    const gallery = await getGallery({
      limit: parseInt(limit),
      offset: parseInt(offset),
      emotion,
      dateFrom,
      dateTo
    });
    
    res.json({
      success: true,
      data: gallery,
      message: 'Gallery retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Gallery error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve gallery',
      message: error.message
    });
  }
});

// Save artwork to gallery
router.post('/', async (req, res) => {
  try {
    const { imageUrl, prompt, emotion, metadata } = req.body;
    
    const artwork = await saveArtwork({
      imageUrl,
      prompt,
      emotion,
      metadata,
      createdAt: new Date().toISOString()
    });
    
    res.json({
      success: true,
      data: artwork,
      message: 'Artwork saved to gallery'
    });
    
  } catch (error) {
    console.error('❌ Save artwork error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save artwork',
      message: error.message
    });
  }
});

// Delete artwork from gallery
router.delete('/:artworkId', async (req, res) => {
  try {
    const { artworkId } = req.params;
    
    await deleteArtwork(artworkId);
    
    res.json({
      success: true,
      message: 'Artwork deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete artwork error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete artwork',
      message: error.message
    });
  }
});

// Get artwork details
router.get('/:artworkId', async (req, res) => {
  try {
    const { artworkId } = req.params;
    
    const artwork = await getArtworkDetails(artworkId);
    
    res.json({
      success: true,
      data: artwork,
      message: 'Artwork details retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Artwork details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve artwork details',
      message: error.message
    });
  }
});

module.exports = router;
