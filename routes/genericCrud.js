const express = require('express');
const fs = require('fs').promises;
const path = require('path');

function createCrudRouter(entityName, idPrefix) {
  const router = express.Router();
  const DATA_FILE = path.join(__dirname, '..', 'data', 'api', `${entityName}.json`);

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

  router.get('/', async (req, res) => {
    try {
      const items = await readData();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la lecture des données' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const items = await readData();
      const item = items.find(i => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Entrée non trouvée' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la lecture des données' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const items = await readData();
      const newItem = {
        id: `${idPrefix}-${String(items.length + 1).padStart(3, '0')}`,
        ...req.body,
        createdAt: new Date().toISOString(),
      };
      items.push(newItem);
      await writeData(items);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'entrée' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const items = await readData();
      const index = items.findIndex(i => i.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Entrée non trouvée' });
      }
      items[index] = {
        ...items[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      await writeData(items);
      res.json(items[index]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'entrée' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const items = await readData();
      const filtered = items.filter(i => i.id !== req.params.id);
      if (filtered.length === items.length) {
        return res.status(404).json({ error: 'Entrée non trouvée' });
      }
      await writeData(filtered);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'entrée' });
    }
  });

  return router;
}

module.exports = createCrudRouter;
