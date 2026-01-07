const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    studentName: { type: String, required: true },
    optionId: { type: String, required: true }, // Corresponds to OptionSchema _id
    timestamp: { type: Date, default: Date.now }
});

// Compound index to prevent double voting per poll by same student
VoteSchema.index({ pollId: 1, studentName: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
