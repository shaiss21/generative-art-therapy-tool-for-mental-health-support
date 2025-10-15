const MoodEntry = require('../models/MoodEntry');

// Save mood journal entry
async function saveMoodEntry({ emotion, description, intensity, notes, timestamp }) {
  try {
    const entry = new MoodEntry({
      emotion,
      description,
      intensity: intensity || 5, // Default intensity on scale 1-10
      notes,
      timestamp: timestamp || new Date()
    });
    
    const savedEntry = await entry.save();
    
    console.log('📝 Mood entry saved:', savedEntry._id);
    
    return savedEntry;
    
  } catch (error) {
    console.error('❌ Error saving mood entry:', error);
    throw new Error('Failed to save mood entry');
  }
}

// Get mood history
async function getMoodHistory({ limit = 30, offset = 0 } = {}) {
  try {
    const entries = await MoodEntry.find()
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit);
    
    const total = await MoodEntry.countDocuments();
    
    return {
      entries,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    };
    
  } catch (error) {
    console.error('❌ Error retrieving mood history:', error);
    throw new Error('Failed to retrieve mood history');
  }
}

// Get mood analytics
async function getMoodAnalytics(period = 'week') {
  try {
    const now = new Date();
    const periodMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    }[period] || periodMs.week;
    
    const cutoffDate = new Date(now.getTime() - periodMs);
    
    const recentEntries = await MoodEntry.find({
      timestamp: { $gte: cutoffDate }
    }).sort({ timestamp: -1 });
    
    // Calculate analytics
    const emotionCounts = {};
    const intensitySum = { total: 0, count: 0 };
    const dailyData = {};
    
    recentEntries.forEach(entry => {
      // Emotion distribution
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      
      // Average intensity
      intensitySum.total += entry.intensity;
      intensitySum.count += 1;
      
      // Daily data
      const date = new Date(entry.timestamp).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = { emotions: [], intensities: [] };
      }
      dailyData[date].emotions.push(entry.emotion);
      dailyData[date].intensities.push(entry.intensity);
    });
    
    const averageIntensity = intensitySum.count > 0 ? 
      (intensitySum.total / intensitySum.count).toFixed(1) : 0;
    
    return {
      period,
      totalEntries: recentEntries.length,
      emotionDistribution: emotionCounts,
      averageIntensity: parseFloat(averageIntensity),
      dailyData: Object.entries(dailyData).map(([date, data]) => ({
        date,
        emotions: data.emotions,
        averageIntensity: data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length
      })).sort((a, b) => new Date(a.date) - new Date(b.date))
    };
    
  } catch (error) {
    console.error('❌ Error calculating mood analytics:', error);
    throw new Error('Failed to calculate mood analytics');
  }
}

module.exports = {
  saveMoodEntry,
  getMoodHistory,
  getMoodAnalytics
};
