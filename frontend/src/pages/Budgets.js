import React from 'react';

const Budgets = () => (
    <div style={{ background: '#181818', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
        <h1>Budgets</h1>
        <div style={{ margin: '2rem 0' }}>
            {/* Placeholder for budget list and add form */}
            <div style={{ background: '#222', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <h2>Budget List</h2>
                <p>List of budgets will appear here.</p>
            </div>
            <div style={{ background: '#222', borderRadius: '8px', padding: '1rem' }}>
                <h2>Add Budget</h2>
                <p>Form to add a new budget will appear here.</p>
            </div>
        </div>
    </div>
);

export default Budgets; 