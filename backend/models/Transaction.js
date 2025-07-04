const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['expense', 'income'], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    isRecurring: { type: Boolean, default: false },
    receiptImageUrl: { type: String },
});

module.exports = mongoose.model('Transaction', TransactionSchema); 