import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4rem' }}>
            <h1 className="title" style={{ fontSize: '3.5rem' }}>Live Polling</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3rem' }}>
                Real-time interactive polling for classrooms.
            </p>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div
                    className="card"
                    style={{ width: '250px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }}
                    onClick={() => navigate('/teacher')}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</div>
                    <h2>Teacher</h2>
                    <p style={{ color: '#94a3b8' }}>Create polls and view results</p>
                </div>

                <div
                    className="card"
                    style={{ width: '250px', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' }}
                    onClick={() => navigate('/student')}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🎓</div>
                    <h2>Student</h2>
                    <p style={{ color: '#94a3b8' }}>Join session and vote</p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
