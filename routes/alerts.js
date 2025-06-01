const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Chemins des fichiers de données
const SOLDATS_FILE = path.join(__dirname, '../data/api/soldats.json');
const MISSIONS_FILE = path.join(__dirname, '../data/api/missions.json');
const FORMATIONS_FILE = path.join(__dirname, '../data/api/formations.json');

// Helper pour lire les données
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const [soldats, missions, formations] = await Promise.all([
      readData(SOLDATS_FILE),
      readData(MISSIONS_FILE),
      readData(FORMATIONS_FILE)
    ]);

    const alerts = [];

    // Vérifier les recrues inactives
    const recruesInactives = soldats.filter(soldat => {
      const isRecrue = soldat.grade === 'Recrue';
      const isInactif = soldat.statut === 'Inactif';
      const lastUpdate = new Date(soldat.updatedAt);
      const daysSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);
      return isRecrue && isInactif && daysSinceUpdate > 30;
    });

    if (recruesInactives.length > 0) {
      alerts.push({
        type: 'recrues_inactives',
        message: `${recruesInactives.length} recrue(s) inactive(s) depuis plus de 30 jours`,
        details: recruesInactives.map(s => ({
          id: s.id,
          nom: s.nom,
          derniereActivite: s.updatedAt
        }))
      });
    }

    // Vérifier les missions à debriefer
    const missionsADebriefer = missions.filter(mission => {
      const isTerminee = mission.statut === 'Terminée';
      const dateFin = new Date(mission.dateFin);
      const daysSinceEnd = (new Date() - dateFin) / (1000 * 60 * 60 * 24);
      return isTerminee && daysSinceEnd > 7 && !mission.debriefed;
    });

    if (missionsADebriefer.length > 0) {
      alerts.push({
        type: 'missions_debrief',
        message: `${missionsADebriefer.length} mission(s) en attente de debrief`,
        details: missionsADebriefer.map(m => ({
          id: m.id,
          nom: m.nom,
          dateFin: m.dateFin
        }))
      });
    }

    // Vérifier les formations en retard
    const formationsEnRetard = formations.filter(formation => {
      const isPlanifiee = formation.statut === 'Planifiée';
      const dateDebut = new Date(formation.dateDebut);
      const daysUntilStart = (dateDebut - new Date()) / (1000 * 60 * 60 * 24);
      return isPlanifiee && daysUntilStart < 7 && !formation.confirmed;
    });

    if (formationsEnRetard.length > 0) {
      alerts.push({
        type: 'formations_retard',
        message: `${formationsEnRetard.length} formation(s) à confirmer`,
        details: formationsEnRetard.map(f => ({
          id: f.id,
          nom: f.nom,
          dateDebut: f.dateDebut
        }))
      });
    }

    res.json({
      total: alerts.length,
      alerts
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
  }
});

module.exports = router; 