// dataManager.js — version statique pour GitHub Pages

export async function getSoldats() {
  const base = window.CONFIG?.DATA_DIR || 'data/test';
  const res = await fetch(`${base}/soldats.json`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des soldats');
  return await res.json();
}

export async function getUnites() {
  const base = window.CONFIG?.DATA_DIR || 'data/test';
  const res = await fetch(`${base}/unites.json`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des unités');
  return await res.json();
}

export async function getMissions() {
  const base = window.CONFIG?.DATA_DIR || 'data/test';
  const res = await fetch(`${base}/missions.json`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des missions');
  return await res.json();
}

export async function getFormations() {
  const base = window.CONFIG?.DATA_DIR || 'data/test';
  const res = await fetch(`${base}/formations.json`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des formations');
  return await res.json();
}

// Les fonctions de création, modification, suppression ne font rien en statique
export async function createSoldat() { throw new Error('Non supporté en statique'); }
export async function updateSoldat() { throw new Error('Non supporté en statique'); }
export async function deleteSoldat() { throw new Error('Non supporté en statique'); }
export async function createUnite() { throw new Error('Non supporté en statique'); }
export async function updateUnite() { throw new Error('Non supporté en statique'); }
export async function deleteUnite() { throw new Error('Non supporté en statique'); }
export async function createMission() { throw new Error('Non supporté en statique'); }
export async function updateMission() { throw new Error('Non supporté en statique'); }
export async function deleteMission() { throw new Error('Non supporté en statique'); }
export async function createFormation() { throw new Error('Non supporté en statique'); }
export async function updateFormation() { throw new Error('Non supporté en statique'); }
export async function deleteFormation() { throw new Error('Non supporté en statique'); }
