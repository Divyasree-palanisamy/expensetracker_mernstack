import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import Categories from './pages/Categories';
import Recurring from './pages/Recurring';
import Profile from './pages/Profile';
import CurrencyConverter from './components/CurrencyConverter';
import QuickAddWidget from './components/QuickAddWidget';
import RecurringForecast from './components/RecurringForecast';

import './App.css';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
    const [showExpenseSplitter, setShowExpenseSplitter] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [recurringExpenses, setRecurringExpenses] = useState([]);

    const handleAddExpense = (expenseData) => {
        // This would typically call an API to add the expense
        console.log('Adding expense:', expenseData);
        // For now, just add to local state
        setExpenses(prev => [...prev, { ...expenseData, id: Date.now() }]);
    };

    const handleSplitComplete = (splitData) => {
        console.log('Expense split completed:', splitData);
        // Handle the split expense data
    };

    const handleShowExpenseSplitter = (suggestionData = null) => {
        setShowExpenseSplitter(true);
        // You can pass suggestion data to pre-fill the splitter
        if (suggestionData) {
            console.log('Opening splitter with suggestion data:', suggestionData);
        }
    };

    return (
        <Router>
            <div className="App">
                {isAuthenticated && (
                    <Navbar
                        onShowCurrencyConverter={() => setShowCurrencyConverter(true)}
                        onShowExpenseSplitter={() => setShowExpenseSplitter(true)}
                    />
                )}
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <Dashboard onShowExpenseSplitter={handleShowExpenseSplitter} />
                            </PrivateRoute>
                        } />
                        <Route path="/expenses" element={
                            <PrivateRoute>
                                <Expenses />
                            </PrivateRoute>
                        } />
                        <Route path="/expenses/add" element={
                            <PrivateRoute>
                                <AddExpense />
                            </PrivateRoute>
                        } />
                        <Route path="/expenses/edit/:id" element={
                            <PrivateRoute>
                                <EditExpense />
                            </PrivateRoute>
                        } />
                        <Route path="/categories" element={
                            <PrivateRoute>
                                <Categories />
                            </PrivateRoute>
                        } />
                        <Route path="/recurring" element={
                            <PrivateRoute>
                                <Recurring />
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>

                {/* Global Components */}
                {isAuthenticated && (
                    <>
                        <QuickAddWidget onAddExpense={handleAddExpense} />

                        <CurrencyConverter
                            isOpen={showCurrencyConverter}
                            onClose={() => setShowCurrencyConverter(false)}
                        />
                    </>
                )}
            </div>
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App; 