const express = require('express');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');

// Get all mood entries for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const moods = await MoodEntry.find({ userId });
        res.json(moods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new mood entry
router.post('/', async (req, res) => {
    try {
        const mood = new MoodEntry(req.body);
        await mood.save();
        res.status(201).json(mood);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a mood entry
router.put('/:id', async (req, res) => {
    try {
        const updated = await MoodEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a mood entry
router.delete('/:id', async (req, res) => {
    try {
        await MoodEntry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Mood entry deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router; 