const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats
} = require('../controllers/transactionController');

// All routes require authentication
router.use(auth);

// Get all transactions
router.get('/', getTransactions);

// Get transaction statistics
router.get('/stats', getTransactionStats);

// Get single transaction
router.get('/:id', getTransactionById);

// Create new transaction
router.post('/', createTransaction);

// Update transaction
router.put('/:id', updateTransaction);

// Delete transaction
router.delete('/:id', deleteTransaction);

// Stub: OCR upload endpoint (to be implemented)
router.post('/ocr', (req, res) => {
    res.status(501).json({ message: 'OCR upload not implemented yet.' });
});

// Stub: Recurring detection endpoint (to be implemented)
router.get('/recurring', (req, res) => {
    res.status(501).json({ message: 'Recurring detection not implemented yet.' });
});

module.exports = router; 