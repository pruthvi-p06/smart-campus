const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('[SmartCampus] MONGO_URI is missing. Add it to backend/.env (see backend/.env.example).');
    process.exit(1);
  }

  // Runtime connection problems are logged; they must not crash the process.
  mongoose.connection.on('error', (err) => console.error(`[SmartCampus] MongoDB error: ${err.message}`));
  mongoose.connection.on('disconnected', () => console.warn('[SmartCampus] MongoDB disconnected. Mongoose will retry automatically.'));

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log(`[SmartCampus] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[SmartCampus] MongoDB Connection Error: ${error.message}`);
    console.error('[SmartCampus] Check MONGO_URI, your Atlas username/password and that your IP is allowed in Atlas > Network Access.');
    process.exit(1);
  }
};

module.exports = connectDB;
