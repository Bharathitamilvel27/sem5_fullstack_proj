const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); 
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tweets', require('./routes/tweetRoutes'));
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Error Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ❗ REMOVE app.listen — Vercel will handle this automatically!
// Export Express app for Vercel
module.exports = app;
