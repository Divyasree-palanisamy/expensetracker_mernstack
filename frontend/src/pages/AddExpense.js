import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiX, FiDollarSign, FiTag, FiCalendar, FiMapPin, FiFileText } from 'react-icons/fi';

const AddExpense = () => {
    const navigate = useNavigate();
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

    const categories = [
        'Food', 'Transport', 'Entertainment', 'Shopping',
        'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
    ];

    const paymentMethods = [
        'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'
    ];

    const recurringTypes = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

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
            navigate('/expenses');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Add New Expense</h1>
                <p className="page-subtitle">Track your spending with detailed information</p>
            </div>

            <div className="expense-form">
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                <FiFileText className="inline mr-2" />
                                Expense Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., Grocery shopping"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount" className="form-label">
                                <FiDollarSign className="inline mr-2" />
                                Amount *
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                <FiTag className="inline mr-2" />
                                Category *
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date" className="form-label">
                                <FiCalendar className="inline mr-2" />
                                Date *
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="paymentMethod" className="form-label">
                                Payment Method
                            </label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="form-select"
                            >
                                {paymentMethods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location" className="form-label">
                                <FiMapPin className="inline mr-2" />
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="e.g., Walmart, Downtown"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input"
                            rows="3"
                            placeholder="Add any additional details about this expense..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags" className="form-label">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g., groceries, essential, monthly (separate with commas)"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <input
                                type="checkbox"
                                name="isRecurring"
                                checked={formData.isRecurring}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            This is a recurring expense
                        </label>
                    </div>

                    {formData.isRecurring && (
                        <div className="form-group">
                            <label htmlFor="recurringType" className="form-label">
                                Recurring Frequency
                            </label>
                            <select
                                id="recurringType"
                                name="recurringType"
                                value={formData.recurringType}
                                onChange={handleChange}
                                className="form-select"
                            >
                                {recurringTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            <FiSave />
                            {loading ? 'Saving...' : 'Save Expense'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => navigate('/expenses')}
                        >
                            <FiX />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense; 