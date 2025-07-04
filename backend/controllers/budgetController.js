const Budget = require('../models/Budget');

exports.getAllBudgets = async (req, res) => {
    try {
        const userId = req.query.userId;
        const budgets = await Budget.find({ userId });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBudget = async (req, res) => {
    try {
        const budget = new Budget(req.body);
        await budget.save();
        res.status(201).json(budget);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateBudget = async (req, res) => {
    try {
        const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}; 