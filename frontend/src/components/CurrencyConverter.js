import React, { useState, useEffect } from 'react';
import './CurrencyConverter.css';

const CurrencyConverter = ({ isOpen, onClose }) => {
    const [fromCurrency, setFromCurrency] = useState('INR');
    const [toCurrency, setToCurrency] = useState('USD');
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Frankfurter supported currencies (INR is not supported)
    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
        { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' }
    ];

    const convertCurrency = async () => {
        if (!fromAmount || isNaN(fromAmount) || parseFloat(fromAmount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (!fromCurrency || !toCurrency) {
            setError('Please select both currencies');
            return;
        }
        if (fromCurrency === 'INR' || toCurrency === 'INR') {
            setError('Sorry, INR is not supported by this free API. Try USD, EUR, GBP, JPY, CAD, AUD, or CHF.');
            return;
        }

        setLoading(true);
        setError('');
        setToAmount('');

        try {
            const url = `https://api.frankfurter.app/latest?amount=${fromAmount}&from=${fromCurrency}&to=${toCurrency}`;
            const response = await fetch(url);
            const data = await response.json();
            // Debug: log the API response
            console.log('Frankfurter API response:', data);
            if (data && data.rates && data.rates[toCurrency]) {
                setToAmount(Number(data.rates[toCurrency]).toFixed(2));
            } else if (data && data.error) {
                setError('API error: ' + data.error);
            } else {
                setError('Conversion failed. Please try again later.');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setFromAmount(toAmount);
        setToAmount('');
    };

    const getCurrencySymbol = (code) => {
        const currency = currencies.find(c => c.code === code);
        return currency ? currency.symbol : code;
    };

    const handleFromAmountChange = (value) => {
        setFromAmount(value);
        setToAmount(''); // Clear converted amount when input changes
    };

    if (!isOpen) return null;

    return (
        <div className="currency-converter-overlay" onClick={onClose}>
            <div className="currency-converter-modal" onClick={(e) => e.stopPropagation()}>
                <div className="currency-converter-header">
                    <h3>💱 Currency Converter</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="currency-converter-content">
                    <div className="conversion-inputs">
                        {/* From Currency Section */}
                        <div className="conversion-section">
                            <label className="section-label">From</label>
                            <div className="currency-input-group">
                                <div className="currency-selector">
                                    <select
                                        value={fromCurrency}
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.code} - {currency.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="amount-input-container">
                                    <span className="currency-symbol">{getCurrencySymbol(fromCurrency)}</span>
                                    <input
                                        type="number"
                                        value={fromAmount}
                                        onChange={(e) => handleFromAmountChange(e.target.value)}
                                        placeholder="Enter amount (e.g. 1000)"
                                        min="0"
                                        step="0.01"
                                        className="amount-input no-overlap"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Swap Button */}
                        <button className="swap-btn" onClick={handleSwap}>
                            ⇄ Swap
                        </button>

                        {/* To Currency Section */}
                        <div className="conversion-section">
                            <label className="section-label">To</label>
                            <div className="currency-input-group">
                                <div className="currency-selector">
                                    <select
                                        value={toCurrency}
                                        onChange={(e) => setToCurrency(e.target.value)}
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.code} - {currency.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="amount-input-container">
                                    <span className="currency-symbol">{getCurrencySymbol(toCurrency)}</span>
                                    <input
                                        type="text"
                                        value={toAmount}
                                        readOnly
                                        placeholder="Converted amount"
                                        className="amount-input result-input no-overlap"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        className="convert-btn"
                        onClick={convertCurrency}
                        disabled={loading || !fromAmount}
                    >
                        {loading ? 'Converting...' : 'Convert'}
                    </button>

                    <div className="converter-info">
                        <p>💡 Tip: Use this for international transactions, online shopping, or travel planning!</p>
                        <p style={{ color: '#ffb300', marginTop: 8 }}><b>Note:</b> INR is not supported by this free API. Try USD, EUR, GBP, JPY, CAD, AUD, or CHF.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter; 