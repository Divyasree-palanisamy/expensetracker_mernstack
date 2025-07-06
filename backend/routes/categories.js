const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories with their statistics
// @access  Private
router.get('/', auth, async (req, res) => {
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

        const categories = [
            'Food', 'Transport', 'Entertainment', 'Shopping',
            'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
        ];

        const categoryStats = categories.map(category => {
            const categoryExpenses = expenses.filter(expense => expense.category === category);
            const totalAmount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const count = categoryExpenses.length;

            return {
                name: category,
                totalAmount,
                count,
                percentage: expenses.length > 0 ? ((count / expenses.length) * 100).toFixed(1) : 0
            };
        });

        res.json(categoryStats);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/categories/:category
// @desc    Get expenses for a specific category
// @access  Private
router.get('/:category', auth, async (req, res) => {
    try {
        const { category } = req.params;
        const { year, month } = req.query;

        const currentDate = new Date();
        const targetYear = year || currentDate.getFullYear();
        const targetMonth = month || currentDate.getMonth() + 1;

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const expenses = await Expense.find({
            user: req.user._id,
            category,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });

        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        res.json({
            category,
            expenses,
            totalAmount,
            count: expenses.length
        });
    } catch (error) {
        console.error('Get category expenses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 