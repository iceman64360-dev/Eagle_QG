const express = require('express');
const router = express.Router();
const missions = require('../dal/missions');

// GET /api/missions
router.get('/', async (req, res) => {
  try {
    const list = await missions.all();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des missions' });
  }
});

// GET /api/missions/:id
router.get('/:id', async (req, res) => {
  try {
    const mission = await missions.get(req.params.id);
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
    const list = await missions.all();
    const newMission = {
      id: `MIS-${String(list.length + 1).padStart(3, '0')}`,
      ...req.body
    };
    const created = await missions.create(newMission);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la mission' });
  }
});

// PUT /api/missions/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await missions.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la mission' });
  }
});

// DELETE /api/missions/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await missions.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la mission' });
  }
});

module.exports = router;
