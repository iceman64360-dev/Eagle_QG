const express = require('express');
const router = express.Router();
const soldatsDAL = require('../dal/soldats');
const missionsDAL = require('../dal/missions');
const formationsDAL = require('../dal/formations');

router.get('/', async (req, res) => {
  try {
    const [soldats, missions, formations] = await Promise.all([
      soldatsDAL.all(),
      missionsDAL.all(),
      formationsDAL.all()
    ]);

    const alerts = [];

    const recruesInactives = soldats.filter(s => {
      const isRecrue = s.grade === 'Recrue';
      const isInactif = s.statut === 'Inactif';
      const lastUpdate = new Date(s.updatedAt);
      const daysSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60 * 24);
      return isRecrue && isInactif && daysSinceUpdate > 30;
    });
    if (recruesInactives.length > 0) {
      alerts.push({
        type: 'recrues_inactives',
        message: `${recruesInactives.length} recrue(s) inactive(s) depuis plus de 30 jours`,
        details: recruesInactives.map(s => ({ id: s.id, nom: s.nom, derniereActivite: s.updatedAt }))
      });
    }

    const missionsADebriefer = missions.filter(m => {
      const isTerminee = m.statut === 'Terminée';
      const dateFin = new Date(m.dateFin);
      const daysSinceEnd = (Date.now() - dateFin) / (1000 * 60 * 60 * 24);
      return isTerminee && daysSinceEnd > 7 && !m.debriefed;
    });
    if (missionsADebriefer.length > 0) {
      alerts.push({
        type: 'missions_debrief',
        message: `${missionsADebriefer.length} mission(s) en attente de debrief`,
        details: missionsADebriefer.map(m => ({ id: m.id, nom: m.nom, dateFin: m.dateFin }))
      });
    }

    const formationsEnRetard = formations.filter(f => {
      const isPlanifiee = f.statut === 'Planifiée';
      const dateDebut = new Date(f.dateDebut);
      const daysUntilStart = (dateDebut - Date.now()) / (1000 * 60 * 60 * 24);
      return isPlanifiee && daysUntilStart < 7 && !f.confirmed;
    });
    if (formationsEnRetard.length > 0) {
      alerts.push({
        type: 'formations_retard',
        message: `${formationsEnRetard.length} formation(s) à confirmer`,
        details: formationsEnRetard.map(f => ({ id: f.id, nom: f.nom, dateDebut: f.dateDebut }))
      });
    }

    res.json({ total: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
  }
});

module.exports = router;
