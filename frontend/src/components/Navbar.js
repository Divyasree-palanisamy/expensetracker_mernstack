import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navStyle = {
    background: '#222',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};
const linkStyle = {
    color: '#00BFFF',
    textDecoration: 'none',
    margin: '0 1rem',
    fontWeight: 'bold',
    fontSize: '1.1rem',
};

const Navbar = () => {
    const { isAuthenticated } = useAuth();
    return (
        <nav style={navStyle}>
            <div style={{ fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: '1px' }}>
                Finance Dashboard
            </div>
            <div>
                <Link to="/" style={linkStyle}>Dashboard</Link>
                <Link to="/transactions" style={linkStyle}>Transactions</Link>
                <Link to="/budgets" style={linkStyle}>Budgets</Link>
                <Link to="/moods" style={linkStyle}>Moods</Link>
                <Link to="/goals" style={linkStyle}>Goals</Link>
                <Link to="/challenges" style={linkStyle}>Challenges</Link>
                <Link to="/recurring" style={linkStyle}>Recurring</Link>
                {!isAuthenticated && (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={linkStyle}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;