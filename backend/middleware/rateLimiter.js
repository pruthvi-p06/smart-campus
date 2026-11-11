// Tiny in-memory rate limiter (no extra dependency). Good enough for a single-server
// college deployment. Use a shared store such as Redis if you ever run several servers.
const createRateLimiter = ({ windowMs, max, message }) => {
  const hits = new Map();

  // Periodically drop expired entries so the Map cannot grow forever.
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs);
  if (cleanup.unref) cleanup.unref();

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ message: message || 'Too many requests. Please try again later.' });
    }
    next();
  };
};

module.exports = { createRateLimiter };
