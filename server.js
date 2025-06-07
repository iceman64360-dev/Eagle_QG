require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data/api');
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://votre-username.github.io', 'http://localhost:3000'];
app.locals.DATA_DIR = DATA_DIR;

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

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

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Expose runtime config to client
app.get('/config.js', (req, res) => {
  const config = {
    PORT,
    DATA_DIR,
    ALLOWED_ORIGINS: allowedOrigins,
  };
  res.type('application/javascript').send(`window.CONFIG = ${JSON.stringify(config)};`);
});

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
