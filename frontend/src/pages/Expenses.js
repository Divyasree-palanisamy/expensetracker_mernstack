import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiDownload,
    FiEdit2,
    FiTrash2,
    FiCalendar,
    FiMapPin,
    FiDollarSign
} from 'react-icons/fi';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        category: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        'Food', 'Transport', 'Entertainment', 'Shopping',
        'Bills', 'Healthcare', 'Education', 'Travel', 'Other'
    ];

    useEffect(() => {
        fetchExpenses();
    }, [currentPage, filters]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...filters
            };

            const response = await axios.get('/api/expenses', { params });
            setExpenses(response.data.expenses);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`/api/expenses/${id}`);
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    const handleExport = async () => {
        try {
            const params = new URLSearchParams(filters);
            const response = await axios.get(`/api/expenses/export?${params}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'expenses.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting expenses:', error);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            Food: '#f59e0b',
            Transport: '#3b82f6',
            Entertainment: '#8b5cf6',
            Shopping: '#10b981',
            Bills: '#ef4444',
            Healthcare: '#06b6d4',
            Education: '#f97316',
            Travel: '#84cc16',
            Other: '#64748b'
        };
        return colors[category] || '#64748b';
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
                <h1 className="text-white">Expenses</h1>
                <div className="section-subtitle">Manage and track your expenses</div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-primary text-xl">Filter & Actions</h3>
                    <div className="btn-group">
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FiFilter />
                            Filters
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={handleExport}
                        >
                            <FiDownload />
                            Export CSV
                        </button>
                        <Link to="/expenses/add" className="btn btn-primary">
                            <FiPlus />
                            Add Expense
                        </Link>
                    </div>
                </div>

                {showFilters && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="form-group">
                            <label className="form-label">Search</label>
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="form-input pl-10"
                                    placeholder="Search expenses..."
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="form-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Expenses List */}
            <div className="card">
                <h3 className="text-primary text-xl mb-6">Expense Records</h3>
                {expenses.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(expense => (
                                    <tr key={expense._id}>
                                        <td>
                                            <div className="text-primary font-medium">
                                                {expense.description}
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="badge badge-primary"
                                                style={{ backgroundColor: getCategoryColor(expense.category) }}
                                            >
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-primary font-semibold">
                                                RPS {expense.amount.toFixed(2)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-secondary">
                                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-secondary">
                                                {expense.location || 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <Link
                                                    to={`/expenses/edit/${expense._id}`}
                                                    className="btn btn-outline btn-sm"
                                                >
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(expense._id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">💰</div>
                        <p>No expenses found</p>
                        <Link to="/expenses/add" className="btn btn-primary mt-4">
                            <FiPlus />
                            Add Your First Expense
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="btn btn-outline"
                        >
                            Previous
                        </button>
                        <span className="text-secondary">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="btn btn-outline"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Expenses; 