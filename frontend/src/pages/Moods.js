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
    SentimentVerySatisfied,
    SentimentSatisfied,
    SentimentNeutral,
    SentimentDissatisfied,
    SentimentVeryDissatisfied,
    TrendingUp,
    Psychology
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import toast from 'react-hot-toast';

const moodOptions = [
    { value: 5, label: 'Excellent', icon: <SentimentVerySatisfied sx={{ color: '#4CAF50' }} /> },
    { value: 4, label: 'Good', icon: <SentimentSatisfied sx={{ color: '#8BC34A' }} /> },
    { value: 3, label: 'Neutral', icon: <SentimentNeutral sx={{ color: '#FFC107' }} /> },
    { value: 2, label: 'Bad', icon: <SentimentDissatisfied sx={{ color: '#FF9800' }} /> },
    { value: 1, label: 'Terrible', icon: <SentimentVeryDissatisfied sx={{ color: '#F44336' }} /> }
];

const MoodForm = ({ open, onClose, mood, onSubmit }) => {
    const [formData, setFormData] = useState({
        mood: 3,
        notes: '',
        date: new Date()
    });

    useEffect(() => {
        if (mood) {
            setFormData({
                mood: mood.mood,
                notes: mood.notes || '',
                date: new Date(mood.date)
            });
        } else {
            setFormData({
                mood: 3,
                notes: '',
                date: new Date()
            });
        }
    }, [mood]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.mood) {
            toast.error('Please select a mood');
            return;
        }
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#222', color: '#00BFFF' }}>
                {mood ? 'Edit Mood Entry' : 'Log Your Mood'}
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#222', pt: 2 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="#ccc" gutterBottom>
                                How are you feeling today?
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
                                {moodOptions.map((option) => (
                                    <Box
                                        key={option.value}
                                        onClick={() => setFormData({ ...formData, mood: option.value })}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            p: 2,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            border: formData.mood === option.value ? '2px solid #00BFFF' : '2px solid #333',
                                            bgcolor: formData.mood === option.value ? '#333' : '#222',
                                            '&:hover': { bgcolor: '#333' },
                                            minWidth: 80
                                        }}
                                    >
                                        <Box sx={{ fontSize: 40, mb: 1 }}>
                                            {option.icon}
                                        </Box>
                                        <Typography variant="body2" color="#ccc" sx={{ textAlign: 'center' }}>
                                            {option.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes (Optional)"
                                multiline
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="How was your day? Any specific events that affected your mood?"
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
                    {mood ? 'Update' : 'Log Mood'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const MoodCard = ({ mood, onEdit, onDelete }) => {
    const getMoodIcon = (moodValue) => {
        return moodOptions.find(option => option.value === moodValue)?.icon || moodOptions[2].icon;
    };

    const getMoodLabel = (moodValue) => {
        return moodOptions.find(option => option.value === moodValue)?.label || 'Neutral';
    };

    const getMoodColor = (moodValue) => {
        const colors = {
            5: '#4CAF50',
            4: '#8BC34A',
            3: '#FFC107',
            2: '#FF9800',
            1: '#F44336'
        };
        return colors[moodValue] || '#FFC107';
    };

    return (
        <Card sx={{ bgcolor: '#222', border: '1px solid #333', height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ fontSize: 40, mr: 2 }}>
                            {getMoodIcon(mood.mood)}
                        </Box>
                        <Box>
                            <Typography variant="h6" color="#ccc" gutterBottom>
                                {getMoodLabel(mood.mood)}
                            </Typography>
                            <Typography variant="body2" color="#666">
                                {new Date(mood.date).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => onEdit(mood)} sx={{ color: '#00BFFF' }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(mood._id)} sx={{ color: '#F44336' }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>

                {mood.notes && (
                    <Typography variant="body2" color="#ccc" sx={{ mb: 2 }}>
                        {mood.notes}
                    </Typography>
                )}

                <Chip
                    label={`Mood Level: ${mood.mood}/5`}
                    size="small"
                    sx={{
                        bgcolor: getMoodColor(mood.mood),
                        color: '#fff',
                        fontSize: '0.7rem'
                    }}
                />
            </CardContent>
        </Card>
    );
};

const Moods = () => {
    const [moods, setMoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMood, setEditingMood] = useState(null);

    const fetchMoods = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/moods');
            setMoods(response.data);
        } catch (error) {
            console.error('Error fetching moods:', error);
            toast.error('Failed to load mood entries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoods();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            if (editingMood) {
                await axios.put(`/api/moods/${editingMood._id}`, formData);
                toast.success('Mood entry updated successfully');
            } else {
                await axios.post('/api/moods', formData);
                toast.success('Mood logged successfully');
            }
            setDialogOpen(false);
            setEditingMood(null);
            fetchMoods();
        } catch (error) {
            console.error('Error saving mood:', error);
            toast.error('Failed to save mood entry');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this mood entry?')) {
            try {
                await axios.delete(`/api/moods/${id}`);
                toast.success('Mood entry deleted successfully');
                fetchMoods();
            } catch (error) {
                console.error('Error deleting mood:', error);
                toast.error('Failed to delete mood entry');
            }
        }
    };

    const handleEdit = (mood) => {
        setEditingMood(mood);
        setDialogOpen(true);
    };

    const getMoodStats = () => {
        if (moods.length === 0) return null;

        const totalMoods = moods.length;
        const averageMood = moods.reduce((sum, mood) => sum + mood.mood, 0) / totalMoods;
        const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        moods.forEach(mood => {
            moodCounts[mood.mood]++;
        });

        const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);

        return {
            totalMoods,
            averageMood: averageMood.toFixed(1),
            mostCommonMood: parseInt(mostCommonMood),
            moodCounts
        };
    };

    const getChartData = () => {
        const last7Days = moods
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 7)
            .reverse();

        return {
            labels: last7Days.map(mood => new Date(mood.date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Mood Level',
                    data: last7Days.map(mood => mood.mood),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1,
                    yAxisID: 'y'
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

    const stats = getMoodStats();

    return (
        <Box sx={{ bgcolor: '#181818', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                            Mood Tracker
                        </Typography>
                        <Typography variant="h6" color="#ccc" sx={{ mt: 1 }}>
                            Track your daily mood and emotional well-being
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                        sx={{ bgcolor: '#00BFFF', '&:hover': { bgcolor: '#0099CC' } }}
                    >
                        Log Mood
                    </Button>
                </Box>

                {/* Stats and Chart */}
                {stats && (
                    <Grid container spacing={4} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Psychology sx={{ color: '#00BFFF', mr: 1 }} />
                                    <Typography variant="h6" color="#ccc">Mood Statistics</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="#666">Total Entries</Typography>
                                    <Typography variant="h4" color="#00BFFF" sx={{ fontWeight: 'bold' }}>
                                        {stats.totalMoods}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="#666">Average Mood</Typography>
                                    <Typography variant="h4" color="#4CAF50" sx={{ fontWeight: 'bold' }}>
                                        {stats.averageMood}/5
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="#666">Most Common Mood</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        {moodOptions.find(option => option.value === stats.mostCommonMood)?.icon}
                                        <Typography variant="h6" color="#ccc" sx={{ ml: 1 }}>
                                            {moodOptions.find(option => option.value === stats.mostCommonMood)?.label}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" color="#00BFFF" gutterBottom>
                                    Mood Trend (Last 7 Days)
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
                                                    grid: { color: '#333' },
                                                    min: 1,
                                                    max: 5
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {/* Recent Mood Entries */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" color="#00BFFF" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Recent Mood Entries
                    </Typography>
                    {moods.length === 0 ? (
                        <Paper elevation={4} sx={{ bgcolor: '#222', p: 6, borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="#ccc" gutterBottom>
                                No mood entries yet
                            </Typography>
                            <Typography variant="body1" color="#666" sx={{ mb: 3 }}>
                                Start tracking your mood to gain insights into your emotional well-being
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setDialogOpen(true)}
                                sx={{ bgcolor: '#00BFFF', '&:hover': { bgcolor: '#0099CC' } }}
                            >
                                Log Your First Mood
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {moods.slice(0, 6).map((mood) => (
                                <Grid item xs={12} sm={6} lg={4} key={mood._id}>
                                    <MoodCard
                                        mood={mood}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* Mood Form Dialog */}
                <MoodForm
                    open={dialogOpen}
                    onClose={() => {
                        setDialogOpen(false);
                        setEditingMood(null);
                    }}
                    mood={editingMood}
                    onSubmit={handleSubmit}
                />
            </Container>
        </Box>
    );
};

export default Moods; 