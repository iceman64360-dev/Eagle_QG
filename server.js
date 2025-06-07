const express = require('express');
const cors = require('cors');
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

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Routes
const createCrudRouter = require('./routes/genericCrud');
const alertsRouter = require('./routes/alerts');

app.use('/api/soldats', createCrudRouter('soldats', 'EGC'));
app.use('/api/missions', createCrudRouter('missions', 'MIS'));
app.use('/api/formations', createCrudRouter('formations', 'FOR'));
app.use('/api/unites', createCrudRouter('unites', 'UNT'));
app.use('/api/alerts', alertsRouter);

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
