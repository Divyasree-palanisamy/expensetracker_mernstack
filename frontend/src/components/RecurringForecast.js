import React, { useState, useEffect } from 'react';
import './RecurringForecast.css';

const RecurringForecast = ({ recurringExpenses }) => {
    const [forecast, setForecast] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('next-month');

    useEffect(() => {
        if (recurringExpenses && recurringExpenses.length > 0) {
            calculateForecast();
        }
    }, [recurringExpenses, selectedPeriod]);

    const calculateForecast = () => {
        const now = new Date();
        let targetDate = new Date();

        switch (selectedPeriod) {
            case 'next-month':
                targetDate.setMonth(targetDate.getMonth() + 1);
                break;
            case 'next-3-months':
                targetDate.setMonth(targetDate.getMonth() + 3);
                break;
            case 'next-6-months':
                targetDate.setMonth(targetDate.getMonth() + 6);
                break;
            default:
                targetDate.setMonth(targetDate.getMonth() + 1);
        }

        const forecastData = {
            period: selectedPeriod,
            targetDate: targetDate,
            totalForecast: 0,
            categoryBreakdown: {},
            upcomingExpenses: [],
            savingsOpportunity: 0
        };

        recurringExpenses.forEach(expense => {
            if (expense.isActive) {
                const nextDueDate = new Date(expense.nextDueDate);
                const amount = parseFloat(expense.amount);

                // Calculate how many times this expense will occur in the forecast period
                let occurrences = 0;
                let currentDate = new Date(nextDueDate);

                while (currentDate <= targetDate) {
                    occurrences++;

                    // Add to upcoming expenses if within next 30 days
                    if (currentDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
                        forecastData.upcomingExpenses.push({
                            ...expense,
                            dueDate: new Date(currentDate),
                            amount: amount
                        });
                    }

                    // Calculate next occurrence based on frequency
                    switch (expense.frequency) {
                        case 'daily':
                            currentDate.setDate(currentDate.getDate() + 1);
                            break;
                        case 'weekly':
                            currentDate.setDate(currentDate.getDate() + 7);
                            break;
                        case 'monthly':
                            currentDate.setMonth(currentDate.getMonth() + 1);
                            break;
                        case 'yearly':
                            currentDate.setFullYear(currentDate.getFullYear() + 1);
                            break;
                        default:
                            currentDate.setMonth(currentDate.getMonth() + 1);
                    }
                }

                const totalForExpense = amount * occurrences;
                forecastData.totalForecast += totalForExpense;

                // Add to category breakdown
                if (forecastData.categoryBreakdown[expense.category]) {
                    forecastData.categoryBreakdown[expense.category] += totalForExpense;
                } else {
                    forecastData.categoryBreakdown[expense.category] = totalForExpense;
                }
            }
        });

        // Sort upcoming expenses by due date
        forecastData.upcomingExpenses.sort((a, b) => a.dueDate - b.dueDate);

        // Calculate potential savings (assuming 10% reduction opportunity)
        forecastData.savingsOpportunity = forecastData.totalForecast * 0.1;

        setForecast(forecastData);
    };

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case 'next-month':
                return 'Next Month';
            case 'next-3-months':
                return 'Next 3 Months';
            case 'next-6-months':
                return 'Next 6 Months';
            default:
                return 'Next Month';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
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

    if (!recurringExpenses || recurringExpenses.length === 0) {
        return (
            <div className="recurring-forecast">
                <div className="forecast-header">
                    <h3>📅 Recurring Expense Forecast</h3>
                    <p className="no-data">Add some recurring expenses to see your forecast!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recurring-forecast">
            <div className="forecast-header">
                <h3>📅 Recurring Expense Forecast</h3>
                <div className="period-selector">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        <option value="next-month">Next Month</option>
                        <option value="next-3-months">Next 3 Months</option>
                        <option value="next-6-months">Next 6 Months</option>
                    </select>
                </div>
            </div>

            {forecast && (
                <>
                    <div className="forecast-summary">
                        <div className="summary-card total-forecast">
                            <div className="summary-icon">💰</div>
                            <div className="summary-content">
                                <h4>Total Forecast</h4>
                                <p className="summary-amount">RPS {forecast.totalForecast.toFixed(2)}</p>
                                <span className="summary-period">{getPeriodLabel()}</span>
                            </div>
                        </div>

                        <div className="summary-card savings-opportunity">
                            <div className="summary-icon">💡</div>
                            <div className="summary-content">
                                <h4>Potential Savings</h4>
                                <p className="summary-amount">RPS {forecast.savingsOpportunity.toFixed(2)}</p>
                                <span className="summary-period">10% reduction</span>
                            </div>
                        </div>

                        <div className="summary-card upcoming-count">
                            <div className="summary-icon">⏰</div>
                            <div className="summary-content">
                                <h4>Upcoming (30 days)</h4>
                                <p className="summary-amount">{forecast.upcomingExpenses.length}</p>
                                <span className="summary-period">expenses due</span>
                            </div>
                        </div>
                    </div>

                    <div className="forecast-details">
                        <div className="category-breakdown">
                            <h4>Category Breakdown</h4>
                            <div className="breakdown-list">
                                {Object.entries(forecast.categoryBreakdown)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([category, amount]) => (
                                        <div key={category} className="breakdown-item">
                                            <div className="category-info">
                                                <span className="category-icon">{getCategoryIcon(category)}</span>
                                                <span className="category-name">{category}</span>
                                            </div>
                                            <span className="category-amount">RPS {amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="upcoming-expenses">
                            <h4>Upcoming Expenses (Next 30 Days)</h4>
                            {forecast.upcomingExpenses.length > 0 ? (
                                <div className="upcoming-list">
                                    {forecast.upcomingExpenses.slice(0, 5).map((expense, index) => (
                                        <div key={index} className="upcoming-item">
                                            <div className="expense-info">
                                                <span className="expense-icon">{getCategoryIcon(expense.category)}</span>
                                                <div className="expense-details">
                                                    <span className="expense-name">{expense.description}</span>
                                                    <span className="expense-date">Due: {formatDate(expense.dueDate)}</span>
                                                </div>
                                            </div>
                                            <span className="expense-amount">RPS {expense.amount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {forecast.upcomingExpenses.length > 5 && (
                                        <div className="more-expenses">
                                            +{forecast.upcomingExpenses.length - 5} more expenses
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="no-upcoming">No expenses due in the next 30 days</p>
                            )}
                        </div>
                    </div>

                    <div className="forecast-insights">
                        <h4>💡 Insights</h4>
                        <div className="insights-list">
                            <div className="insight-item">
                                <span className="insight-icon">📊</span>
                                <span>Your largest recurring expense category is <strong>{Object.entries(forecast.categoryBreakdown).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}</strong></span>
                            </div>
                            <div className="insight-item">
                                <span className="insight-icon">💰</span>
                                <span>You could save <strong>RPS {forecast.savingsOpportunity.toFixed(2)}</strong> by reducing expenses by 10%</span>
                            </div>
                            <div className="insight-item">
                                <span className="insight-icon">📅</span>
                                <span>Plan ahead for <strong>{forecast.upcomingExpenses.length}</strong> expenses in the next 30 days</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecurringForecast; 