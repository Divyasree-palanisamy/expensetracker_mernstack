import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiHeart, FiTrendingUp, FiTrendingDown, FiSmile, FiActivity, FiTarget, FiBookOpen, FiZap, FiPlay, FiBarChart, FiDollarSign, FiAlertCircle, FiPlayCircle, FiX } from 'react-icons/fi';
import WellnessGame from '../components/WellnessGame';

const Wellness = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [showWellnessGame, setShowWellnessGame] = useState(false);
    const [showGameModal, setShowGameModal] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [selectedPeriod]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/expenses?period=${selectedPeriod}`);
            // Extract expenses array from response
            const expensesData = response.data.expenses || response.data || [];
            setExpenses(expensesData);
        } catch (error) {
            setError('Failed to fetch expenses');
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate mood-spending insights
    const calculateMoodInsights = () => {
        const moodData = {};
        let totalSpent = 0;
        let emotionalSpendingCount = 0;
        let emotionalSpendingTotal = 0;

        // Ensure expenses is an array
        if (!Array.isArray(expenses)) {
            return {
                moodData: {},
                totalSpent: 0,
                emotionalSpendingCount: 0,
                emotionalSpendingTotal: 0,
                emotionalSpendingPercentage: 0
            };
        }

        expenses.forEach(expense => {
            const mood = expense.mood || 'neutral';
            if (!moodData[mood]) {
                moodData[mood] = { count: 0, total: 0, avgAmount: 0 };
            }
            moodData[mood].count++;
            moodData[mood].total += expense.amount;
            totalSpent += expense.amount;

            if (expense.emotionalSpending) {
                emotionalSpendingCount++;
                emotionalSpendingTotal += expense.amount;
            }
        });

        // Calculate averages
        Object.keys(moodData).forEach(mood => {
            moodData[mood].avgAmount = moodData[mood].total / moodData[mood].count;
        });

        return {
            moodData,
            totalSpent,
            emotionalSpendingCount,
            emotionalSpendingTotal,
            emotionalSpendingPercentage: totalSpent > 0 ? (emotionalSpendingTotal / totalSpent) * 100 : 0
        };
    };

    // Get wellness tips based on spending patterns
    const getWellnessTips = () => {
        const insights = calculateMoodInsights();
        const tips = [];

        // Tip based on emotional spending
        if (insights.emotionalSpendingPercentage > 30) {
            tips.push({
                icon: '💭',
                title: 'Emotional Spending Alert',
                content: 'You\'re spending a significant amount when emotional. Try waiting 24 hours before making non-essential purchases.',
                type: 'warning',
                color: 'from-red-500 to-pink-500'
            });
        }

        // Tip based on mood patterns
        const moodData = insights.moodData;
        if (moodData.sad && moodData.sad.avgAmount > 50) {
            tips.push({
                icon: '😢',
                title: 'Sadness & Spending',
                content: 'You tend to spend more when feeling sad. Consider alternative activities like calling a friend or going for a walk.',
                type: 'insight',
                color: 'from-blue-500 to-indigo-500'
            });
        }

        if (moodData.stressed && moodData.stressed.avgAmount > 40) {
            tips.push({
                icon: '😰',
                title: 'Stress Spending Pattern',
                content: 'Stress seems to trigger higher spending. Try deep breathing exercises before making purchases.',
                type: 'insight',
                color: 'from-orange-500 to-red-500'
            });
        }

        // General wellness tips
        tips.push({
            icon: '🎯',
            title: 'Mindful Spending',
            content: 'Before each purchase, ask yourself: "Do I need this, or do I want this?" Take a moment to reflect.',
            type: 'tip',
            color: 'from-green-500 to-emerald-500'
        });

        tips.push({
            icon: '📱',
            title: 'Digital Detox',
            content: 'Unsubscribe from shopping emails and remove shopping apps from your phone to reduce impulse buying.',
            type: 'tip',
            color: 'from-purple-500 to-pink-500'
        });

        return tips;
    };

    const insights = calculateMoodInsights();
    const wellnessTips = getWellnessTips();

    const moodEmojis = {
        happy: '😊',
        sad: '😢',
        stressed: '😰',
        excited: '🤩',
        neutral: '😐',
        anxious: '😨',
        content: '😌',
        frustrated: '😤'
    };

    const moodColors = {
        happy: 'bg-gradient-to-r from-green-400 to-emerald-500',
        sad: 'bg-gradient-to-r from-blue-400 to-indigo-500',
        stressed: 'bg-gradient-to-r from-red-400 to-pink-500',
        excited: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        neutral: 'bg-gradient-to-r from-gray-400 to-slate-500',
        anxious: 'bg-gradient-to-r from-purple-400 to-violet-500',
        content: 'bg-gradient-to-r from-teal-400 to-cyan-500',
        frustrated: 'bg-gradient-to-r from-orange-400 to-red-500'
    };

    if (loading) {
        return (
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Financial Wellness</h1>
                    <p className="page-subtitle">Understanding your spending patterns and mental health</p>
                </div>
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 font-medium">Loading your wellness insights...</p>
                    <p className="text-sm text-gray-500 mt-2">Analyzing your spending patterns</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 md:px-12 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4 drop-shadow-lg">Financial Wellness</h1>
                    <p className="text-2xl text-gray-700 font-medium">Understanding your spending patterns and mental health</p>
                </div>

                {/* Period Selector */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                        <label className="text-lg font-semibold text-gray-800 mr-4">View insights for:</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="text-lg px-4 py-2 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>

                {/* Mood Insights Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiSmile className="mr-3 text-purple-500 text-4xl" />
                        Mood-Spending Insights
                    </h2>

                    {Object.keys(insights.moodData).length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(insights.moodData).map(([mood, data]) => (
                                <div key={mood} className={`${moodColors[mood]} rounded-2xl p-6 text-white shadow-lg`}>
                                    <div className="text-4xl mb-3">{moodEmojis[mood]}</div>
                                    <h3 className="text-xl font-bold mb-2 capitalize">{mood}</h3>
                                    <div className="space-y-2 text-lg">
                                        <p>Purchases: <span className="font-bold">{data.count}</span></p>
                                        <p>Total: <span className="font-bold">${data.total.toFixed(2)}</span></p>
                                        <p>Average: <span className="font-bold">${data.avgAmount.toFixed(2)}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-xl text-gray-600">No mood data available yet. Start tracking your mood with expenses!</p>
                        </div>
                    )}
                </div>

                {/* Emotional Spending Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiHeart className="mr-3 text-pink-500 text-4xl" />
                        Emotional Spending Analysis
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl p-6 text-white text-center">
                            <div className="text-4xl mb-3">💔</div>
                            <h3 className="text-xl font-bold mb-2">Emotional Purchases</h3>
                            <p className="text-3xl font-bold">{insights.emotionalSpendingCount}</p>
                            <p className="text-lg">transactions</p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white text-center">
                            <div className="text-4xl mb-3">💰</div>
                            <h3 className="text-xl font-bold mb-2">Total Spent</h3>
                            <p className="text-3xl font-bold">${insights.emotionalSpendingTotal.toFixed(2)}</p>
                            <p className="text-lg">on emotional purchases</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white text-center">
                            <div className="text-4xl mb-3">📈</div>
                            <h3 className="text-xl font-bold mb-2">Percentage</h3>
                            <p className="text-3xl font-bold">{insights.emotionalSpendingPercentage.toFixed(1)}%</p>
                            <p className="text-lg">of total spending</p>
                        </div>
                    </div>
                </div>

                {/* Wellness Tips Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiTarget className="mr-3 text-green-500 text-4xl" />
                        Personalized Wellness Tips
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {wellnessTips.map((tip, index) => (
                            <div key={index} className={`bg-gradient-to-r ${tip.color} rounded-2xl p-6 text-white shadow-lg`}>
                                <div className="text-4xl mb-3">{tip.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                                <p className="text-lg leading-relaxed">{tip.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wellness Games Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                        <FiZap className="mr-3 text-yellow-500 text-4xl" />
                        Interactive Wellness Games
                    </h2>

                    <div className="text-center">
                        <p className="text-xl text-gray-700 mb-6">Take a break and practice mindfulness with our wellness games</p>
                        <button
                            onClick={() => setShowGameModal(true)}
                            className="bg-white text-black text-2xl font-bold px-10 py-4 rounded-full border-2 border-gray-300 hover:bg-gray-100 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-purple-200 flex items-center mx-auto"
                        >
                            <FiPlayCircle className="mr-3 text-3xl" />
                            Play Wellness Games
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Games */}
            {showGameModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
                    <div className="bg-white rounded-2xl shadow-3xl p-8 max-w-5xl w-full mx-4 relative border-4 border-purple-300 transform scale-100 animate-fadeIn" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' }}>
                        <button
                            className="absolute -top-4 -right-4 text-white hover:text-red-400 text-2xl focus:outline-none bg-red-500 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-red-600 z-10"
                            onClick={() => setShowGameModal(false)}
                            aria-label="Close"
                        >
                            <FiX />
                        </button>
                        <WellnessGame isOpen={showGameModal} onClose={() => setShowGameModal(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wellness; 