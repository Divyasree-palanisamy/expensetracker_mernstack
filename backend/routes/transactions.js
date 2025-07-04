const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

// Get all transactions for a user
router.get('/', async (req, res) => {
    try {
        // Remove userId filtering since there's no auth
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new transaction
router.post('/', async (req, res) => {
    try {
        // Remove userId association since there's no auth
        const transaction = new Transaction({ ...req.body });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a transaction
router.put('/:id', async (req, res) => {
    try {
        // Remove userId filtering since there's no auth
        const updated = await Transaction.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Transaction not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        // Remove userId filtering since there's no auth
        const deleted = await Transaction.findOneAndDelete({ _id: req.params.id });
        if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Stub: OCR upload endpoint (to be implemented)
router.post('/ocr', (req, res) => {
    res.status(501).json({ message: 'OCR upload not implemented yet.' });
});

// Stub: Recurring detection endpoint (to be implemented)
router.get('/recurring', (req, res) => {
    res.status(501).json({ message: 'Recurring detection not implemented yet.' });
});

module.exports = router; 