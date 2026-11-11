const mongoose = require('mongoose');

// Rejects malformed :id parameters with a clean 400 instead of a database CastError.
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

module.exports = validateObjectId;
