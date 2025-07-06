import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import {
    FiDollarSign,
    FiTrendingUp,
    FiTrendingDown,
    FiPieChart,
    FiPlus,
    FiCalendar,
    FiMapPin
} from 'react-icons/fi';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import RecurringForecast from '../components/RecurringForecast';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = ({ onShowExpenseSplitter }) => {
    const [summary, setSummary] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchDashboardData();
    }, [selectedMonth, selectedYear]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [summaryRes, expensesRes, recurringRes] = await Promise.all([
                axios.get(`/api/expenses/summary?month=${selectedMonth}&year=${selectedYear}`),
                axios.get('/api/expenses?limit=5&sortBy=date&sortOrder=desc'),
                axios.get('/api/recurring')
            ]);

            setSummary(summaryRes.data);
            setRecentExpenses(expensesRes.data.expenses);
            setRecurringExpenses(recurringRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
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
        labels: Object.keys(summary?.categoryTotals || {}),
        datasets: [
            {
                data: Object.values(summary?.categoryTotals || {}),
                backgroundColor: Object.keys(summary?.categoryTotals || {}).map(getCategoryColor),
                borderWidth: 2,
                borderColor: '#ffffff'
            }
        ]
    };

    const lineChartData = {
        labels: Object.keys(summary?.dailyTotals || {}).map(date =>
            format(new Date(date), 'MMM dd')
        ),
        datasets: [
            {
                label: 'Daily Expenses',
                data: Object.values(summary?.dailyTotals || {}),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
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
                <h1 className="text-white">Dashboard</h1>
                <div className="section-subtitle">
                    Overview of your expenses for {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <div className="stat-card">
                    <div className="stat-value">RPS {summary?.totalAmount?.toFixed(2) || '0.00'}</div>
                    <div className="stat-label">Total Expenses</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{summary?.expenseCount || 0}</div>
                    <div className="stat-label">Total Transactions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        RPS {summary?.totalAmount ? (summary.totalAmount / summary.expenseCount).toFixed(2) : '0.00'}
                    </div>
                    <div className="stat-label">Average per Transaction</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        RPS {summary?.totalAmount ? (summary.totalAmount / new Date(selectedYear, selectedMonth, 0).getDate()).toFixed(2) : '0.00'}
                    </div>
                    <div className="stat-label">Daily Average</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-6" style={{ marginTop: '2.5rem' }}>
                <div className="chart-container">
                    <h3 className="text-primary mb-4 text-xl">Expenses by Category</h3>
                    {Object.keys(summary?.categoryTotals || {}).length > 0 ? (
                        <Pie data={pieChartData} options={chartOptions} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <p>No data available for the selected period</p>
                        </div>
                    )}
                </div>
                <div className="chart-container">
                    <h3 className="text-primary mb-4 text-xl">Daily Expense Trend</h3>
                    {Object.keys(summary?.dailyTotals || {}).length > 0 ? (
                        <Line data={lineChartData} options={chartOptions} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📈</div>
                            <p>No data available for the selected period</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-primary text-xl">Recent Expenses</h3>
                    <Link to="/expenses" className="btn btn-primary">
                        <FiPlus />
                        Add Expense
                    </Link>
                </div>
                {recentExpenses.length > 0 ? (
                    <div className="list">
                        {recentExpenses.map(expense => (
                            <div key={expense._id} className="list-item">
                                <div className="flex items-center">
                                    <div className="expense-icon">
                                        {getCategoryIcon(expense.category)}
                                    </div>
                                    <div className="expense-details">
                                        <div className="expense-title">{expense.description}</div>
                                        <div className="expense-meta">
                                            <span className="expense-category">{expense.category}</span>
                                            <span className="expense-date">
                                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="expense-amount">
                                    RPS {expense.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <p>No expenses yet. Add your first expense to get started!</p>
                    </div>
                )}
            </div>

            {/* Recurring Forecast */}
            <div className="mt-8">
                <RecurringForecast recurringExpenses={recurringExpenses} />
            </div>
        </div>
    );
};

const getCategoryIcon = (category) => {
    const icons = {
        'Food': '🍕',
        'Transport': '🚗',
        'Shopping': '🛍️',
        'Bills': '📄',
        'Entertainment': '🎬',
        'Health': '💊',
        'Education': '📚',
        'Other': '📌'
    };
    return icons[category] || '📌';
};

export default Dashboard; 