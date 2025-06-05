// hrManager.js - Gestion simplifiee des soldats et filtres HR
// Fournit une API haut niveau pour la page soldats.
//
// initHR() : charge la liste des soldats via initSoldats() et met en place les filtres.
// openSoldierForm(soldier?) : affiche le formulaire d'ajout/édition dans une modale générique.

import { initSoldats } from './soldatsManager.js';
import { showToast } from '../components/Toast.js';
import { addItem } from './dataManager.js';

// Initialisation des filtres
function initFilters() {
  const container = document.getElementById('filtres');
  const searchInput = document.getElementById('search');
  const btnReset = document.getElementById('btn-reset');
  const btnSearch = document.getElementById('btn-search');

  if (container) {
    container.addEventListener('change', applyFilters);
  }
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyFilters();
      }
    });
  }
  btnSearch?.addEventListener('click', applyFilters);
  btnReset?.addEventListener('click', resetFilters);
}

function getFilterValues() {
  return {
    status: document.querySelector('#filter-status')?.value.toLowerCase() || '',
    unite: document.querySelector('#filter-unite')?.value.toLowerCase() || '',
    grade: document.querySelector('#filter-grade')?.value.toLowerCase() || '',
    search: document.querySelector('#search')?.value.toLowerCase() || ''
  };
}

function applyFilters() {
  const { status, unite, grade, search } = getFilterValues();
  document.querySelectorAll('.cards-container .card').forEach(card => {
    const cStatus = card.querySelector('.info-row:nth-child(3) .info-value')?.textContent.toLowerCase() || '';
    const cUnite = card.querySelector('.info-row:nth-child(2) .info-value')?.textContent.toLowerCase() || '';
    const cGrade = card.querySelector('.info-row:nth-child(1) .info-value')?.textContent.toLowerCase() || '';
    const cNom = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const cId = card.querySelector('.badge')?.textContent.toLowerCase() || '';

    const match = (!status || cStatus.includes(status)) &&
                  (!unite || cUnite.includes(unite)) &&
                  (!grade || cGrade.includes(grade)) &&
                  (!search || cNom.includes(search) || cId.includes(search) || cGrade.includes(search));
    card.classList.toggle('hidden', !match);
  });
  updateCount();
}

function resetFilters() {
  ['#filter-status','#filter-unite','#filter-grade','#search'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.value = '';
  });
  applyFilters();
}

function updateCount() {
  const countElement = document.querySelector('#soldats-count');
  if (countElement) {
    const visible = document.querySelectorAll('.cards-container .card:not(.hidden)').length;
    countElement.textContent = `${visible} soldat${visible > 1 ? 's' : ''}`;
  }
}

export function initHR() {
  initSoldats();
  initFilters();
  document.getElementById('btn-add-soldat')?.addEventListener('click', () => openSoldierForm());
  updateCount();
}

export async function openSoldierForm(soldier = {}) {
  const [{ SoldatForm }, { GenericModal }] = await Promise.all([
    import('../components/forms/SoldatForm.js'),
    import('../components/modals/GenericModal.js')
  ]);
  const title = soldier.id ? `Modifier ${soldier.pseudo || soldier.id}` : 'Ajouter un soldat';
  const html = GenericModal(title, SoldatForm(soldier));
  document.body.insertAdjacentHTML('beforeend', html);
  const bg = document.getElementById('modal-bg');
  bg.querySelector('#close-modal').onclick = () => bg.remove();
  bg.onclick = (e) => { if (e.target.id === 'modal-bg') bg.remove(); };
  bg.querySelector('#cancel-form').onclick = () => bg.remove();
  bg.querySelector('#soldat-form').onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    if (data.formations_suivies) data.formations_suivies = data.formations_suivies.split(',').map(s => s.trim()).filter(Boolean);
    if (data.faits_d_armes) data.faits_d_armes = data.faits_d_armes.split(',').map(s => s.trim()).filter(Boolean);
    if (data.recompenses) data.recompenses = data.recompenses.split(',').map(s => s.trim()).filter(Boolean);
    data.missions_effectuees = parseInt(data.missions_effectuees) || 0;
    if (typeof addItem === 'function') {
      addItem('soldats', data);
    }
    bg.remove();
    showToast('Soldat ajouté !');
    initSoldats();
  };
}

