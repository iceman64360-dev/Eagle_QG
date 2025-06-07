// dataManager.js — utilisation de l'API Express

async function handleResponse(res, errorMsg) {
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`${errorMsg} (${res.status}) ${msg}`.trim());
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getSoldats() {
  const res = await fetch('/api/soldats');
  return handleResponse(res, 'Erreur lors de la récupération des soldats');
}

export async function getUnites() {
  const res = await fetch('/api/unites');
  return handleResponse(res, 'Erreur lors de la récupération des unités');
}

export async function getMissions() {
  const res = await fetch('/api/missions');
  return handleResponse(res, 'Erreur lors de la récupération des missions');
}

export async function getFormations() {
  const res = await fetch('/api/formations');
  return handleResponse(res, 'Erreur lors de la récupération des formations');
}

export async function createSoldat(data) {
  const res = await fetch('/api/soldats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Erreur lors de la création du soldat');
}

export async function updateSoldat(id, data) {
  const res = await fetch(`/api/soldats/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Erreur lors de la mise à jour du soldat');
}

export async function deleteSoldat(id) {
  const res = await fetch(`/api/soldats/${id}`, { method: 'DELETE' });
  return handleResponse(res, 'Erreur lors de la suppression du soldat');
}

export async function createUnite(data) {
  const res = await fetch('/api/unites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, "Erreur lors de la création de l'unité");
}

export async function updateUnite(id, data) {
  const res = await fetch(`/api/unites/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, "Erreur lors de la mise à jour de l'unité");
}

export async function deleteUnite(id) {
  const res = await fetch(`/api/unites/${id}`, { method: 'DELETE' });
  return handleResponse(res, "Erreur lors de la suppression de l'unité");
}

export async function createMission(data) {
  const res = await fetch('/api/missions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Erreur lors de la création de la mission');
}

export async function updateMission(id, data) {
  const res = await fetch(`/api/missions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Erreur lors de la mise à jour de la mission');
}

export async function deleteMission(id) {
  const res = await fetch(`/api/missions/${id}`, { method: 'DELETE' });
  return handleResponse(res, 'Erreur lors de la suppression de la mission');
}

export async function createFormation(data) {
  const res = await fetch('/api/formations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Erreur lors de la création de la formation');
}

export async function updateFormation(id, data) {
  const res = await fetch(`/api/formations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Erreur lors de la mise à jour de la formation');
}

export async function deleteFormation(id) {
  const res = await fetch(`/api/formations/${id}`, { method: 'DELETE' });
  return handleResponse(res, 'Erreur lors de la suppression de la formation');
}
