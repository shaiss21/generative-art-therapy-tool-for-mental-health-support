const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  emotion: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'confused', 'excited']
  },
  description: {
    type: String,
    maxlength: 1000
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  notes: {
    type: String,
    maxlength: 2000
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
moodEntrySchema.index({ timestamp: -1 });
moodEntrySchema.index({ emotion: 1, timestamp: -1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
