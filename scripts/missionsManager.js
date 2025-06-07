import { getMissions } from './dataManager.js';
import { showToast } from '../components/Toast.js';

let missions = [];

export async function initMissions() {
  try {
    missions = await getMissions();
  } catch (e) {
    console.error('Erreur chargement missions', e);
    missions = [];
  }
  renderMissions();
  const addBtn = document.getElementById('btn-add-mission');
  if (addBtn) addBtn.onclick = () => openMissionModal();
}

function renderMissions() {
  const container = document.querySelector('#liste .cards-container');
  if (!container) return;
  container.innerHTML = missions.map(m => missionCard(m)).join('');
  container.querySelectorAll('.btn-edit-mission').forEach(btn => {
    btn.onclick = () => {
      const mission = missions.find(m => m.id === btn.dataset.id);
      if (mission) openMissionModal(mission);
    };
  });
  updateCount();
}

function missionCard(m) {
  const participants = (m.participants || []).join(', ');
  return `
    <div class="card mission-card" data-id="${m.id}">
      <div class="card-header">
        <div class="mission-header-content">
          <h3 class="card-title">${m.nom}</h3>
          <span class="badge badge-warning">${m.id}</span>
        </div>
        <span class="mission-status">${m.statut || ''}</span>
      </div>
      <div class="card-content">
        <div class="mission-info">
          <div class="info-row"><span class="info-label">Date:</span><span class="info-value">${m.date || ''}</span></div>
          <div class="info-row"><span class="info-label">Participants:</span><span class="info-value">${participants}</span></div>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-edit-mission" data-id="${m.id}"><i class="fas fa-edit"></i> Modifier</button>
      </div>
    </div>`;
}

function updateCount() {
  const el = document.getElementById('missions-count');
  if (el) el.textContent = `${missions.length} mission${missions.length > 1 ? 's' : ''}`;
}

async function openMissionModal(mission = {}) {
  const [{ MissionForm }, { GenericModal }] = await Promise.all([
    import('../components/forms/MissionForm.js'),
    import('../components/modals/GenericModal.js')
  ]);

  const html = GenericModal(mission.id ? 'Modifier une mission' : 'Ajouter une mission', MissionForm(mission));
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('close-modal').onclick = () => document.getElementById('modal-bg').remove();
  document.getElementById('modal-bg').onclick = e => { if (e.target.id === 'modal-bg') document.getElementById('modal-bg').remove(); };
  document.getElementById('cancel-form').onclick = () => document.getElementById('modal-bg').remove();

  document.getElementById('mission-form').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    if (mission.id) {
      const idx = missions.findIndex(m => m.id === mission.id);
      if (idx !== -1) missions[idx] = { ...mission, ...data };
    } else {
      const newId = generateMissionId();
      missions.push({ id: newId, ...data });
    }
    document.getElementById('modal-bg').remove();
    showToast(mission.id ? 'Mission modifiée !' : 'Mission ajoutée !');
    renderMissions();
  };
}

function generateMissionId() {
  const max = missions.reduce((acc, m) => {
    const n = parseInt((m.id || '').replace(/\D/g, '')) || 0;
    return n > acc ? n : acc;
  }, 0);
  return `M${String(max + 1).padStart(3, '0')}`;
}

export function startApp() {
  initMissions();
}

document.addEventListener('DOMContentLoaded', startApp);
