import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FiPieChart, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryExpenses, setCategoryExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchCategories();
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryExpenses();
        }
    }, [selectedCategory, selectedMonth, selectedYear]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/categories?month=${selectedMonth}&year=${selectedYear}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryExpenses = async () => {
        try {
            const response = await axios.get(`/api/categories/${selectedCategory}?month=${selectedMonth}&year=${selectedYear}`);
            setCategoryExpenses(response.data.expenses);
        } catch (error) {
            console.error('Error fetching category expenses:', error);
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

    const pieChartData = {
        labels: categories.map(cat => cat.name),
        datasets: [
            {
                data: categories.map(cat => cat.totalAmount),
                backgroundColor: categories.map(cat => getCategoryColor(cat.name)),
                borderWidth: 2,
                borderColor: '#ffffff'
            }
        ]
    };

    const barChartData = {
        labels: categories.map(cat => cat.name),
        datasets: [
            {
                label: 'Amount',
                data: categories.map(cat => cat.totalAmount),
                backgroundColor: categories.map(cat => getCategoryColor(cat.name)),
                borderColor: categories.map(cat => getCategoryColor(cat.name)),
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    const totalAmount = categories.reduce((sum, cat) => sum + cat.totalAmount, 0);

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
                <h1 className="text-white">Expense Categories</h1>
                <div className="section-subtitle">
                    Breakdown of your expenses by category for {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}
                </div>
            </div>

            {/* Month/Year Selector */}
            <div className="card mb-6">
                <h3 className="text-primary mb-4" style={{ color: '#111' }}>Filter Period</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#111' }}>Month</label>
                        <select
                            className="form-select"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <option key={month} value={month}>
                                    {format(new Date(2024, month - 1), 'MMMM')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#111' }}>Year</label>
                        <select
                            className="form-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card">
                    <div className="stat-value">RPS {totalAmount.toFixed(2)}</div>
                    <div className="stat-label">Total Expenses</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{categories.length}</div>
                    <div className="stat-label">Categories Used</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        RPS {totalAmount ? (totalAmount / categories.length).toFixed(2) : '0.00'}
                    </div>
                    <div className="stat-label">Average per Category</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {categories.length > 0 ? categories.reduce((sum, cat) => sum + cat.count, 0) : 0}
                    </div>
                    <div className="stat-label">Total Transactions</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-6" style={{ marginTop: '4rem' }}>
                <div className="chart-container">
                    <h3 className="text-primary mb-4 text-xl">
                        <FiPieChart className="inline mr-2" />
                        Category Distribution
                    </h3>
                    {categories.length > 0 ? (
                        <Pie data={pieChartData} options={chartOptions} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <p>No category data available</p>
                        </div>
                    )}
                </div>
                <div className="chart-container">
                    <h3 className="text-primary mb-4 text-xl">
                        <FiBarChart2 className="inline mr-2" />
                        Category Comparison
                    </h3>
                    {categories.length > 0 ? (
                        <Bar data={barChartData} options={chartOptions} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📈</div>
                            <p>No category data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Details */}
            <div className="card">
                <h3 className="text-primary text-xl mb-6">Category Breakdown</h3>
                {categories.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(category => (
                            <div
                                key={category.name}
                                className="border cursor-pointer transition-all hover:shadow-lg"
                                style={{
                                    borderColor: getCategoryColor(category.name),
                                    backgroundColor: getCategoryColor(category.name) + '22',
                                    borderRadius: '2rem .1rem 2rem 0',
                                    padding: '1rem 1.5rem 1.5rem 1.5rem'
                                }}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: getCategoryColor(category.name) }}
                                    ></div>
                                    <span
                                        className="text-xs font-semibold px-5 py-1 rounded-full"
                                        style={{
                                            backgroundColor: getCategoryColor(category.name),
                                            color: '#fff',
                                            minWidth: '2.5rem',
                                            display: 'inline-block',
                                            letterSpacing: '0.02em',
                                            paddingLeft: '2px'
                                        }}
                                    >
                                        {((category.totalAmount / totalAmount) * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <h4 className="text-primary font-semibold mb-2">{category.name}</h4>
                                <div className="text-primary text-2xl font-bold mb-2">
                                    RPS {category.totalAmount.toFixed(2)}
                                </div>
                                <div className="text-secondary text-sm">
                                    {category.count} transaction{category.count !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <p>No categories found for the selected period</p>
                    </div>
                )}
            </div>

            {/* Category Expenses Modal */}
            {selectedCategory && (
                <div className="modal-overlay" onClick={() => setSelectedCategory(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-primary text-xl">
                                <FiCalendar className="inline mr-2" />
                                {selectedCategory} Expenses
                            </h3>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="btn btn-outline"
                            >
                                Close
                            </button>
                        </div>
                        {categoryExpenses.length > 0 ? (
                            <div className="list">
                                {categoryExpenses.map(expense => (
                                    <div key={expense._id} className="list-item">
                                        <div>
                                            <div className="text-primary font-medium">
                                                {expense.description}
                                            </div>
                                            <div className="text-secondary text-sm">
                                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                                                {expense.location && ` • ${expense.location}`}
                                            </div>
                                        </div>
                                        <div className="text-primary font-semibold">
                                            ${expense.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📝</div>
                                <p>No expenses found for this category</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories; 