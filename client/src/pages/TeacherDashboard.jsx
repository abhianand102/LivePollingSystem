import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import CreatePollForm from '../components/CreatePollForm';
import LiveResults from '../components/LiveResults';

const TeacherDashboard = () => {
    const { socket, isConnected } = useSocket();
    const [activePoll, setActivePoll] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('poll_active', (poll) => {
            setActivePoll(poll);
        });

        socket.on('poll_update', (updatedPoll) => {
            // Only update if it matches active poll
            if (activePoll && activePoll._id === updatedPoll._id) {
                // Preserve previous object reference if possible or just replace
                // Replacing is fine
                setActivePoll(updatedPoll);
            } else {
                setActivePoll(updatedPoll);
            }
        });

        socket.on('poll_history', (hist) => {
            setHistory(hist);
        });

        return () => {
            socket.off('poll_active');
            socket.off('poll_update');
            socket.off('poll_history');
        };
    }, [socket, activePoll]);

    // Check if active poll is actually completed based on time
    // We can use a simple check here to decide whether to show Create Form
    const isActivePollRunning = () => {
        if (!activePoll) return false;
        if (activePoll.status === 'completed') return false;

        // Double check time for UI sync
        const end = new Date(activePoll.startTime).getTime() + activePoll.duration * 1000;
        return Date.now() < end;
    };

    // Force re-render periodically to update UI "Poll Ended" state?
    // The LiveResults timer handles the countdown UI.
    // The Create Form visibility depends on it.
    // I'll add a simple interval to check 'now' for the parent container if needed, 
    // or just let LiveResults optional callback handle "onExpire"

    // Simplest: If activePoll, show LiveResults. 
    // If LiveResults says "Expired", show "Create New" button below it?
    // Or just show Create Form if !activePoll.
    // The server auto-closes on getActivePoll().

    // I will depend on the assumption that if I can't create a poll (server error), UI warns me.
    // But I want to hide the form if a poll is running.

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const pollIsRunning = activePoll && (new Date(activePoll.startTime).getTime() + activePoll.duration * 1000 > now);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="title">Teacher Dashboard</h1>
                <div style={{ color: isConnected ? '#22c55e' : '#ef4444' }}>
                    {isConnected ? '● Connected' : '○ Disconnected'}
                </div>
            </div>

            {/* If poll is running or we have an active poll object (even if just finished), show results */}
            {activePoll && (
                <div style={{ marginBottom: '2rem' }}>
                    <LiveResults poll={activePoll} isTeacher />
                </div>
            )}

            {/* Show create form only if no poll running */}
            {!pollIsRunning && (
                <div className={activePoll ? "animate-fade-in" : ""}>
                    {activePoll && <h3 style={{ color: '#94a3b8', textAlign: 'center' }}>Poll Ended. Ask another?</h3>}
                    <CreatePollForm />
                </div>
            )}

            {history.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                    <h2>Poll History</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.map(h => (
                            <div key={h._id} className="card" style={{ padding: '1rem' }}>
                                <h4>{h.question}</h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Date: {new Date(h.createdAt).toLocaleString()} |
                                    Votes: {h.options.reduce((a, b) => a + b.votes, 0)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
