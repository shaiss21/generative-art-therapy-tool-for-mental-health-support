const Artwork = require('../models/Artwork');

// Save artwork to gallery
async function saveArtwork({ imageUrl, prompt, originalPrompt, emotion, focusWord, style, metadata, createdAt }) {
  try {
    const artwork = new Artwork({
      imageUrl,
      prompt,
      originalPrompt,
      emotion,
      focusWord,
      style,
      metadata: metadata || {},
      createdAt: createdAt || new Date()
    });
    
    const savedArtwork = await artwork.save();
    
    console.log('🖼️ Artwork saved to gallery:', savedArtwork._id);
    
    return savedArtwork;
    
  } catch (error) {
    console.error('❌ Error saving artwork:', error);
    throw new Error('Failed to save artwork');
  }
}

// Get gallery with filtering and pagination
async function getGallery({ limit = 20, offset = 0, emotion, dateFrom, dateTo } = {}) {
  try {
    // Build query filters
    const query = {};
    
    if (emotion) {
      query.emotion = emotion.toLowerCase();
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }
    
    const artworks = await Artwork.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    
    const total = await Artwork.countDocuments(query);
    
    return {
      artworks,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };
    
  } catch (error) {
    console.error('❌ Error retrieving gallery:', error);
    throw new Error('Failed to retrieve gallery');
  }
}

// Get artwork details by ID
async function getArtworkDetails(artworkId) {
  try {
    const artwork = await Artwork.findById(artworkId);
    
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    
    return artwork;
    
  } catch (error) {
    console.error('❌ Error retrieving artwork details:', error);
    throw new Error('Failed to retrieve artwork details');
  }
}

// Delete artwork from gallery
async function deleteArtwork(artworkId) {
  try {
    const result = await Artwork.findByIdAndDelete(artworkId);
    
    if (!result) {
      throw new Error('Artwork not found');
    }
    
    console.log('🗑️ Artwork deleted:', artworkId);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error deleting artwork:', error);
    throw new Error('Failed to delete artwork');
  }
}

// Toggle favorite status
async function toggleFavorite(artworkId) {
  try {
    const artwork = await Artwork.findById(artworkId);
    
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    
    artwork.isFavorite = !artwork.isFavorite;
    await artwork.save();
    
    console.log('⭐ Favorite toggled for artwork:', artworkId);
    
    return artwork;
    
  } catch (error) {
    console.error('❌ Error toggling favorite:', error);
    throw new Error('Failed to toggle favorite');
  }
}

module.exports = {
  saveArtwork,
  getGallery,
  getArtworkDetails,
  deleteArtwork,
  toggleFavorite
};
