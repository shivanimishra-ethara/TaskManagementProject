require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve frontend in production
const path = require('path');
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const { MongoMemoryServer } = require('mongodb-memory-server');

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Use in-memory DB if trying to use localhost but no DB is running locally
    if (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Using In-Memory MongoDB for local development');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

startServer();
