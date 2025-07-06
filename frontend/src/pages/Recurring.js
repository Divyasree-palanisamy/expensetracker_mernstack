import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCalendar,
    FiDollarSign,
    FiRepeat,
    FiPlay,
    FiPause
} from 'react-icons/fi';

const Recurring = () => {
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        description: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        paymentMethod: 'Cash',
        tags: ''
    });

    const categories = [
        'Food', 'Transport', 'Entertainment', 'Shopping',
        'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
    ];

    const frequencies = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    const paymentMethods = [
        'Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet'
    ];

    useEffect(() => {
        fetchRecurringExpenses();
    }, []);

    const fetchRecurringExpenses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/recurring');
            setRecurringExpenses(response.data);
        } catch (error) {
            console.error('Error fetching recurring expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount),
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            if (editingExpense) {
                await axios.put(`/api/recurring/${editingExpense._id}`, expenseData);
            } else {
                await axios.post('/api/recurring', expenseData);
            }

            setShowForm(false);
            setEditingExpense(null);
            resetForm();
            fetchRecurringExpenses();
        } catch (error) {
            console.error('Error saving recurring expense:', error);
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            amount: expense.amount.toString(),
            category: expense.category,
            description: expense.description || '',
            frequency: expense.frequency,
            startDate: new Date(expense.startDate).toISOString().split('T')[0],
            endDate: expense.endDate ? new Date(expense.endDate).toISOString().split('T')[0] : '',
            paymentMethod: expense.paymentMethod,
            tags: expense.tags ? expense.tags.join(', ') : ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recurring expense?')) {
            try {
                await axios.delete(`/api/recurring/${id}`);
                fetchRecurringExpenses();
            } catch (error) {
                console.error('Error deleting recurring expense:', error);
            }
        }
    };

    const handleAdvance = async (id) => {
        try {
            await axios.post(`/api/recurring/${id}/advance`);
            fetchRecurringExpenses();
        } catch (error) {
            console.error('Error advancing recurring expense:', error);
        }
    };

    const handleToggleActive = async (expense) => {
        try {
            await axios.put(`/api/recurring/${expense._id}`, {
                ...expense,
                isActive: !expense.isActive
            });
            fetchRecurringExpenses();
        } catch (error) {
            console.error('Error toggling recurring expense:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            amount: '',
            category: '',
            description: '',
            frequency: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            paymentMethod: 'Cash',
            tags: ''
        });
    };

    const getNextDueDate = (expense) => {
        const nextDue = new Date(expense.nextDueDate);
        return format(nextDue, 'MMM dd, yyyy');
    };

    const isOverdue = (expense) => {
        return new Date(expense.nextDueDate) < new Date();
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="section-header">
                <h1 className="text-white">Recurring Expenses</h1>
                <div className="section-subtitle">Manage your recurring expense patterns</div>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="card mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-primary text-xl">{editingExpense ? 'Edit' : 'Add'} Recurring Expense</h3>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingExpense(null);
                                resetForm();
                            }}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Amount *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="form-input"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Frequency *</label>
                                <select
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    className="form-select"
                                    required
                                >
                                    {frequencies.map(freq => (
                                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Start Date *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    className="form-select"
                                >
                                    {paymentMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="form-input"
                                    placeholder="Enter tags separated by commas"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="form-input"
                                rows="3"
                                placeholder="Optional description"
                            ></textarea>
                        </div>

                        <div className="btn-group mt-6">
                            <button type="submit" className="btn btn-primary">
                                {editingExpense ? 'Update' : 'Add'} Recurring Expense
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Recurring Expenses List */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-primary text-xl">Recurring Expense Patterns</h3>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary"
                    >
                        <FiPlus />
                        Add Recurring Expense
                    </button>
                </div>

                {recurringExpenses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recurringExpenses.map(expense => (
                            <div
                                key={expense._id}
                                className={`p-6 rounded-lg border transition-all hover:shadow-lg ${!expense.isActive ? 'opacity-60' : ''
                                    }`}
                                style={{
                                    borderColor: expense.isActive ? '#3b82f6' : '#e2e8f0',
                                    backgroundColor: expense.isActive ? '#f8fafc' : '#f1f5f9'
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-primary font-semibold mb-2">{expense.title}</h4>
                                        <div className="text-primary text-2xl font-bold mb-2">
                                            RPS {expense.amount.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleActive(expense)}
                                            className={`btn-icon${expense.isActive ? '' : ' btn-success'}`}
                                            title={expense.isActive ? 'Pause' : 'Activate'}
                                        >
                                            {expense.isActive ? <FiPause /> : <FiPlay />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="btn-icon"
                                            title="Edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expense._id)}
                                            className="btn-icon btn-danger"
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-secondary text-sm">
                                        <FiRepeat className="mr-2" />
                                        {expense.frequency.charAt(0).toUpperCase() + expense.frequency.slice(1)}
                                    </div>
                                    <div className="flex items-center text-secondary text-sm">
                                        <FiCalendar className="mr-2" />
                                        Next: {getNextDueDate(expense)}
                                        {isOverdue(expense) && (
                                            <span className="badge badge-danger ml-2">Overdue</span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-secondary text-sm">
                                        <FiDollarSign className="mr-2" />
                                        {expense.paymentMethod}
                                    </div>
                                </div>

                                {expense.description && (
                                    <p className="text-secondary text-sm mb-4">{expense.description}</p>
                                )}

                                {expense.tags && expense.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {expense.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="btn-group">
                                    <button
                                        onClick={() => handleAdvance(expense._id)}
                                        className="btn-icon"
                                        disabled={!expense.isActive}
                                        title="Advance"
                                    >
                                        <FiPlay />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔄</div>
                        <p>No recurring expenses set up yet</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn btn-primary mt-4"
                        >
                            <FiPlus />
                            Add Your First Recurring Expense
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recurring; 