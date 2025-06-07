const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/api/reports.json');

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

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const reports = await readData();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la lecture des rapports" });
  }
});

// POST /api/reports
router.post('/', async (req, res) => {
  try {
    const reports = await readData();
    const newReport = {
      id: `REP-${String(reports.length + 1).padStart(3, '0')}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    await writeData(reports);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du rapport" });
  }
});

module.exports = router;
