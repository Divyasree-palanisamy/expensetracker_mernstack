const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challengeType: { type: String, required: true },
    target: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
});

module.exports = mongoose.model('Challenge', ChallengeSchema); 