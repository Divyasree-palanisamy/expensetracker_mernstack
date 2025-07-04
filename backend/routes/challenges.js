const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// Get all challenges for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const challenges = await Challenge.find({ userId });
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new challenge
router.post('/', async (req, res) => {
    try {
        const challenge = new Challenge(req.body);
        await challenge.save();
        res.status(201).json(challenge);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a challenge
router.put('/:id', async (req, res) => {
    try {
        const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a challenge
router.delete('/:id', async (req, res) => {
    try {
        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ message: 'Challenge deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router; 