const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  originalPrompt: {
    type: String
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'confused', 'excited']
  },
  focusWord: {
    type: String,
    maxlength: 100
  },
  style: {
    type: String,
    maxlength: 100
  },
  metadata: {
    requestId: String,
    model: {
      type: String,
      default: 'dalle-3'
    },
    size: {
      type: String,
      default: '1024x1024'
    },
    isPlaceholder: {
      type: Boolean,
      default: false
    }
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Index for efficient querying
artworkSchema.index({ createdAt: -1 });
artworkSchema.index({ emotion: 1, createdAt: -1 });
artworkSchema.index({ isFavorite: 1, createdAt: -1 });

module.exports = mongoose.model('Artwork', artworkSchema);
