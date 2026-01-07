import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const CreatePollForm = () => {
    const { socket } = useSocket();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [duration, setDuration] = useState(60);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!question || options.some(o => !o)) return;

        socket.emit('create_poll', {
            question,
            options,
            duration: parseInt(duration)
        });
    };

    return (
        <div className="card">
            <h2>Create a New Poll</h2>
            <form onSubmit={handleSubmit} className="flex-col">
                <div>
                    <label>Question</label>
                    <input
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="e.g., What is the capital of France?"
                        required
                    />
                </div>

                <div>
                    <label>Options</label>
                    {options.map((opt, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                value={opt}
                                onChange={e => handleOptionChange(idx, e.target.value)}
                                placeholder={`Option ${idx + 1}`}
                                required
                            />
                            {options.length > 2 && (
                                <button type="button" onClick={() => removeOption(idx)} style={{ background: '#ef4444', padding: '0.5em 1em' }}>X</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addOption} style={{ background: '#334155', fontSize: '0.9rem' }}>+ Add Option</button>
                </div>

                <div>
                    <label>Duration (seconds)</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        min="10"
                        max="300"
                    />
                </div>

                <button type="submit" style={{ marginTop: '1rem' }}>Ask Question</button>
            </form>
        </div>
    );
};

export default CreatePollForm;
