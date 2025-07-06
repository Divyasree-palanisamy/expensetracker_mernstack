import React, { useState } from 'react';
import axios from 'axios';
import './QuickAddWidget.css';

const categories = [
    'Food', 'Transport', 'Entertainment', 'Shopping',
    'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
];

const paymentMethods = [
    'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'
];

const QuickAddWidget = ({ onAddExpense }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        location: '',
        tags: '',
        isRecurring: false,
        recurringType: 'monthly'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount),
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };
            await axios.post('/api/expenses', expenseData);
            if (onAddExpense) onAddExpense(expenseData);
            setIsOpen(false);
            setFormData({
                title: '',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                paymentMethod: 'Cash',
                location: '',
                tags: '',
                isRecurring: false,
                recurringType: 'monthly'
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <div className="quick-add-fab" onClick={() => setIsOpen(true)}>
                <span className="fab-icon">+</span>
                <span className="fab-label">Quick Add</span>
            </div>

            {/* Quick Add Modal */}
            {isOpen && (
                <div className="quick-add-overlay" onClick={() => setIsOpen(false)}>
                    <div className="quick-add-modal" onClick={e => e.stopPropagation()}>
                        <div className="quick-add-header">
                            <h3>⚡ Quick Add Expense</h3>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="quick-add-form">
                            {error && <div className="error-message">{error}</div>}
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter expense title (e.g., Grocery shopping)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter amount (e.g., 500)"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select date"
                                />
                            </div>
                            <div className="form-group">
                                <label>Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                >
                                    {paymentMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter location (e.g., Walmart, Downtown)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="2"
                                    placeholder="Enter description (optional)"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="e.g., groceries, monthly"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isRecurring"
                                        checked={formData.isRecurring}
                                        onChange={handleChange}
                                    />
                                    &nbsp;Recurring Expense
                                </label>
                                {formData.isRecurring && (
                                    <select
                                        name="recurringType"
                                        value={formData.recurringType}
                                        onChange={handleChange}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="add-expense-btn"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Expense'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickAddWidget; 