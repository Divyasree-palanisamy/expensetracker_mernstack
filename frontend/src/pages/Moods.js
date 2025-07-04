import React from 'react';

const Moods = () => (
    <div style={{ background: '#181818', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
        <h1>Mood Tracker</h1>
        <div style={{ margin: '2rem 0' }}>
            {/* Placeholder for mood tracker and chart */}
            <div style={{ background: '#222', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <h2>Log Mood</h2>
                <p>Form to log mood will appear here.</p>
            </div>
            <div style={{ background: '#222', borderRadius: '8px', padding: '1rem' }}>
                <h2>Mood Chart</h2>
                <p>Chart of moods over time will appear here.</p>
            </div>
        </div>
    </div>
);

export default Moods; 