import React from 'react';
import { usePollTimer } from '../hooks/usePollTimer';

const LiveResults = ({ poll, isTeacher }) => {
    const { timeLeft, isExpired } = usePollTimer(poll.startTime, poll.duration);

    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{poll.question}</h3>
                <div className="timer">
                    {isExpired ? "Closed" : `${timeLeft}s`}
                </div>
            </div>

            <div className="flex-col">
                {poll.options.map(opt => {
                    const percentage = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    return (
                        <div key={opt._id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>{opt.text}</span>
                                <span>{opt.votes} votes ({percentage}%)</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '1.5rem', color: '#94a3b8' }}>
                Total Votes: {totalVotes}
            </div>
        </div>
    );
};

export default LiveResults;
