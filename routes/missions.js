const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/api/missions.json');

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

// GET /api/missions
router.get('/', async (req, res) => {
  try {
    const missions = await readData();
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des missions' });
  }
});

// GET /api/missions/:id
router.get('/:id', async (req, res) => {
  try {
    const missions = await readData();
    const mission = missions.find(m => m.id === req.params.id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture de la mission' });
  }
});

// POST /api/missions
router.post('/', async (req, res) => {
  try {
    const missions = await readData();
    const newMission = {
      id: `MIS-${String(missions.length + 1).padStart(3, '0')}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'planifiée'
    };
    missions.push(newMission);
    await writeData(missions);
    res.status(201).json(newMission);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la mission' });
  }
});

// PUT /api/missions/:id
router.put('/:id', async (req, res) => {
  try {
    const missions = await readData();
    const index = missions.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    missions[index] = {
      ...missions[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await writeData(missions);
    res.json(missions[index]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la mission' });
  }
});

// DELETE /api/missions/:id
router.delete('/:id', async (req, res) => {
  try {
    const missions = await readData();
    const filteredMissions = missions.filter(m => m.id !== req.params.id);
    if (filteredMissions.length === missions.length) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    await writeData(filteredMissions);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la mission' });
  }
});

module.exports = router; 