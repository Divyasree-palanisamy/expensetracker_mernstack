const express = require('express');
const { body, validationResult } = require('express-validator');
const RecurringExpense = require('../models/RecurringExpense');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/recurring
// @desc    Get all recurring expenses for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const recurringExpenses = await RecurringExpense.find({
            user: req.user._id,
            isActive: true
        }).sort({ nextDueDate: 1 });

        res.json(recurringExpenses);
    } catch (error) {
        console.error('Get recurring expenses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/recurring
// @desc    Create a new recurring expense
// @access  Private
router.post('/', [
    auth,
    body('title', 'Title is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
    body('category', 'Category is required').isIn(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other']),
    body('frequency', 'Frequency is required').isIn(['daily', 'weekly', 'monthly', 'yearly'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            amount,
            category,
            description,
            frequency,
            startDate,
            endDate,
            paymentMethod,
            tags
        } = req.body;

        // Calculate next due date
        const start = startDate ? new Date(startDate) : new Date();
        let nextDueDate = new Date(start);

        switch (frequency) {
            case 'daily':
                nextDueDate.setDate(nextDueDate.getDate() + 1);
                break;
            case 'weekly':
                nextDueDate.setDate(nextDueDate.getDate() + 7);
                break;
            case 'monthly':
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                break;
            case 'yearly':
                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                break;
        }

        const recurringExpense = new RecurringExpense({
            user: req.user._id,
            title,
            amount,
            category,
            description: description || '',
            frequency,
            startDate: start,
            endDate: endDate ? new Date(endDate) : null,
            nextDueDate,
            paymentMethod: paymentMethod || 'Cash',
            tags: tags || []
        });

        await recurringExpense.save();
        res.json(recurringExpense);
    } catch (error) {
        console.error('Create recurring expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/recurring/:id
// @desc    Update a recurring expense
// @access  Private
router.put('/:id', [
    auth,
    body('title', 'Title is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
    body('category', 'Category is required').isIn(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other']),
    body('frequency', 'Frequency is required').isIn(['daily', 'weekly', 'monthly', 'yearly'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const recurringExpense = await RecurringExpense.findById(req.params.id);
        if (!recurringExpense) {
            return res.status(404).json({ message: 'Recurring expense not found' });
        }

        if (recurringExpense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const {
            title,
            amount,
            category,
            description,
            frequency,
            startDate,
            endDate,
            paymentMethod,
            tags,
            isActive
        } = req.body;

        recurringExpense.title = title;
        recurringExpense.amount = amount;
        recurringExpense.category = category;
        recurringExpense.description = description || '';
        recurringExpense.frequency = frequency;
        recurringExpense.startDate = startDate ? new Date(startDate) : recurringExpense.startDate;
        recurringExpense.endDate = endDate ? new Date(endDate) : recurringExpense.endDate;
        recurringExpense.paymentMethod = paymentMethod || recurringExpense.paymentMethod;
        recurringExpense.tags = tags || [];
        recurringExpense.isActive = isActive !== undefined ? isActive : recurringExpense.isActive;

        // Recalculate next due date if frequency changed
        if (frequency && frequency !== recurringExpense.frequency) {
            const start = new Date(recurringExpense.startDate);
            let nextDueDate = new Date(start);

            switch (frequency) {
                case 'daily':
                    nextDueDate.setDate(nextDueDate.getDate() + 1);
                    break;
                case 'weekly':
                    nextDueDate.setDate(nextDueDate.getDate() + 7);
                    break;
                case 'monthly':
                    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    break;
                case 'yearly':
                    nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                    break;
            }
            recurringExpense.nextDueDate = nextDueDate;
        }

        await recurringExpense.save();
        res.json(recurringExpense);
    } catch (error) {
        console.error('Update recurring expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/recurring/:id
// @desc    Delete a recurring expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const recurringExpense = await RecurringExpense.findById(req.params.id);
        if (!recurringExpense) {
            return res.status(404).json({ message: 'Recurring expense not found' });
        }

        if (recurringExpense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await recurringExpense.remove();
        res.json({ message: 'Recurring expense removed' });
    } catch (error) {
        console.error('Delete recurring expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/recurring/:id/advance
// @desc    Advance the next due date for a recurring expense
// @access  Private
router.post('/:id/advance', auth, async (req, res) => {
    try {
        const recurringExpense = await RecurringExpense.findById(req.params.id);
        if (!recurringExpense) {
            return res.status(404).json({ message: 'Recurring expense not found' });
        }

        if (recurringExpense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Calculate next due date
        let nextDueDate = new Date(recurringExpense.nextDueDate);

        switch (recurringExpense.frequency) {
            case 'daily':
                nextDueDate.setDate(nextDueDate.getDate() + 1);
                break;
            case 'weekly':
                nextDueDate.setDate(nextDueDate.getDate() + 7);
                break;
            case 'monthly':
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                break;
            case 'yearly':
                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                break;
        }

        recurringExpense.nextDueDate = nextDueDate;
        await recurringExpense.save();

        res.json(recurringExpense);
    } catch (error) {
        console.error('Advance recurring expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 