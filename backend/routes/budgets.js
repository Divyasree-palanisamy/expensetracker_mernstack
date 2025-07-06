const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    getBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
    getBudgetsWithProgress
} = require('../controllers/budgetController');

// All routes require authentication
router.use(auth);

// Get all budgets
router.get('/', getBudgets);

// Get all budgets with progress
router.get('/with-progress', getBudgetsWithProgress);

// Get single budget
router.get('/:id', getBudgetById);

// Get budget progress
router.get('/:id/progress', getBudgetProgress);

// Create new budget
router.post('/', createBudget);

// Update budget
router.put('/:id', updateBudget);

// Delete budget
router.delete('/:id', deleteBudget);

module.exports = router; 