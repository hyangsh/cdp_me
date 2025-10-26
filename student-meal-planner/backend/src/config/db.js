
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error(err.message);
        throw err; // 에러를 상위로 던져서 server.js에서 처리하도록 함
    }
};

module.exports = { connectDB };
