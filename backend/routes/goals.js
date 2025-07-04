const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');

// Get all savings goals for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const goals = await SavingsGoal.find({ userId });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new savings goal
router.post('/', async (req, res) => {
    try {
        const goal = new SavingsGoal(req.body);
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a savings goal
router.put('/:id', async (req, res) => {
    try {
        const updated = await SavingsGoal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a savings goal
router.delete('/:id', async (req, res) => {
    try {
        await SavingsGoal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Savings goal deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router; 