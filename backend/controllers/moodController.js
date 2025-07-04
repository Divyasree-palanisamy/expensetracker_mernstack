const MoodEntry = require('../models/MoodEntry');

exports.getAllMoods = async (req, res) => {
    try {
        const userId = req.query.userId;
        const moods = await MoodEntry.find({ userId });
        res.json(moods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createMood = async (req, res) => {
    try {
        const mood = new MoodEntry(req.body);
        await mood.save();
        res.status(201).json(mood);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateMood = async (req, res) => {
    try {
        const updated = await MoodEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteMood = async (req, res) => {
    try {
        await MoodEntry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Mood entry deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}; 