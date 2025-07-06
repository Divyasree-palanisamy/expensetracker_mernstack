const Transaction = require('../models/Transaction');

// Get all transactions for a user
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id })
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
    }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch transaction', error: err.message });
    }
};

// Create new transaction
const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date, isRecurring } = req.body;

        if (!amount || !type || !category) {
            return res.status(400).json({ message: 'Amount, type, and category are required' });
        }

        const transaction = new Transaction({
            userId: req.user.id,
            amount: parseFloat(amount),
            type,
            category,
            description,
            date: date || new Date(),
            isRecurring: isRecurring || false
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create transaction', error: err.message });
    }
};

// Update transaction
const updateTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, date, isRecurring } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            {
                amount: parseFloat(amount),
                type,
                category,
                description,
                date: date || new Date(),
                isRecurring: isRecurring || false
            },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update transaction', error: err.message });
    }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete transaction', error: err.message });
    }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const userId = req.user.id;

        let startDate;
        const now = new Date();

        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const transactions = await Transaction.find({
            userId,
            date: { $gte: startDate }
        });

        const stats = {
            totalIncome: 0,
            totalExpenses: 0,
            netAmount: 0,
            categoryBreakdown: {},
            monthlyData: []
        };

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                stats.totalIncome += transaction.amount;
            } else {
                stats.totalExpenses += transaction.amount;
            }

            // Category breakdown
            if (!stats.categoryBreakdown[transaction.category]) {
                stats.categoryBreakdown[transaction.category] = 0;
            }
            stats.categoryBreakdown[transaction.category] += transaction.amount;
        });

        stats.netAmount = stats.totalIncome - stats.totalExpenses;

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch statistics', error: err.message });
    }
};

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats
}; 