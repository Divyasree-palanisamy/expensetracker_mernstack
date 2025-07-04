import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Box, Paper, TextField, Button, Grid, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const initialForm = {
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    description: '',
};

const categoryOptions = [
    'Food', 'Rent', 'Utilities', 'Transport', 'Shopping', 'Salary', 'Other'
];

const Transactions = () => {
    const { user, loading } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`/api/transactions`);
            setTransactions(res.data);
        } catch (err) {
            setError('Failed to fetch transactions');
        }
    };

    useEffect(() => {
        if (!loading && user && localStorage.getItem('token')) {
            fetchTransactions();
        }
    }, [user, loading]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            // Ensure amount is a number and date is set
            const payload = {
                amount: Number(form.amount),
                type: form.type,
                category: form.category,
                date: form.date ? new Date(form.date) : new Date(),
                description: form.description,
            };
            if (editingId) {
                await axios.put(`/api/transactions/${editingId}`, payload);
            } else {
                await axios.post('/api/transactions', payload);
            }
            setForm(initialForm);
            setEditingId(null);
            fetchTransactions();
        } catch (err) {
            const backendMsg = err.response?.data?.error || err.response?.data?.message;
            setError(backendMsg || 'Failed to save transaction');
        }
    };

    const handleEdit = tx => {
        setForm({
            amount: tx.amount,
            type: tx.type,
            category: tx.category,
            date: tx.date ? tx.date.substring(0, 10) : '',
            description: tx.description || '',
        });
        setEditingId(tx._id);
    };

    const handleDelete = async id => {
        try {
            await axios.delete(`/api/transactions/${id}`);
            fetchTransactions();
        } catch (err) {
            setError('Failed to delete transaction');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>Please log in to add transactions.</div>;

    return (
        <Box sx={{ bgcolor: '#181818', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                <Typography variant="h4" color="#00BFFF" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Transactions
                </Typography>
                <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2, mb: 4 }}>
                    <Typography variant="h6" color="#fff" gutterBottom>
                        {editingId ? 'Edit Transaction' : 'Add Transaction'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Amount"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ style: { color: '#ccc' } }}
                                    InputProps={{ style: { color: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Type"
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ style: { color: '#ccc' } }}
                                    InputProps={{ style: { color: '#fff' } }}
                                >
                                    <MenuItem value="expense">Expense</MenuItem>
                                    <MenuItem value="income">Income</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ style: { color: '#ccc' } }}
                                    InputProps={{ style: { color: '#fff' } }}
                                >
                                    {categoryOptions.map(opt => (
                                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true, style: { color: '#ccc' } }}
                                    InputProps={{ style: { color: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ style: { color: '#ccc' } }}
                                    InputProps={{ style: { color: '#fff' } }}
                                />
                            </Grid>
                        </Grid>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, fontWeight: 'bold' }}>
                            {editingId ? 'Update' : 'Add'} Transaction
                        </Button>
                        {editingId && (
                            <Button onClick={() => { setForm(initialForm); setEditingId(null); }} sx={{ mt: 3, ml: 2 }}>
                                Cancel
                            </Button>
                        )}
                    </form>
                </Paper>
                <Typography variant="h6" color="#fff" gutterBottom>
                    Your Transactions
                </Typography>
                {transactions.length === 0 ? (
                    <Typography color="#ccc">No transactions found.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {transactions.map(tx => (
                            <Grid item xs={12} key={tx._id}>
                                <Paper sx={{ bgcolor: '#222', p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="#00BFFF" fontWeight="bold">{tx.category}</Typography>
                                        <Typography color="#fff">{tx.type === 'income' ? '+' : '-'}₹{tx.amount}</Typography>
                                        <Typography color="#ccc" fontSize={14}>{tx.date ? new Date(tx.date).toLocaleDateString() : ''}</Typography>
                                        {tx.description && <Typography color="#ccc" fontSize={14}>{tx.description}</Typography>}
                                    </Box>
                                    <Box>
                                        <IconButton onClick={() => handleEdit(tx)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(tx._id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default Transactions; 