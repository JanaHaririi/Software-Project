const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Log incoming requests before routing
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

// MongoDB connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5-second timeout
  })
  .then(() => console.log(`[${new Date().toISOString()}] MongoDB connected`))
  .catch(err => {
    console.error(`[${new Date().toISOString()}] MongoDB connection error:`, err.message);
    console.log(`[${new Date().toISOString()}] Retrying connection in 5 seconds...`);
    setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
  });
};

connectWithRetry();

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Event Ticketing System!');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  res.status(500).json({ message: err.message || 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
  app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
      console.log(`${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
    } else if (r.name === 'router' && r.handle.stack) {
      const basePath = r.regexp.toString().replace(/\/\^\\\/api\\\/v1\\\/([a-z]+).*/, '$1');
      r.handle.stack.forEach(route => {
        if (route.route) {
          console.log(`${route.route.stack[0].method.toUpperCase()} /api/v1/${basePath}${route.route.path === '/' ? '' : route.route.path}`);
        }
      });
    }
  });
});