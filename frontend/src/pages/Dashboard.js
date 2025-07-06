import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    IconButton,
    Button
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    AccountBalance,
    Savings,
    Add as AddIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
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
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

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

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, transactionsRes, budgetsRes] = await Promise.all([
                axios.get('/api/transactions/stats'),
                axios.get('/api/transactions?limit=5'),
                axios.get('/api/budgets/with-progress')
            ]);

            setStats(statsRes.data);
            setRecentTransactions(transactionsRes.data);
            setBudgets(budgetsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getChartData = () => {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return {
            labels,
            datasets: [
                {
                    label: 'Income',
                    data: [1200, 1900, 3000, 5000, 2000, 3000],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Expenses',
                    data: [800, 1600, 2800, 4500, 1800, 2500],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                }
            ]
        };
    };

    const getCategoryData = () => {
        if (!stats?.categoryBreakdown) return null;

        const categories = Object.keys(stats.categoryBreakdown);
        const amounts = Object.values(stats.categoryBreakdown);

        return {
            labels: categories,
            datasets: [
                {
                    data: amounts,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ],
                    borderWidth: 2,
                    borderColor: '#222'
                }
            ]
        };
    };

    if (loading) {
        return (
            <Box sx={{ bgcolor: '#181818', minHeight: '100vh', py: 6 }}>
                <Container maxWidth="lg">
                    <LinearProgress sx={{ bgcolor: '#333', '& .MuiLinearProgress-bar': { bgcolor: '#00BFFF' } }} />
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#181818', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                            Welcome back, {user?.name}!
                        </Typography>
                        <Typography variant="h6" color="#ccc" sx={{ mt: 1 }}>
                            Here's your financial overview
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={fetchDashboardData}
                        sx={{ color: '#00BFFF', bgcolor: '#222', '&:hover': { bgcolor: '#333' } }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#222', border: '1px solid #333' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TrendingUp sx={{ color: '#4CAF50', mr: 1 }} />
                                    <Typography variant="h6" color="#ccc">Total Income</Typography>
                                </Box>
                                <Typography variant="h4" color="#4CAF50" sx={{ fontWeight: 'bold' }}>
                                    {stats ? formatCurrency(stats.totalIncome) : '$0'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#222', border: '1px solid #333' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TrendingDown sx={{ color: '#F44336', mr: 1 }} />
                                    <Typography variant="h6" color="#ccc">Total Expenses</Typography>
                                </Box>
                                <Typography variant="h4" color="#F44336" sx={{ fontWeight: 'bold' }}>
                                    {stats ? formatCurrency(stats.totalExpenses) : '$0'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#222', border: '1px solid #333' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <AccountBalance sx={{ color: '#00BFFF', mr: 1 }} />
                                    <Typography variant="h6" color="#ccc">Net Amount</Typography>
                                </Box>
                                <Typography
                                    variant="h4"
                                    color={stats?.netAmount >= 0 ? '#4CAF50' : '#F44336'}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {stats ? formatCurrency(stats.netAmount) : '$0'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#222', border: '1px solid #333' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Savings sx={{ color: '#FF9800', mr: 1 }} />
                                    <Typography variant="h6" color="#ccc">Active Budgets</Typography>
                                </Box>
                                <Typography variant="h4" color="#FF9800" sx={{ fontWeight: 'bold' }}>
                                    {budgets.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts and Content */}
                <Grid container spacing={4}>
                    {/* Income vs Expenses Chart */}
                    <Grid item xs={12} lg={8}>
                        <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" color="#00BFFF" gutterBottom>
                                Income vs Expenses
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Line
                                    data={getChartData()}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                labels: { color: '#ccc' }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: { color: '#ccc' },
                                                grid: { color: '#333' }
                                            },
                                            y: {
                                                ticks: { color: '#ccc' },
                                                grid: { color: '#333' }
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Category Breakdown */}
                    <Grid item xs={12} lg={4}>
                        <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" color="#00BFFF" gutterBottom>
                                Spending by Category
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                {getCategoryData() && (
                                    <Doughnut
                                        data={getCategoryData()}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: { color: '#ccc' }
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Recent Transactions */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" color="#00BFFF">
                                    Recent Transactions
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    sx={{ color: '#00BFFF', borderColor: '#00BFFF' }}
                                >
                                    Add New
                                </Button>
                            </Box>
                            <Box>
                                {recentTransactions.map((transaction) => (
                                    <Box
                                        key={transaction._id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            py: 1,
                                            borderBottom: '1px solid #333'
                                        }}
                                    >
                                        <Box>
                                            <Typography color="#ccc" variant="body2">
                                                {transaction.description || transaction.category}
                                            </Typography>
                                            <Typography color="#666" variant="caption">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography
                                                color={transaction.type === 'income' ? '#4CAF50' : '#F44336'}
                                                variant="body2"
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </Typography>
                                            <Chip
                                                label={transaction.category}
                                                size="small"
                                                sx={{
                                                    bgcolor: '#333',
                                                    color: '#ccc',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Budget Progress */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" color="#00BFFF">
                                    Budget Progress
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    sx={{ color: '#00BFFF', borderColor: '#00BFFF' }}
                                >
                                    Create Budget
                                </Button>
                            </Box>
                            <Box>
                                {budgets.slice(0, 3).map((budget) => (
                                    <Box key={budget._id} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography color="#ccc" variant="body2">
                                                {budget.period} Budget
                                            </Typography>
                                            <Typography color="#ccc" variant="body2">
                                                {formatCurrency(budget.totalSpent)} / {formatCurrency(budget.amount)}
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(budget.percentageUsed, 100)}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: '#333',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: budget.isOverBudget ? '#F44336' : '#4CAF50',
                                                    borderRadius: 4
                                                }
                                            }}
                                        />
                                        <Typography
                                            color={budget.isOverBudget ? '#F44336' : '#4CAF50'}
                                            variant="caption"
                                            sx={{ mt: 0.5, display: 'block' }}
                                        >
                                            {budget.isOverBudget ? 'Over budget' : `${budget.percentageUsed.toFixed(1)}% used`}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard; 