const PollService = require('../services/PollService');

const initSocket = (io) => {
    io.on('connection', async (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Send current state on connection
        try {
            const activePoll = await PollService.getActivePoll();
            if (activePoll) {
                socket.emit('poll_active', activePoll);
            }

            const history = await PollService.getPollHistory();
            socket.emit('poll_history', history);
        } catch (err) {
            console.error("Error sending init state", err);
        }

        socket.on('create_poll', async (data) => {
            // data: { question, options: [], duration }
            try {
                const newPoll = await PollService.createPoll(data);
                io.emit('poll_active', newPoll);
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('submit_vote', async (data) => {
            // data: { pollId, studentName, optionId }
            try {
                const result = await PollService.submitVote(data.pollId, data.studentName, data.optionId);

                // Broadcast updated results to everyone (Teacher needs it, Students might want to see live?)
                // Requirement: "View real-time updates as students submit votes"
                io.emit('poll_update', result.poll);
                socket.emit('vote_success', { pollId: data.pollId });
            } catch (err) {
                socket.emit('error', { message: err.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });
};

module.exports = { initSocket };
