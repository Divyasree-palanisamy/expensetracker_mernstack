import React from 'react';

const Goals = () => (
    <div style={{ background: '#181818', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
        <h1>Savings Goals</h1>
        <div style={{ margin: '2rem 0' }}>
            {/* Placeholder for goal list and add form */}
            <div style={{ background: '#222', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <h2>Goal List</h2>
                <p>List of savings goals will appear here.</p>
            </div>
            <div style={{ background: '#222', borderRadius: '8px', padding: '1rem' }}>
                <h2>Add Goal</h2>
                <p>Form to add a new goal will appear here.</p>
            </div>
        </div>
    </div>
);

export default Goals; 