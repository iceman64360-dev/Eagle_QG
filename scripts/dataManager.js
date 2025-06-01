// dataManager.js — gestion centralisée CRUD en mémoire (prêt backend)

const dataStore = {
  soldats: [],
  unites: [],
  missions: [],
  formations: []
};

const API_BASE_URL = 'https://eagle-operator-backend.onrender.com/api';

export async function initData() {
  const files = [
    { type: 'soldats', path: '/data/test/soldats.json' },
    { type: 'unites', path: '/data/test/unites.json' },
    { type: 'missions', path: '/data/test/missions.json' },
    { type: 'formations', path: '/data/test/formations.json' }
  ];
  for (const f of files) {
    try {
      const res = await fetch(f.path);
      if (res.ok) {
        const list = await res.json();
        dataStore[f.type] = list;
      }
    } catch (e) { /* ignore */ }
  }
}

export function setData(type, list) {
  if (dataStore[type]) dataStore[type] = list;
}
export function getData(type) {
  return dataStore[type] || [];
}
export function addItem(type, item) {
  if (!item.id) item.id = 'id_' + Math.random().toString(36).slice(2, 10);
  dataStore[type].push(item);
  return item;
}
export function updateItem(type, item) {
  const idx = dataStore[type].findIndex(e => e.id === item.id);
  if (idx !== -1) dataStore[type][idx] = item;
}
export function deleteItem(type, id) {
  const idx = dataStore[type].findIndex(e => e.id === id);
  if (idx !== -1) dataStore[type].splice(idx, 1);
}

// Gestion des soldats
export async function getSoldats() {
  try {
    const response = await fetch(`${API_BASE_URL}/soldats`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des soldats');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function getSoldat(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/soldats/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération du soldat');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function createSoldat(soldatData) {
  try {
    const response = await fetch(`${API_BASE_URL}/soldats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(soldatData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création du soldat');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function updateSoldat(id, soldatData) {
  try {
    const response = await fetch(`${API_BASE_URL}/soldats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(soldatData),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du soldat');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function deleteSoldat(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/soldats/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du soldat');
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Gestion des missions
export async function getMissions() {
  try {
    const response = await fetch(`${API_BASE_URL}/missions`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des missions');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function getMission(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de la mission');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function createMission(missionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/missions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(missionData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la mission');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function updateMission(id, missionData) {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(missionData),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la mission');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function deleteMission(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/missions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la mission');
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Gestion des formations
export async function getFormations() {
  try {
    const response = await fetch(`${API_BASE_URL}/formations`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des formations');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function getFormation(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/formations/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de la formation');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function createFormation(formationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/formations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formationData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la formation');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function updateFormation(id, formationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formationData),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la formation');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function deleteFormation(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de la formation');
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Gestion des unités
export async function getUnites() {
  try {
    const response = await fetch(`${API_BASE_URL}/unites`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des unités');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function getUnite(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/unites/${id}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération de l\'unité');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function createUnite(uniteData) {
  try {
    const response = await fetch(`${API_BASE_URL}/unites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uniteData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de l\'unité');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function updateUnite(id, uniteData) {
  try {
    const response = await fetch(`${API_BASE_URL}/unites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uniteData),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'unité');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

export async function deleteUnite(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/unites/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'unité');
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}

// Gestion des alertes
export async function getAlerts() {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des alertes');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}
