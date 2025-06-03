const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const writingRoutes = require('./routes/writingRoutes');
const speakingRoutes = require('./routes/speakingRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/writing', writingRoutes);
app.use('/api/speaking', speakingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 