// dataManager.js — version statique pour GitHub Pages

// Utilitaire générique de chargement de données JSON de data/test
async function fetchData(name) {
  const res = await fetch(`data/test/${name}.json`);
  if (!res.ok) throw new Error(`Erreur chargement ${name}`);
  return res.json();
}

export const getSoldats = () => fetchData('soldats');

export const getUnites = () => fetchData('unites');

export const getMissions = () => fetchData('missions');

export const getFormations = () => fetchData('formations');

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
