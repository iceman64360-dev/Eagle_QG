const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data/api');
const DATA_FILE = path.join(DATA_DIR, 'unites.json');

// Helper pour lire/écrire les données
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, JSON.stringify([]));
      return [];
    }
    throw error;
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/unites
router.get('/', async (req, res) => {
  try {
    const unites = await readData();
    res.json(unites);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des unités' });
  }
});

// GET /api/unites/:id
router.get('/:id', async (req, res) => {
  try {
    const unites = await readData();
    const unite = unites.find(u => u.id === req.params.id);
    if (!unite) {
      return res.status(404).json({ error: 'Unité non trouvée' });
    }
    res.json(unite);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture de l\'unité' });
  }
});

// POST /api/unites
router.post('/', async (req, res) => {
  try {
    const unites = await readData();
    const newUnite = {
      id: `UNT-${String(unites.length + 1).padStart(3, '0')}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    unites.push(newUnite);
    await writeData(unites);
    res.status(201).json(newUnite);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'unité' });
  }
});

// PUT /api/unites/:id
router.put('/:id', async (req, res) => {
  try {
    const unites = await readData();
    const index = unites.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Unité non trouvée' });
    }
    unites[index] = {
      ...unites[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await writeData(unites);
    res.json(unites[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'unité' });
  }
});

// DELETE /api/unites/:id
router.delete('/:id', async (req, res) => {
  try {
    const unites = await readData();
    const filteredUnites = unites.filter(u => u.id !== req.params.id);
    if (filteredUnites.length === unites.length) {
      return res.status(404).json({ error: 'Unité non trouvée' });
    }
    await writeData(filteredUnites);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'unité' });
  }
});

module.exports = router; 