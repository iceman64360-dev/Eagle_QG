const express = require('express');
const router = express.Router();
const formations = require('../dal/formations');

// GET /api/formations
router.get('/', async (req, res) => {
  try {
    const list = await formations.all();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des formations' });
  }
});

// GET /api/formations/:id
router.get('/:id', async (req, res) => {
  try {
    const formation = await formations.get(req.params.id);
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
    const list = await formations.all();
    const newFormation = {
      id: `FOR-${String(list.length + 1).padStart(3, '0')}`,
      ...req.body
    };
    const created = await formations.create(newFormation);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la formation' });
  }
});

// PUT /api/formations/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await formations.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la formation' });
  }
});

// DELETE /api/formations/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await formations.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la formation' });
  }
});

module.exports = router;
