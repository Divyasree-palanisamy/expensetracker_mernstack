const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, category, startDate, endDate, sortBy = 'date', sortOrder = 'desc' } = req.query;

        const query = { user: req.user._id };

        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const expenses = await Expense.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Expense.countDocuments(query);

        res.json({
            expenses,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', [
    auth,
    body('title', 'Title is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
    body('category', 'Category is required').isIn(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other'])
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
            date,
            paymentMethod,
            isRecurring,
            recurringType,
            tags,
            location
        } = req.body;

        const expense = new Expense({
            user: req.user._id,
            title,
            amount,
            category,
            description: description || '',
            date: date || new Date(),
            paymentMethod: paymentMethod || 'Cash',
            isRecurring: isRecurring || false,
            recurringType: recurringType || 'monthly',
            tags: tags || [],
            location: location || ''
        });

        await expense.save();
        res.json(expense);
    } catch (error) {
        console.error('Create expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', [
    auth,
    body('title', 'Title is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
    body('category', 'Category is required').isIn(['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Travel', 'Other'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const {
            title,
            amount,
            category,
            description,
            date,
            paymentMethod,
            isRecurring,
            recurringType,
            tags,
            location
        } = req.body;

        expense.title = title;
        expense.amount = amount;
        expense.category = category;
        expense.description = description || '';
        expense.date = date || expense.date;
        expense.paymentMethod = paymentMethod || expense.paymentMethod;
        expense.isRecurring = isRecurring || false;
        expense.recurringType = recurringType || expense.recurringType;
        expense.tags = tags || [];
        expense.location = location || '';

        await expense.save();
        res.json(expense);
    } catch (error) {
        console.error('Update expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await expense.remove();
        res.json({ message: 'Expense removed' });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/expenses/summary
// @desc    Get monthly summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
    try {
        const { year, month } = req.query;
        const currentDate = new Date();
        const targetYear = year || currentDate.getFullYear();
        const targetMonth = month || currentDate.getMonth() + 1;

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const expenses = await Expense.find({
            user: req.user._id,
            date: { $gte: startDate, $lte: endDate }
        });

        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const dailyTotals = expenses.reduce((acc, expense) => {
            const day = expense.date.toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + expense.amount;
            return acc;
        }, {});

        res.json({
            totalAmount,
            categoryTotals,
            dailyTotals,
            expenseCount: expenses.length,
            month: targetMonth,
            year: targetYear
        });
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/expenses/export
// @desc    Export expenses to CSV format
// @access  Private
router.get('/export', auth, async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;

        const query = { user: req.user._id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (category) query.category = category;

        const expenses = await Expense.find(query).sort({ date: -1 });

        const csvData = expenses.map(expense => ({
            Date: expense.date.toISOString().split('T')[0],
            Title: expense.title,
            Amount: expense.amount,
            Category: expense.category,
            Description: expense.description,
            PaymentMethod: expense.paymentMethod,
            Location: expense.location,
            Tags: expense.tags.join(', ')
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');

        const csvHeaders = Object.keys(csvData[0] || {}).join(',');
        const csvRows = csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','));

        const csvContent = [csvHeaders, ...csvRows].join('\n');
        res.send(csvContent);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 