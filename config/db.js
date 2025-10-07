const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoapp';

module.exports = async function connectDB() {
  try {
    // mongoose.connect accepts a single uri and options are optional for modern drivers
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
    throw err;
  }
};
