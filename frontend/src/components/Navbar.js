import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    FiHome,
    FiDollarSign,
    FiPieChart,
    FiRepeat,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiGlobe
} from 'react-icons/fi';

const Navbar = ({ onShowCurrencyConverter }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: FiHome },
        { path: '/expenses', label: 'Expenses', icon: FiDollarSign },
        { path: '/categories', label: 'Categories', icon: FiPieChart },
        { path: '/recurring', label: 'Recurring', icon: FiRepeat },
        { path: '/profile', label: 'Profile', icon: FiUser },
        { path: '#', label: 'Convert', icon: FiGlobe, action: onShowCurrencyConverter }
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleNavClick = (item) => {
        if (item.action) {
            item.action();
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    Expense Tracker
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-nav desktop-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={(e) => {
                                    if (item.action) {
                                        e.preventDefault();
                                        handleNavClick(item);
                                    }
                                }}
                            >
                                <span className="nav-link-icon">
                                    <Icon />
                                    <span className="nav-link-text">{item.label}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* User Menu */}
                <div className="user-menu">
                    <span className="user-name">{user?.name}</span>
                    <button onClick={handleLogout} className="btn btn-outline btn-sm">
                        <FiLogOut />
                        <span className="nav-link-text">Logout</span>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="mobile-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={(e) => {
                                    setIsMobileMenuOpen(false);
                                    if (item.action) {
                                        e.preventDefault();
                                        handleNavClick(item);
                                    }
                                }}
                            >
                                <span className="nav-link-icon">
                                    <Icon />
                                    <span className="nav-link-text">{item.label}</span>
                                </span>
                            </Link>
                        );
                    })}

                    <div className="mobile-user-menu">
                        <span className="user-name">{user?.name}</span>
                        <button onClick={handleLogout} className="btn btn-outline btn-sm">
                            <FiLogOut />
                            <span className="nav-link-text">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 