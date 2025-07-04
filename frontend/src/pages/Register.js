import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/api/auth/register', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Box sx={{ bgcolor: '#181818', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, bgcolor: '#222', borderRadius: 2 }}>
                    <Typography variant="h4" color="#00BFFF" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            fullWidth
                            margin="normal"
                            value={form.name}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ style: { color: '#ccc' } }}
                            InputProps={{ style: { color: '#fff' } }}
                        />
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
                            Register
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#ccc' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#00BFFF', textDecoration: 'underline' }}>
                            Login
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;