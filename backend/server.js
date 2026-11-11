const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Fail fast with a clear message instead of failing later on the first login.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 16) {
  console.error('[SmartCampus] JWT_SECRET is missing or too short (min 16 characters). Set it in backend/.env and restart.');
  process.exit(1);
}

// Connect to MongoDB Database
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware: Cross-Origin Resource Sharing (CORS)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
];

if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isCodespaces = (() => {
      try {
        const { hostname } = new URL(origin);
        return hostname.endsWith('.app.github.dev') || hostname.endsWith('.github.dev');
      } catch {
        return false;
      }
    })();
    if (isExplicitlyAllowed || isCodespaces) {
      return callback(null, true);
    }
    const err = new Error('CORS policy: Not allowed by CORS');
    err.status = 403;
    return callback(err, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware: Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve uploaded issue images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'SmartCampus API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));

// 404 Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    message: `Resource not found - ${req.originalUrl}`,
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  // File upload problems (too large, wrong type)
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5MB or smaller' : err.message;
    return res.status(400).json({ message });
  }
  if (/Only image files/.test(err.message || '')) {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = err.status || err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  console.error(`[Server Error] ${err.message}`);
  res.status(statusCode).json({
    message: statusCode >= 500 ? 'Internal Server Error' : err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// A stray rejected promise should be logged, not take the whole server down.
process.on('unhandledRejection', (reason) => {
  console.error('[SmartCampus] Unhandled promise rejection:', reason);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` SmartCampus Backend Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
