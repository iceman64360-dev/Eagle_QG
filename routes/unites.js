const express = require('express');
const router = express.Router();
const unites = require('../dal/unites');

// GET /api/unites
router.get('/', async (req, res) => {
  try {
    const list = await unites.all();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des unités' });
  }
});

// GET /api/unites/:id
router.get('/:id', async (req, res) => {
  try {
    const unite = await unites.get(req.params.id);
    if (!unite) {
      return res.status(404).json({ error: 'Unité non trouvée' });
    }
    res.json(unite);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la lecture de l'unité" });
  }
});

// POST /api/unites
router.post('/', async (req, res) => {
  try {
    const list = await unites.all();
    const newUnite = {
      id: `UNT-${String(list.length + 1).padStart(3, '0')}`,
      ...req.body
    };
    const created = await unites.create(newUnite);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'unité" });
  }
});

// PUT /api/unites/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await unites.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Unité non trouvée' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'unité" });
  }
});

// DELETE /api/unites/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await unites.remove(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Unité non trouvée' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'unité" });
  }
});

module.exports = router;
