const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/api/formations.json');

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

// GET /api/formations
router.get('/', async (req, res) => {
  try {
    const formations = await readData();
    res.json(formations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des formations' });
  }
});

// GET /api/formations/:id
router.get('/:id', async (req, res) => {
  try {
    const formations = await readData();
    const formation = formations.find(f => f.id === req.params.id);
    if (!formation) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture de la formation' });
  }
});

// POST /api/formations
router.post('/', async (req, res) => {
  try {
    const formations = await readData();
    const newFormation = {
      id: `FOR-${String(formations.length + 1).padStart(3, '0')}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'planifiée'
    };
    formations.push(newFormation);
    await writeData(formations);
    res.status(201).json(newFormation);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la formation' });
  }
});

// PUT /api/formations/:id
router.put('/:id', async (req, res) => {
  try {
    const formations = await readData();
    const index = formations.findIndex(f => f.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    formations[index] = {
      ...formations[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await writeData(formations);
    res.json(formations[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la formation' });
  }
});

// DELETE /api/formations/:id
router.delete('/:id', async (req, res) => {
  try {
    const formations = await readData();
    const filteredFormations = formations.filter(f => f.id !== req.params.id);
    if (filteredFormations.length === formations.length) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    await writeData(filteredFormations);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la formation' });
  }
});

module.exports = router; 