const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

console.log('🚀 Starting Excel Analytics Platform Backend...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🌐 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');

// Import routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const chartRoutes = require('./routes/charts');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Excel Analytics Platform Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      '/api/auth',
      '/api/upload',
      '/api/charts',
      '/api/history',
      '/api/admin',
      '/api/ai',
      '/api/health'
    ]
  });
});

// Connect to MongoDB
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://painacc3t:pain6911@pain.qxsd7yc.mongodb.net/', {
  useNewUrlParser: true,
  // useUnifiedTopology is deprecated since MongoDB driver 4.0.0
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log('📊 Database: Excel Analytics Platform');
  console.log('🎯 Ready to accept connections...');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('');
  console.error('🔧 TROUBLESHOOTING STEPS:');
  console.error('   1. 🌐 Check your internet connection');
  console.error('   2. 🔒 Add your IP address to MongoDB Atlas whitelist:');
  console.error('      - Go to MongoDB Atlas dashboard');
  console.error('      - Navigate to Network Access');
  console.error('      - Click "Add IP Address"');
  console.error('      - Add your current IP: 0.0.0.0/0 (for development)');
  console.error('   3. 🔑 Verify your MongoDB credentials in .env file');
  console.error('   4. ⚡ Check if your MongoDB Atlas cluster is running');
  console.error('   5. 📞 Contact your MongoDB Atlas administrator');
  console.error('');
  console.error('📋 Your current MongoDB URI:', process.env.MONGODB_URI ? 'Set in environment' : 'Using fallback from server.js');
  console.error('');
  console.log('⚠️  Server will continue running without database connection...');

  // Don't exit the process in development, just log the error
  if (process.env.NODE_ENV === 'production') {
    console.log('💥 Exiting due to MongoDB connection failure in production...');
    process.exit(1);
  }
});

// Socket.io real-time events
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Example: listen for file upload event and broadcast to others
  socket.on('fileUploaded', (data) => {
    socket.broadcast.emit('fileUploaded', data);
  });

  // Example: listen for chart update event and broadcast
  socket.on('chartUpdated', (data) => {
    socket.broadcast.emit('chartUpdated', data);
  });

  // Example: listen for history update event and broadcast
  socket.on('historyUpdated', (data) => {
    socket.broadcast.emit('historyUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Start server with socket.io
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('');
  console.log('🎉 ======================================');
  console.log('   EXCEL ANALYTICS PLATFORM BACKEND');
  console.log('   ======================================');
  console.log('');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.io enabled: Yes`);
  console.log(`📁 Upload limit: 50MB`);
  console.log('');
  console.log('📋 Available API endpoints:');
  console.log('   GET  /api/health - Health check');
  console.log('   POST /api/auth/* - Authentication');
  console.log('   POST /api/upload/* - File uploads');
  console.log('   GET  /api/charts/* - Chart data');
  console.log('   GET  /api/history/* - Upload history');
  console.log('   GET  /api/admin/* - Admin panel');
  console.log('   POST /api/ai/* - AI features');
  console.log('');
  console.log('🎯 Ready to accept connections!');
  console.log('======================================');
  console.log('');
});

module.exports = { app, server, io };
