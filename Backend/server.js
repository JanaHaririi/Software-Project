require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');

const app = express();

console.log("🔄 Server is starting...");

// Built-in middlewares
app.use(express.json());
app.use(cookieParser());

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount user routes
app.use('/api/v1/users', userRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
});
