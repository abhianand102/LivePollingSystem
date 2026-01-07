const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout faster
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error: ', error.message);
        // Do not exit, allow server to run (though DB features will fail)
        // Retry logic could be added here
    }
};

module.exports = { connectDB };
