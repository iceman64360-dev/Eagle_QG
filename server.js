const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://votre-username.github.io', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
const soldatsRouter = require('./routes/soldats');
const missionsRouter = require('./routes/missions');
const formationsRouter = require('./routes/formations');
const unitesRouter = require('./routes/unites');
const alertsRouter = require('./routes/alerts');

app.use('/api/soldats', soldatsRouter);
app.use('/api/missions', missionsRouter);
app.use('/api/formations', formationsRouter);
app.use('/api/unites', unitesRouter);
app.use('/api/alerts', alertsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Une erreur est survenue',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 