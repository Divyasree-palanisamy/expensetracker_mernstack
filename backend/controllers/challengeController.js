const Challenge = require('../models/Challenge');

exports.getAllChallenges = async (req, res) => {
    try {
        const userId = req.query.userId;
        const challenges = await Challenge.find({ userId });
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createChallenge = async (req, res) => {
    try {
        const challenge = new Challenge(req.body);
        await challenge.save();
        res.status(201).json(challenge);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateChallenge = async (req, res) => {
    try {
        const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteChallenge = async (req, res) => {
    try {
        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ message: 'Challenge deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}; 