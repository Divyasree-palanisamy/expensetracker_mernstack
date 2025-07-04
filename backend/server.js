require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
console.log('JWT_SECRET:', process.env.JWT_SECRET); // (for debugging)
const budgetsRoutes = require('./routes/budgets');
const moodsRoutes = require('./routes/moods');
const goalsRoutes = require('./routes/goals');
const challengesRoutes = require('./routes/challenges');
const insightsRoutes = require('./routes/insights');
const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Routes
app.use('/api/budgets', budgetsRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Task Manager API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 