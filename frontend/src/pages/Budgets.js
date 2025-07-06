import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    LinearProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    TrendingUp,
    Warning
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import toast from 'react-hot-toast';

const categories = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
];

const BudgetForm = ({ open, onClose, budget, onSubmit }) => {
    const [formData, setFormData] = useState({
        amount: '',
        period: 'monthly',
        categories: [],
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });

    useEffect(() => {
        if (budget) {
            setFormData({
                amount: budget.amount.toString(),
                period: budget.period,
                categories: budget.categories || [],
                startDate: new Date(budget.startDate),
                endDate: new Date(budget.endDate)
            });
        } else {
            setFormData({
                amount: '',
                period: 'monthly',
                categories: [],
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
            });
        }
    }, [budget]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.startDate || !formData.endDate) {
            toast.error('Please fill in all required fields');
            return;
        }
        onSubmit(formData);
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setFormData({ ...formData, categories: typeof value === 'string' ? value.split(',') : value });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#222', color: '#00BFFF' }}>
                {budget ? 'Edit Budget' : 'Create New Budget'}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#222', pt: 2 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Budget Amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#ccc',
                                        '& fieldset': { borderColor: '#333' },
                                        '&:hover fieldset': { borderColor: '#00BFFF' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#ccc' }
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#ccc' }}>Period</InputLabel>
                                <Select
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    sx={{
                                        color: '#ccc',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00BFFF' }
                                    }}
                                >
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#ccc' }}>Categories (Optional)</InputLabel>
                                <Select
                                    multiple
                                    value={formData.categories}
                                    onChange={handleCategoryChange}
                                    sx={{
                                        color: '#ccc',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00BFFF' }
                                    }}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={formData.startDate}
                                    onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: '#ccc',
                                                    '& fieldset': { borderColor: '#333' },
                                                    '&:hover fieldset': { borderColor: '#00BFFF' }
                                                },
                                                '& .MuiInputLabel-root': { color: '#ccc' }
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={formData.endDate}
                                    onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: '#ccc',
                                                    '& fieldset': { borderColor: '#333' },
                                                    '&:hover fieldset': { borderColor: '#00BFFF' }
                                                },
                                                '& .MuiInputLabel-root': { color: '#ccc' }
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#222' }}>
                <Button onClick={onClose} sx={{ color: '#ccc' }}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#00BFFF' }}>
                    {budget ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const BudgetCard = ({ budget, onEdit, onDelete }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return '#F44336';
        if (percentage >= 80) return '#FF9800';
        return '#4CAF50';
    };

    const getStatusIcon = () => {
        if (budget.isOverBudget) {
            return <Warning sx={{ color: '#F44336' }} />;
        }
        return <TrendingUp sx={{ color: '#4CAF50' }} />;
    };

    return (
        <Card sx={{ bgcolor: '#222', border: '1px solid #333', height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" color="#00BFFF" gutterBottom>
                            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                        </Typography>
                        <Typography variant="body2" color="#666">
                            {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => onEdit(budget)} sx={{ color: '#00BFFF' }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(budget._id)} sx={{ color: '#F44336' }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStatusIcon()}
                    <Typography variant="h5" color="#ccc" sx={{ ml: 1, fontWeight: 'bold' }}>
                        {formatCurrency(budget.amount)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#ccc">
                            Spent: {formatCurrency(budget.totalSpent)}
                        </Typography>
                        <Typography variant="body2" color="#ccc">
                            {budget.percentageUsed.toFixed(1)}%
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
                                bgcolor: getProgressColor(budget.percentageUsed),
                                borderRadius: 4
                            }
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        variant="body2"
                        color={budget.isOverBudget ? '#F44336' : '#4CAF50'}
                        sx={{ fontWeight: 'bold' }}
                    >
                        {budget.isOverBudget
                            ? `Over budget by ${formatCurrency(Math.abs(budget.remaining))}`
                            : `${formatCurrency(budget.remaining)} remaining`
                        }
                    </Typography>
                    <Chip
                        label={budget.isOverBudget ? 'Over Budget' : 'On Track'}
                        size="small"
                        sx={{
                            bgcolor: budget.isOverBudget ? '#F44336' : '#4CAF50',
                            color: '#fff',
                            fontSize: '0.7rem'
                        }}
                    />
                </Box>

                {budget.categories && budget.categories.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="#666" sx={{ display: 'block', mb: 1 }}>
                            Categories:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {budget.categories.map((category) => (
                                <Chip
                                    key={category}
                                    label={category}
                                    size="small"
                                    sx={{
                                        bgcolor: '#444',
                                        color: '#ccc',
                                        fontSize: '0.6rem'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/budgets/with-progress');
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
            toast.error('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (editingBudget) {
                await axios.put(`/api/budgets/${editingBudget._id}`, formData);
                toast.success('Budget updated successfully');
            } else {
                await axios.post('/api/budgets', formData);
                toast.success('Budget created successfully');
            }
            setDialogOpen(false);
            setEditingBudget(null);
            fetchBudgets();
        } catch (error) {
            console.error('Error saving budget:', error);
            toast.error('Failed to save budget');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await axios.delete(`/api/budgets/${id}`);
                toast.success('Budget deleted successfully');
                fetchBudgets();
            } catch (error) {
                console.error('Error deleting budget:', error);
                toast.error('Failed to delete budget');
            }
        }
    };

    const handleEdit = (budget) => {
        setEditingBudget(budget);
        setDialogOpen(true);
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
                            Budgets
                        </Typography>
                        <Typography variant="h6" color="#ccc" sx={{ mt: 1 }}>
                            Track your spending against your budgets
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                        sx={{ bgcolor: '#00BFFF', '&:hover': { bgcolor: '#0099CC' } }}
                    >
                        Create Budget
                    </Button>
                </Box>

                {/* Summary Stats */}
                {budgets.length > 0 && (
                    <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, mb: 4, borderRadius: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="#00BFFF" sx={{ fontWeight: 'bold' }}>
                                        {budgets.length}
                                    </Typography>
                                    <Typography variant="body2" color="#ccc">
                                        Active Budgets
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="#4CAF50" sx={{ fontWeight: 'bold' }}>
                                        {budgets.filter(b => !b.isOverBudget).length}
                                    </Typography>
                                    <Typography variant="body2" color="#ccc">
                                        On Track
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="#F44336" sx={{ fontWeight: 'bold' }}>
                                        {budgets.filter(b => b.isOverBudget).length}
                                    </Typography>
                                    <Typography variant="body2" color="#ccc">
                                        Over Budget
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* Budgets Grid */}
                {budgets.length === 0 ? (
                    <Paper elevation={4} sx={{ bgcolor: '#222', p: 6, borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="#ccc" gutterBottom>
                            No budgets created yet
                        </Typography>
                        <Typography variant="body1" color="#666" sx={{ mb: 3 }}>
                            Create your first budget to start tracking your spending
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setDialogOpen(true)}
                            sx={{ bgcolor: '#00BFFF', '&:hover': { bgcolor: '#0099CC' } }}
                        >
                            Create Your First Budget
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {budgets.map((budget) => (
                            <Grid item xs={12} sm={6} lg={4} key={budget._id}>
                                <BudgetCard
                                    budget={budget}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Budget Form Dialog */}
                <BudgetForm
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setEditingBudget(null);
                    }}
                    budget={editingBudget}
                    onSubmit={handleSubmit}
                />
            </Container>
        </Box>
    );
};

export default Budgets; 