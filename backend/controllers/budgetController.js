const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Get all budgets for a user
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id })
            .sort({ startDate: -1 });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch budgets', error: err.message });
    }
};

// Get budget by ID
const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json(budget);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch budget', error: err.message });
    }
};

// Create new budget
const createBudget = async (req, res) => {
    try {
        const { amount, period, categories, startDate, endDate } = req.body;

        if (!amount || !period || !startDate || !endDate) {
            return res.status(400).json({ message: 'Amount, period, startDate, and endDate are required' });
        }

        const budget = new Budget({
            userId: req.user.id,
            amount: parseFloat(amount),
            period,
            categories: categories || [],
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        await budget.save();
        res.status(201).json(budget);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create budget', error: err.message });
    }
};

// Update budget
const updateBudget = async (req, res) => {
    try {
        const { amount, period, categories, startDate, endDate } = req.body;

        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            {
                amount: parseFloat(amount),
                period,
                categories: categories || [],
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            },
            { new: true }
        );

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json(budget);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update budget', error: err.message });
    }
};

// Delete budget
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json({ message: 'Budget deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete budget', error: err.message });
    }
};

// Get budget progress and spending
const getBudgetProgress = async (req, res) => {
    try {
        const budgetId = req.params.id;
        const budget = await Budget.findOne({
            _id: budgetId,
            userId: req.user.id
        });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Get transactions within budget period
        const transactions = await Transaction.find({
            userId: req.user.id,
            type: 'expense',
            date: { $gte: budget.startDate, $lte: budget.endDate }
        });

        let totalSpent = 0;
        const categorySpending = {};

        transactions.forEach(transaction => {
            totalSpent += transaction.amount;
            if (!categorySpending[transaction.category]) {
                categorySpending[transaction.category] = 0;
            }
            categorySpending[transaction.category] += transaction.amount;
        });

        const progress = {
            budget,
            totalSpent,
            remaining: budget.amount - totalSpent,
            percentageUsed: (totalSpent / budget.amount) * 100,
            categorySpending,
            isOverBudget: totalSpent > budget.amount
        };

        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch budget progress', error: err.message });
    }
};

// Get all budgets with progress
const getBudgetsWithProgress = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id })
            .sort({ startDate: -1 });

        const budgetsWithProgress = await Promise.all(
            budgets.map(async (budget) => {
                const transactions = await Transaction.find({
                    userId: req.user.id,
                    type: 'expense',
                    date: { $gte: budget.startDate, $lte: budget.endDate }
                });

                const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

                return {
                    ...budget.toObject(),
                    totalSpent,
                    remaining: budget.amount - totalSpent,
                    percentageUsed: (totalSpent / budget.amount) * 100,
                    isOverBudget: totalSpent > budget.amount
                };
            })
        );

        res.json(budgetsWithProgress);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch budgets with progress', error: err.message });
    }
};

module.exports = {
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
    getBudgetsWithProgress
}; 