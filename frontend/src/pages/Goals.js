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
    Flag,
    Celebration
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import toast from 'react-hot-toast';

const GoalForm = ({ open, onClose, goal, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        description: '',
        category: 'General'
    });

    useEffect(() => {
        if (goal) {
            setFormData({
                title: goal.title,
                targetAmount: goal.targetAmount.toString(),
                currentAmount: goal.currentAmount.toString(),
                targetDate: new Date(goal.targetDate),
                description: goal.description || '',
                category: goal.category || 'General'
            });
        } else {
            setFormData({
                title: '',
                targetAmount: '',
                currentAmount: '0',
                targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                description: '',
                category: 'General'
            });
        }
    }, [goal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.targetAmount) {
            toast.error('Please fill in all required fields');
            return;
        }
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#222', color: '#00BFFF' }}>
                {goal ? 'Edit Goal' : 'Create New Savings Goal'}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#222', pt: 2 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Goal Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                            <TextField
                                fullWidth
                                label="Target Amount"
                                type="number"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
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
                            <TextField
                                fullWidth
                                label="Current Amount"
                                type="number"
                                value={formData.currentAmount}
                                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
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
                                >
                                    <MenuItem value="General">General</MenuItem>
                                    <MenuItem value="Emergency Fund">Emergency Fund</MenuItem>
                                    <MenuItem value="Vacation">Vacation</MenuItem>
                                    <MenuItem value="Home">Home</MenuItem>
                                    <MenuItem value="Car">Car</MenuItem>
                                    <MenuItem value="Education">Education</MenuItem>
                                    <MenuItem value="Investment">Investment</MenuItem>
                                    <MenuItem value="Wedding">Wedding</MenuItem>
                                    <MenuItem value="Retirement">Retirement</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
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
                                    label="Target Date"
                                    value={formData.targetDate}
                                    onChange={(newValue) => setFormData({ ...formData, targetDate: newValue })}
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
                    {goal ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const GoalCard = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
    const [updating, setUpdating] = useState(false);
    const [newAmount, setNewAmount] = useState('');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return '#4CAF50';
        if (percentage >= 75) return '#FF9800';
        if (percentage >= 50) return '#2196F3';
        return '#F44336';
    };

    const getStatusIcon = () => {
        if (goal.progress >= 100) {
            return <Celebration sx={{ color: '#4CAF50' }} />;
        }
        return <Flag sx={{ color: '#00BFFF' }} />;
    };

    const handleUpdateProgress = async () => {
        if (!newAmount || parseFloat(newAmount) < 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            setUpdating(true);
            await axios.put(`/api/goals/${goal._id}`, {
                ...goal,
                currentAmount: parseFloat(newAmount)
            });
            toast.success('Progress updated successfully');
            setNewAmount('');
            onUpdateProgress();
        } catch (error) {
            console.error('Error updating progress:', error);
            toast.error('Failed to update progress');
        } finally {
            setUpdating(false);
        }
    };

    const isCompleted = goal.progress >= 100;
    const isOverdue = new Date(goal.targetDate) < new Date() && !isCompleted;

    return (
        <Card sx={{
            bgcolor: '#222',
            border: '1px solid #333',
            height: '100%',
            position: 'relative',
            ...(isCompleted && { borderColor: '#4CAF50' }),
            ...(isOverdue && { borderColor: '#F44336' })
        }}>
            {isCompleted && (
                <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: '#4CAF50',
                    borderRadius: '50%',
                    p: 0.5
                }}>
                    <Celebration sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
            )}
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" color="#00BFFF" gutterBottom>
                            {goal.title}
                        </Typography>
                        <Chip
                            label={goal.category}
                            size="small"
                            sx={{
                                bgcolor: '#444',
                                color: '#ccc',
                                fontSize: '0.7rem',
                                mb: 1
                            }}
                        />
                        {isOverdue && (
                            <Chip
                                label="Overdue"
                                size="small"
                                sx={{
                                    bgcolor: '#F44336',
                                    color: '#fff',
                                    fontSize: '0.7rem',
                                    ml: 1
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => onEdit(goal)} sx={{ color: '#00BFFF' }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(goal._id)} sx={{ color: '#F44336' }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStatusIcon()}
                    <Typography variant="h5" color="#ccc" sx={{ ml: 1, fontWeight: 'bold' }}>
                        {formatCurrency(goal.targetAmount)}
                    </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#ccc">
                            Saved: {formatCurrency(goal.currentAmount)}
                        </Typography>
                        <Typography variant="body2" color="#ccc">
                            {goal.progress.toFixed(1)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(goal.progress, 100)}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#333',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: getProgressColor(goal.progress),
                                borderRadius: 4
                            }
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                        variant="body2"
                        color={isCompleted ? '#4CAF50' : '#ccc'}
                        sx={{ fontWeight: 'bold' }}
                    >
                        {isCompleted
                            ? 'Goal Achieved! 🎉'
                            : `${formatCurrency(goal.targetAmount - goal.currentAmount)} to go`
                        }
                    </Typography>
                    <Typography variant="caption" color="#666">
                        Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </Typography>
                </Box>

                {goal.description && (
                    <Typography variant="body2" color="#666" sx={{ mb: 2 }}>
                        {goal.description}
                    </Typography>
                )}

                {!isCompleted && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                            size="small"
                            placeholder="Update amount"
                            type="number"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    color: '#ccc',
                                    '& fieldset': { borderColor: '#333' },
                                    '&:hover fieldset': { borderColor: '#00BFFF' }
                                }
                            }}
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleUpdateProgress}
                            disabled={updating}
                            sx={{
                                color: '#00BFFF',
                                borderColor: '#00BFFF',
                                '&:hover': { borderColor: '#0099CC' }
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/goals');
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
            toast.error('Failed to load goals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (editingGoal) {
                await axios.put(`/api/goals/${editingGoal._id}`, formData);
                toast.success('Goal updated successfully');
            } else {
                await axios.post('/api/goals', formData);
                toast.success('Goal created successfully');
            }
            setDialogOpen(false);
            setEditingGoal(null);
            fetchGoals();
        } catch (error) {
            console.error('Error saving goal:', error);
            toast.error('Failed to save goal');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await axios.delete(`/api/goals/${id}`);
                toast.success('Goal deleted successfully');
                fetchGoals();
            } catch (error) {
                console.error('Error deleting goal:', error);
                toast.error('Failed to delete goal');
            }
        }
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
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

    const completedGoals = goals.filter(goal => goal.progress >= 100);
    const activeGoals = goals.filter(goal => goal.progress < 100);

    return (
        <Box sx={{ bgcolor: '#181818', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                            Savings Goals
                        </Typography>
                        <Typography variant="h6" color="#ccc" sx={{ mt: 1 }}>
                            Set and track your financial goals
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                        sx={{ bgcolor: '#00BFFF', '&:hover': { bgcolor: '#0099CC' } }}
                    >
                        Create Goal
                    </Button>
                </Box>

                {/* Summary Stats */}
                {goals.length > 0 && (
                    <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, mb: 4, borderRadius: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="#00BFFF" sx={{ fontWeight: 'bold' }}>
                                        {goals.length}
                                    </Typography>
                                    <Typography variant="body2" color="#ccc">
                                        Total Goals
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="#4CAF50" sx={{ fontWeight: 'bold' }}>
                                        {completedGoals.length}
                                    </Typography>
                                    <Typography variant="body2" color="#ccc">
                                        Completed
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="#FF9800" sx={{ fontWeight: 'bold' }}>
                                        {activeGoals.length}
                                    </Typography>
                                    <Typography variant="body2" color="#ccc">
                                        In Progress
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* Active Goals */}
                {activeGoals.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" color="#00BFFF" sx={{ mb: 3, fontWeight: 'bold' }}>
                            Active Goals
                        </Typography>
                        <Grid container spacing={3}>
                            {activeGoals.map((goal) => (
                                <Grid item xs={12} sm={6} lg={4} key={goal._id}>
                                    <GoalCard
                                        goal={goal}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onUpdateProgress={fetchGoals}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Completed Goals */}
                {completedGoals.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" color="#4CAF50" sx={{ mb: 3, fontWeight: 'bold' }}>
                            Completed Goals 🎉
                        </Typography>
                        <Grid container spacing={3}>
                            {completedGoals.map((goal) => (
                                <Grid item xs={12} sm={6} lg={4} key={goal._id}>
                                    <GoalCard
                                        goal={goal}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onUpdateProgress={fetchGoals}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Empty State */}
                {goals.length === 0 && (
                    <Paper elevation={4} sx={{ bgcolor: '#222', p: 6, borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="#ccc" gutterBottom>
                            No savings goals yet
                        </Typography>
                        <Typography variant="body1" color="#666" sx={{ mb: 3 }}>
                            Create your first savings goal to start building your financial future
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setDialogOpen(true)}
                            sx={{ bgcolor: '#00BFFF', '&:hover': { bgcolor: '#0099CC' } }}
                        >
                            Create Your First Goal
                        </Button>
                    </Paper>
                )}

                {/* Goal Form Dialog */}
                <GoalForm
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setEditingGoal(null);
                    }}
                    goal={editingGoal}
                    onSubmit={handleSubmit}
                />
            </Container>
        </Box>
    );
};

export default Goals; 