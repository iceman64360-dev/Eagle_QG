import { getFormations } from './dataManager.js';
import { showToast } from '../components/Toast.js';

let formations = [];

export async function initFormations() {
  try {
    formations = await getFormations();
  } catch (e) {
    console.error('Erreur chargement formations', e);
    formations = [];
  }
  renderFormations();
  const addBtn = document.getElementById('btn-add-formation');
  if (addBtn) addBtn.onclick = () => openFormationModal();
}

function renderFormations() {
  const container = document.querySelector('#liste .cards-container');
  if (!container) return;
  container.innerHTML = formations.map(f => formationCard(f)).join('');
  container.querySelectorAll('.btn-edit-formation').forEach(btn => {
    btn.onclick = () => {
      const formation = formations.find(f => f.id === btn.dataset.id);
      if (formation) openFormationModal(formation);
    };
  });
  updateCount();
}

function formationCard(f) {
  return `
    <div class="card mission-card" data-id="${f.id}">
      <div class="card-header">
        <div class="mission-header-content">
          <h3 class="card-title">${f.nom}</h3>
          <span class="badge badge-warning">${f.id}</span>
        </div>
      </div>
      <div class="card-content">
        <div class="mission-info">
          <div class="info-row"><span class="info-label">Description :</span><span class="info-value description-text">${f.description || ''}</span></div>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-edit-formation" data-id="${f.id}"><i class="fas fa-edit"></i> Modifier</button>
      </div>
    </div>`;
}

function updateCount() {
  const el = document.getElementById('formations-count');
  if (el) el.textContent = `${formations.length} formation${formations.length > 1 ? 's' : ''}`;
}

async function openFormationModal(formation = {}) {
  const [{ FormationForm }, { GenericModal }] = await Promise.all([
    import('../components/forms/FormationForm.js'),
    import('../components/modals/GenericModal.js')
  ]);

  const html = GenericModal(formation.id ? 'Modifier une formation' : 'Ajouter une formation', FormationForm(formation));
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('close-modal').onclick = () => document.getElementById('modal-bg').remove();
  document.getElementById('modal-bg').onclick = e => { if (e.target.id === 'modal-bg') document.getElementById('modal-bg').remove(); };
  document.getElementById('cancel-form').onclick = () => document.getElementById('modal-bg').remove();

  document.getElementById('formation-form').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    if (formation.id) {
      const idx = formations.findIndex(f => f.id === formation.id);
      if (idx !== -1) formations[idx] = { ...formation, ...data };
    } else {
      const newId = generateFormationId();
      formations.push({ id: newId, ...data });
    }
    document.getElementById('modal-bg').remove();
    showToast(formation.id ? 'Formation modifiée !' : 'Formation ajoutée !');
    renderFormations();
  };
}

function generateFormationId() {
  const max = formations.reduce((acc, f) => {
    const n = parseInt((f.id || '').replace(/\D/g, '')) || 0;
    return n > acc ? n : acc;
  }, 0);
  return `F${String(max + 1).padStart(3, '0')}`;
}

export function startApp() {
  initFormations();
}

document.addEventListener('DOMContentLoaded', startApp);
