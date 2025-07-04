import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';

const Dashboard = () => (
    <Box sx={{ bgcolor: '#181818', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
            <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Personal Finance Dashboard
            </Typography>
            <Typography variant="h6" color="#fff" align="center" sx={{ mb: 4 }}>
                Welcome! Here you can track your spending, set goals, and gain insights into your financial habits.
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" color="#00BFFF" gutterBottom>
                            Spending & Income Overview
                        </Typography>
                        <Typography color="#ccc">
                            Charts and summary will appear here.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={4} sx={{ bgcolor: '#222', p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" color="#00BFFF" gutterBottom>
                            Smart Insights
                        </Typography>
                        <Typography color="#ccc">
                            AI-driven insights and tips will appear here.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
);

export default Dashboard; 