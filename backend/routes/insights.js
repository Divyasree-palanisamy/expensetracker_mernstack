const express = require('express');
const router = express.Router();

// Stub: Insights endpoint (to be implemented)
router.get('/', (req, res) => {
    res.status(501).json({ message: 'Insights endpoint not implemented yet.' });
});

module.exports = router; 