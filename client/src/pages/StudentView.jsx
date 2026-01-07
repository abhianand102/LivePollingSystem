import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { usePollTimer } from '../hooks/usePollTimer';

const StudentView = () => {
    const { socket, isConnected } = useSocket();
    const [name, setName] = useState(localStorage.getItem('studentName') || '');
    const [isRegistered, setIsRegistered] = useState(!!localStorage.getItem('studentName'));
    const [activePoll, setActivePoll] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!socket) return;

        socket.on('poll_active', (poll) => {
            console.log("Received active poll", poll);
            setActivePoll(poll);
            setHasVoted(false); // Reset for new poll
            setSelectedOption(null);
            setFeedback('');
        });

        socket.on('poll_update', (poll) => {
            if (activePoll && activePoll._id === poll._id) {
                setActivePoll(poll);
            } else {
                setActivePoll(poll);
            }
        });

        socket.on('vote_success', ({ pollId }) => {
            if (activePoll && activePoll._id === pollId) {
                setHasVoted(true);
                setFeedback('Vote submitted!');
            }
        });

        socket.on('error', (err) => {
            setFeedback(err.message);
        });

        return () => {
            socket.off('poll_active');
            socket.off('poll_update');
            socket.off('vote_success');
            socket.off('error');
        };
    }, [socket, activePoll]);

    const handleRegister = (e) => {
        e.preventDefault();
        if (name.trim()) {
            localStorage.setItem('studentName', name);
            setIsRegistered(true);
        }
    };

    const handleVote = (optionId) => {
        if (!activePoll) return;

        // Resilience: Double Vote check on client
        if (hasVoted) return;

        socket.emit('submit_vote', {
            pollId: activePoll._id,
            studentName: name,
            optionId
        });
        setSelectedOption(optionId);
    };

    if (!isConnected) return <div className="card">Connecting to server...</div>;

    if (!isRegistered) {
        return (
            <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
                <h2>Welcome Student</h2>
                <form onSubmit={handleRegister}>
                    <label>Enter your name to join</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                        required
                    />
                    <button type="submit">Join Session</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="title">Student Room</h1>
                <div>👤 {name}</div>
            </div>

            {activePoll ? (
                <PollDisplay
                    poll={activePoll}
                    onVote={handleVote}
                    hasVoted={hasVoted || feedback === 'You have already voted.'}
                    selectedOption={selectedOption}
                    feedback={feedback}
                />
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h3>Waiting for teacher to ask a question...</h3>
                    <div className="loader"></div>
                </div>
            )}
        </div>
    );
};

const PollDisplay = ({ poll, onVote, hasVoted, selectedOption, feedback }) => {
    const { timeLeft, isExpired } = usePollTimer(poll.startTime, poll.duration);

    if (isExpired) {
        return (
            <div className="card">
                <h3>Poll Ended</h3>
                <p>The time for this question is up.</p>
                {/* Show results to student? Req: "Show results after submission" or "after 60s".
                     Prompt says: "Maximum of 60 seconds to answer a question, after which results are shown"
                 */}
                <ResultsView poll={poll} />
            </div>
        );
    }

    if (hasVoted) {
        return (
            <div className="card">
                <h3>Thanks for complying!</h3>
                <p>{feedback || "Your vote has been recorded."}</p>
                <p>Waiting for timer to end to show full results...</p>
                <div className="timer" style={{ marginTop: '1rem' }}>Time Left: {timeLeft}s</div>
            </div>
        );
    }

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{poll.question}</h3>
                <div className="timer">{timeLeft}s</div>
            </div>

            {feedback && <div className="error-msg">{feedback}</div>}

            <div className="grid-options">
                {poll.options.map(opt => (
                    <button
                        key={opt._id}
                        className={`option-btn ${selectedOption === opt._id ? 'selected' : ''}`}
                        onClick={() => onVote(opt._id)}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ResultsView = ({ poll }) => {
    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="flex-col" style={{ marginTop: '1rem' }}>
            {poll.options.map(opt => {
                const percentage = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
                return (
                    <div key={opt._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{opt.text}</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StudentView;
