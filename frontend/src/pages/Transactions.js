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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
    FilterList as FilterIcon,
    Search as SearchIcon
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

const TransactionForm = ({ open, onClose, transaction, onSubmit }) => {
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: new Date(),
        isRecurring: false
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                amount: transaction.amount.toString(),
                type: transaction.type,
                category: transaction.category,
                description: transaction.description || '',
                date: new Date(transaction.date),
                isRecurring: transaction.isRecurring || false
            });
        } else {
            setFormData({
                amount: '',
                type: 'expense',
                category: '',
                description: '',
                date: new Date(),
                isRecurring: false
            });
        }
    }, [transaction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#222', color: '#00BFFF' }}>
                {transaction ? 'Edit Transaction' : 'Add New Transaction'}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#222', pt: 2 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount"
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
                                <InputLabel sx={{ color: '#ccc' }}>Type</InputLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    sx={{
                                        color: '#ccc',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00BFFF' }
                                    }}
                                >
                                    <MenuItem value="expense">Expense</MenuItem>
                                    <MenuItem value="income">Income</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#ccc' }}>Category</InputLabel>
                                <Select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    sx={{
                                        color: '#ccc',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00BFFF' }
                                    }}
                                    required
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#ccc',
                                        '& fieldset': { borderColor: '#333' },
                                        '&:hover fieldset': { borderColor: '#00BFFF' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#ccc' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date"
                                    value={formData.date}
                                    onChange={(newValue) => setFormData({ ...formData, date: newValue })}
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
                    {transaction ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        search: ''
    });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (editingTransaction) {
                await axios.put(`/api/transactions/${editingTransaction._id}`, formData);
                toast.success('Transaction updated successfully');
            } else {
                await axios.post('/api/transactions', formData);
                toast.success('Transaction added successfully');
            }
            setDialogOpen(false);
            setEditingTransaction(null);
            fetchTransactions();
        } catch (error) {
            console.error('Error saving transaction:', error);
            toast.error('Failed to save transaction');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`/api/transactions/${id}`);
                toast.success('Transaction deleted successfully');
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                toast.error('Failed to delete transaction');
            }
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setDialogOpen(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesType = !filters.type || transaction.type === filters.type;
        const matchesCategory = !filters.category || transaction.category === filters.category;
        const matchesSearch = !filters.search ||
            transaction.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
            transaction.category.toLowerCase().includes(filters.search.toLowerCase());

        return matchesType && matchesCategory && matchesSearch;
    });

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
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                        Transactions
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                        sx={{ bgcolor: '#00BFFF', '&:hover': { bgcolor: '#0099CC' } }}
                    >
                        Add Transaction
                    </Button>
                </Box>

                {/* Filters */}
                <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, mb: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FilterIcon sx={{ color: '#00BFFF', mr: 1 }} />
                        <Typography variant="h6" color="#ccc">Filters</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                placeholder="Search transactions..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: '#666', mr: 1 }} />
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#ccc',
                                        '& fieldset': { borderColor: '#333' },
                                        '&:hover fieldset': { borderColor: '#00BFFF' }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#ccc' }}>Type</InputLabel>
                                <Select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                    sx={{
                                        color: '#ccc',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
                                    }}
                                >
                                    <MenuItem value="">All Types</MenuItem>
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expense">Expense</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#ccc' }}>Category</InputLabel>
                                <Select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    sx={{
                                        color: '#ccc',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
                                    }}
                                >
                                    <MenuItem value="">All Categories</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Transactions Table */}
                <Paper elevation={4} sx={{ bgcolor: '#222', borderRadius: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#333' }}>
                                    <TableCell sx={{ color: '#00BFFF', fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell sx={{ color: '#00BFFF', fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell sx={{ color: '#00BFFF', fontWeight: 'bold' }}>Category</TableCell>
                                    <TableCell sx={{ color: '#00BFFF', fontWeight: 'bold' }}>Type</TableCell>
                                    <TableCell sx={{ color: '#00BFFF', fontWeight: 'bold' }}>Amount</TableCell>
                                    <TableCell sx={{ color: '#00BFFF', fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#666', py: 4 }}>
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction._id} sx={{ '&:hover': { bgcolor: '#333' } }}>
                                            <TableCell sx={{ color: '#ccc' }}>
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell sx={{ color: '#ccc' }}>
                                                {transaction.description || 'No description'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={transaction.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#444',
                                                        color: '#ccc',
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={transaction.type}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: transaction.type === 'income' ? '#4CAF50' : '#F44336',
                                                        color: '#fff',
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{
                                                color: transaction.type === 'income' ? '#4CAF50' : '#F44336',
                                                fontWeight: 'bold'
                                            }}>
                                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleEdit(transaction)}
                                                    sx={{ color: '#00BFFF', mr: 1 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDelete(transaction._id)}
                                                    sx={{ color: '#F44336' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Transaction Form Dialog */}
                <TransactionForm
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setEditingTransaction(null);
                    }}
                    transaction={editingTransaction}
                    onSubmit={handleSubmit}
                />
            </Container>
        </Box>
    );
};

export default Transactions; 