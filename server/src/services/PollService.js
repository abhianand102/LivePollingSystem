const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

let currentActivePollId = null; // In-memory cache for speed, sync with DB

const getActivePoll = async () => {
    // Determine if there is an active poll in DB
    // We check for status 'active'
    const poll = await Poll.findOne({ status: 'active' });

    if (poll) {
        // Check if time expired
        const now = new Date();
        const endTime = new Date(poll.startTime.getTime() + poll.duration * 1000);

        if (now > endTime) {
            poll.status = 'completed';
            await poll.save();
            return null;
        }
        currentActivePollId = poll._id;
        return poll;
    }
    return null;
};

const createPoll = async (pollData) => {
    // Check if active poll exists
    const existing = await getActivePoll();
    if (existing) {
        throw new Error('There is already an active poll.');
    }

    const poll = new Poll({
        question: pollData.question,
        options: pollData.options.map(opt => ({ text: opt })),
        duration: pollData.duration,
        status: 'active',
        startTime: new Date()
    });

    await poll.save();
    currentActivePollId = poll._id;
    return poll;
};

const submitVote = async (pollId, studentName, optionId) => {
    // Check poll status
    const poll = await Poll.findById(pollId);
    if (!poll || poll.status !== 'active') {
        throw new Error('Poll is not active.');
    }

    // Check time
    const now = new Date();
    const endTime = new Date(poll.startTime.getTime() + poll.duration * 1000);
    if (now > endTime) {
        poll.status = 'completed';
        await poll.save();
        throw new Error('Poll time has expired.');
    }

    // Create vote
    // Schema index ensures uniqueness
    try {
        const vote = new Vote({
            pollId,
            studentName,
            optionId
        });
        await vote.save();

        // Update poll options count for quick read? 
        // Or aggregate on read. Aggregating on each vote is fine for small scale.
        // Let's increment atomic counter on Option
        const option = poll.options.id(optionId);
        if (option) {
            option.votes += 1;
            await poll.save();
        }

        return { success: true, poll };
    } catch (err) {
        if (err.code === 11000) {
            throw new Error('You have already voted.');
        }
        throw err;
    }
};

const getPollHistory = async () => {
    return await Poll.find({ status: 'completed' }).sort({ createdAt: -1 });
};

module.exports = {
    getActivePoll,
    createPoll,
    submitVote,
    getPollHistory
};
