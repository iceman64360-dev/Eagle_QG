const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/api/soldats.json');

// Helper pour lire/écrire les données
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si le fichier n'existe pas, on le crée avec un tableau vide
      await fs.writeFile(DATA_FILE, JSON.stringify([]));
      return [];
    }
    throw error;
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/soldats
router.get('/', async (req, res) => {
  try {
    const soldats = await readData();
    res.json(soldats);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des soldats' });
  }
});

// GET /api/soldats/:id
router.get('/:id', async (req, res) => {
  try {
    const soldats = await readData();
    const soldat = soldats.find(s => s.id === req.params.id);
    if (!soldat) {
      return res.status(404).json({ error: 'Soldat non trouvé' });
    }
    res.json(soldat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture du soldat' });
  }
});

// POST /api/soldats
router.post('/', async (req, res) => {
  try {
    const soldats = await readData();
    const newSoldat = {
      id: `EGC-${String(soldats.length + 1).padStart(3, '0')}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    soldats.push(newSoldat);
    await writeData(soldats);
    res.status(201).json(newSoldat);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du soldat' });
  }
});

// PUT /api/soldats/:id
router.put('/:id', async (req, res) => {
  try {
    const soldats = await readData();
    const index = soldats.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Soldat non trouvé' });
    }
    soldats[index] = {
      ...soldats[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await writeData(soldats);
    res.json(soldats[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du soldat' });
  }
});

// DELETE /api/soldats/:id
router.delete('/:id', async (req, res) => {
  try {
    const soldats = await readData();
    const filteredSoldats = soldats.filter(s => s.id !== req.params.id);
    if (filteredSoldats.length === soldats.length) {
      return res.status(404).json({ error: 'Soldat non trouvé' });
    }
    await writeData(filteredSoldats);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du soldat' });
  }
});

module.exports = router; 