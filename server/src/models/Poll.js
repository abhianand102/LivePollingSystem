const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [OptionSchema],
    duration: { type: Number, required: true }, // in seconds
    startTime: { type: Date }, // Set when status becomes 'active'
    status: {
        type: String,
        enum: ['created', 'active', 'completed'],
        default: 'created'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poll', PollSchema);
