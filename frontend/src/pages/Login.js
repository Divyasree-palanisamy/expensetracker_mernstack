import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        const result = await login(form.email, form.password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <Box sx={{ bgcolor: '#181818', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, bgcolor: '#222', borderRadius: 2 }}>
                    <Typography variant="h4" color="#00BFFF" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={form.email}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ style: { color: '#ccc' } }}
                            InputProps={{ style: { color: '#fff' } }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={form.password}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ style: { color: '#ccc' } }}
                            InputProps={{ style: { color: '#fff' } }}
                        />
                        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, fontWeight: 'bold' }}>
                            Login
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#ccc' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#00BFFF', textDecoration: 'underline' }}>
                            Sign up
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;