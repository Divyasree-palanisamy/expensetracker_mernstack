import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiDollarSign, FiSave, FiShield } from 'react-icons/fi';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        currency: 'INR',
        monthlyBudget: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const currencies = [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
        { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
    ];

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                currency: user.currency || 'INR',
                monthlyBudget: user.monthlyBudget ? user.monthlyBudget.toString() : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const result = await updateProfile({
                name: formData.name,
                currency: formData.currency,
                monthlyBudget: formData.monthlyBudget ? parseFloat(formData.monthlyBudget) : 0
            });

            if (result.success) {
                setSuccess('Profile updated successfully!');
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getCurrencySymbol = (code) => {
        const currency = currencies.find(c => c.code === code);
        return currency ? currency.symbol : '₹';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container">
            <div className="section-header mb-8">
                <h1 className="text-white">Profile Settings</h1>
                <div className="section-subtitle">Manage your account preferences and settings</div>
            </div>

            <div className="grid md:grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '2rem' }}>
                {/* Profile Information */}
                <div className="md:col-span-2">
                    <div className="card mb-6" style={{ maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <h3 className="text-primary mb-6 text-xl">Account Information</h3>

                        {success && (
                            <div className="alert alert-success mb-4">
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-4" style={{ justifyItems: 'start' }}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label" style={{ color: '#111' }}>
                                        <FiUser className="inline mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        style={{ background: '#f3f3f3', color: '#111', border: '1px solid #bbb' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label" style={{ color: '#111' }}>
                                        <FiMail className="inline mr-2" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user?.email || ''}
                                        className="form-input"
                                        disabled
                                        style={{ background: '#f3f3f3', color: '#111', border: '1px solid #bbb' }}
                                    />
                                    <small className="text-gray-600">Email cannot be changed</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="currency" className="form-label" style={{ color: '#111' }}>
                                        <FiDollarSign className="inline mr-2" />
                                        Currency
                                    </label>
                                    <select
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="form-select"
                                        style={{ background: '#f3f3f3', color: '#111', border: '1px solid #bbb' }}
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.code === 'INR' ? 'RPS' : currency.symbol} {currency.name} ({currency.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="monthlyBudget" className="form-label" style={{ color: '#111' }}>
                                        <FiDollarSign className="inline mr-2" />
                                        Monthly Budget
                                    </label>
                                    <div className="input-group">
                                        <span className="input-prefix" style={{ marginRight: '1rem' }}>{formData.currency === 'INR' ? 'RPS' : getCurrencySymbol(formData.currency)}</span>
                                        <input
                                            type="number"
                                            id="monthlyBudget"
                                            name="monthlyBudget"
                                            value={formData.monthlyBudget}
                                            onChange={handleChange}
                                            className="form-input"
                                            style={{ paddingLeft: '3rem', background: '#f3f3f3', color: '#111', border: '1px solid #bbb' }}
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <small className="text-gray-600">
                                        Set a monthly budget to track your spending goals
                                    </small>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    <FiSave />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Account Stats */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Member since:</span>
                                <span className="font-medium">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account status:</span>
                                <span className="text-green-600 font-medium">Active</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Currency:</span>
                                <span className="font-medium">{formData.currency}</span>
                            </div>
                        </div>
                        <span className="badge badge-success">Active</span>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monthly budget:</span>
                                <span className="font-medium">
                                    {formData.monthlyBudget ?
                                        `RPS ${parseFloat(formData.monthlyBudget).toFixed(2)}` :
                                        'Not set'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Current month:</span>
                                <span className="font-medium">
                                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Security</h3>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                                <FiShield className="mr-2" />
                                <span>Password protected</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FiShield className="mr-2" />
                                <span>JWT authentication</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FiShield className="mr-2" />
                                <span>Secure data storage</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 