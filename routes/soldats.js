const express = require('express');
const router = express.Router();
const soldats = require('../dal/soldats');

// GET /api/soldats
router.get('/', async (req, res) => {
  try {
    const list = await soldats.all();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des soldats' });
  }
});

// GET /api/soldats/:id
router.get('/:id', async (req, res) => {
  try {
    const soldat = await soldats.get(req.params.id);
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
    const list = await soldats.all();
    const newSoldat = {
      id: `EGC-${String(list.length + 1).padStart(3, '0')}`,
      ...req.body
    };
    const created = await soldats.create(newSoldat);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du soldat' });
  }
});

// PUT /api/soldats/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await soldats.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Soldat non trouvé' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du soldat' });
  }
});

// DELETE /api/soldats/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await soldats.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Soldat non trouvé' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du soldat' });
  }
});

module.exports = router;
