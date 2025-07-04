import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiSave, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: user?.name || '',
        avatar: user?.avatar || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.length > 50) {
            newErrors.name = 'Name must be less than 50 characters';
        }

        if (formData.avatar && !isValidUrl(formData.avatar)) {
            newErrors.avatar = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await updateProfile(formData);
            if (result.success) {
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and profile information</p>
                </div>

                {/* Profile Form */}
                <div className="card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={formData.avatar || 'https://via.placeholder.com/100'}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                />
                                <div className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full">
                                    <FiCamera className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                                <p className="text-gray-600">{user?.email}</p>
                                <p className="text-sm text-gray-500 capitalize">Role: {user?.role}</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`form-input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email (Read-only) */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email"
                                    id="email"
                                    value={user?.email || ''}
                                    className="form-input pl-10 bg-gray-50 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Email address cannot be changed
                            </p>
                        </div>

                        {/* Avatar URL */}
                        <div className="form-group">
                            <label htmlFor="avatar" className="form-label">
                                Profile Picture URL
                            </label>
                            <input
                                type="url"
                                id="avatar"
                                name="avatar"
                                className={`form-input ${errors.avatar ? 'border-red-500' : ''}`}
                                placeholder="https://example.com/avatar.jpg"
                                value={formData.avatar}
                                onChange={handleChange}
                            />
                            {errors.avatar && (
                                <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Enter a URL for your profile picture (optional)
                            </p>
                        </div>

                        {/* Account Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member since:</span>
                                    <span className="text-gray-900">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account type:</span>
                                    <span className="text-gray-900 capitalize">{user?.role || 'User'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`btn btn-primary flex items-center gap-2 ${loading ? 'btn-loading' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-4 h-4" />
                                        Update Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Settings */}
                <div className="mt-8 space-y-6">
                    {/* Security Section */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Password</h4>
                                    <p className="text-sm text-gray-600">Last changed: Never</p>
                                </div>
                                <button className="btn btn-outline btn-sm">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                    <p className="text-sm text-gray-600">Receive email updates about your tasks</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 