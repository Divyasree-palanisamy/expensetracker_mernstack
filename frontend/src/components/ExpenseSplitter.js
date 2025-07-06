import React, { useState } from 'react';
import './ExpenseSplitter.css';

const ExpenseSplitter = ({ isOpen, onClose, onSplitComplete }) => {
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDescription, setExpenseDescription] = useState('');
    const [splitType, setSplitType] = useState('equal'); // 'equal' or 'custom'
    const [participants, setParticipants] = useState([
        { id: 1, name: '', amount: '', isPayer: true }
    ]);

    const addParticipant = () => {
        const newId = participants.length + 1;
        setParticipants([
            ...participants,
            { id: newId, name: '', amount: '', isPayer: false }
        ]);
    };

    const removeParticipant = (id) => {
        if (participants.length > 1) {
            setParticipants(participants.filter(p => p.id !== id));
        }
    };

    const updateParticipant = (id, field, value) => {
        setParticipants(participants.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const setPayer = (id) => {
        setParticipants(participants.map(p => ({
            ...p,
            isPayer: p.id === id
        })));
    };

    const calculateSplit = () => {
        if (!expenseAmount || expenseAmount <= 0) return null;

        const totalAmount = parseFloat(expenseAmount);
        const validParticipants = participants.filter(p => p.name.trim());

        if (validParticipants.length === 0) return null;

        if (splitType === 'equal') {
            const amountPerPerson = totalAmount / validParticipants.length;
            return validParticipants.map(p => ({
                ...p,
                amount: amountPerPerson.toFixed(2)
            }));
        } else {
            // Custom split
            const customAmounts = validParticipants.map(p => parseFloat(p.amount) || 0);
            const totalCustom = customAmounts.reduce((sum, amount) => sum + amount, 0);

            if (Math.abs(totalCustom - totalAmount) > 0.01) {
                return null; // Amounts don't match
            }

            return validParticipants.map(p => ({
                ...p,
                amount: (parseFloat(p.amount) || 0).toFixed(2)
            }));
        }
    };

    const handleSplit = () => {
        const splitResult = calculateSplit();
        if (splitResult) {
            onSplitComplete({
                description: expenseDescription,
                totalAmount: parseFloat(expenseAmount),
                participants: splitResult,
                splitType
            });
            onClose();
        }
    };

    const splitResult = calculateSplit();
    const isValid = splitResult && expenseDescription.trim();

    if (!isOpen) return null;

    return (
        <div className="expense-splitter-overlay" onClick={onClose}>
            <div className="expense-splitter-modal" onClick={(e) => e.stopPropagation()}>
                <div className="expense-splitter-header">
                    <h3>💰 Split Expense</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="expense-splitter-content">
                    <div className="expense-details">
                        <div className="input-group">
                            <label>Expense Description</label>
                            <input
                                type="text"
                                value={expenseDescription}
                                onChange={(e) => setExpenseDescription(e.target.value)}
                                placeholder="e.g., Dinner, Rent, Groceries"
                            />
                        </div>

                        <div className="input-group">
                            <label>Total Amount (RPS)</label>
                            <input
                                type="number"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="split-type-selector">
                            <label>Split Type:</label>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        value="equal"
                                        checked={splitType === 'equal'}
                                        onChange={(e) => setSplitType(e.target.value)}
                                    />
                                    <span>Equal Split</span>
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        value="custom"
                                        checked={splitType === 'custom'}
                                        onChange={(e) => setSplitType(e.target.value)}
                                    />
                                    <span>Custom Amounts</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="participants-section">
                        <div className="section-header">
                            <h4>Participants</h4>
                            <button className="add-participant-btn" onClick={addParticipant}>
                                + Add Person
                            </button>
                        </div>

                        {participants.map((participant) => (
                            <div key={participant.id} className="participant-row">
                                <div className="participant-info">
                                    <input
                                        type="text"
                                        value={participant.name}
                                        onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                                        placeholder="Name"
                                        className="name-input"
                                    />

                                    {splitType === 'custom' && (
                                        <input
                                            type="number"
                                            value={participant.amount}
                                            onChange={(e) => updateParticipant(participant.id, 'amount', e.target.value)}
                                            placeholder="Amount"
                                            min="0"
                                            step="0.01"
                                            className="amount-input"
                                        />
                                    )}

                                    <label className="payer-checkbox">
                                        <input
                                            type="radio"
                                            name="payer"
                                            checked={participant.isPayer}
                                            onChange={() => setPayer(participant.id)}
                                        />
                                        <span>Paid</span>
                                    </label>
                                </div>

                                {participants.length > 1 && (
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeParticipant(participant.id)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {splitResult && (
                        <div className="split-summary">
                            <h4>Split Summary</h4>
                            <div className="summary-items">
                                {splitResult.map((participant) => (
                                    <div key={participant.id} className="summary-item">
                                        <span className="participant-name">
                                            {participant.name || `Person ${participant.id}`}
                                            {participant.isPayer && <span className="payer-badge">💰</span>}
                                        </span>
                                        <span className="amount">RPS {participant.amount}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="total-line">
                                <strong>Total: RPS {expenseAmount}</strong>
                            </div>
                        </div>
                    )}

                    {splitType === 'custom' && expenseAmount && splitResult === null && (
                        <div className="error-message">
                            Custom amounts don't add up to the total. Please check your amounts.
                        </div>
                    )}

                    <button
                        className="split-expense-btn"
                        onClick={handleSplit}
                        disabled={!isValid}
                    >
                        Split Expense
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseSplitter; 