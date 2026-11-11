const mongoose = require('mongoose');

// Converts any thrown error into a consistent JSON response.
//   Mongoose validation error  -> 400 (with the first readable message)
//   Invalid ObjectId (CastError) -> 400
//   Duplicate key (unique email) -> 409
//   Anything else               -> 500 with a generic message (details only logged)
const sendError = (res, error, fallbackMessage = 'Something went wrong') => {
  if (error instanceof mongoose.Error.ValidationError) {
    const first = Object.values(error.errors)[0];
    return res.status(400).json({ message: first?.message || 'Validation failed' });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Invalid ${error.path || 'value'} supplied` });
  }
  if (error && error.code === 11000) {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }
  console.error(`[SmartCampus] ${fallbackMessage}:`, error && error.message);
  return res.status(500).json({ message: `${fallbackMessage}. Please try again.` });
};

module.exports = sendError;
