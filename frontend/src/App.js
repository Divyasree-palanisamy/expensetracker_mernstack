import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Moods from './pages/Moods';
import Goals from './pages/Goals';
import Challenges from './pages/Challenges';
import Recurring from './pages/Recurring';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) return null; // or a loading spinner
    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    // Hide navbar on login and register pages
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
    return (
        <>
            {!hideNavbar && isAuthenticated && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/transactions" element={
                    <PrivateRoute>
                        <Transactions />
                    </PrivateRoute>
                } />
                <Route path="/budgets" element={
                    <PrivateRoute>
                        <Budgets />
                    </PrivateRoute>
                } />
                <Route path="/moods" element={
                    <PrivateRoute>
                        <Moods />
                    </PrivateRoute>
                } />
                <Route path="/goals" element={
                    <PrivateRoute>
                        <Goals />
                    </PrivateRoute>
                } />
                <Route path="/challenges" element={
                    <PrivateRoute>
                        <Challenges />
                    </PrivateRoute>
                } />
                <Route path="/recurring" element={
                    <PrivateRoute>
                        <Recurring />
                    </PrivateRoute>
                } />
            </Routes>
        </>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;