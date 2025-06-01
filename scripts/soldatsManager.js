import { showModal } from './utils.js';

export function initSoldats() {
  // Sélectionne tous les boutons Détails
  document.querySelectorAll('.card-footer .btn:first-child').forEach(btn => {
    btn.onclick = function() {
      const card = this.closest('.card');
      if (!card) return;
      const nom = card.querySelector('.card-title')?.textContent || 'Inconnu';
      const id = card.querySelector('.badge')?.textContent || '';
      const grade = card.querySelector('.info-row:nth-child(1) .info-value')?.textContent || '';
      const unite = card.querySelector('.info-row:nth-child(2) .info-value')?.textContent || '';
      const statut = card.querySelector('.info-row:nth-child(3) .info-value')?.textContent || '';
      const missions = card.querySelector('.info-row:nth-child(4) .info-value')?.textContent || '';
      
      const html = `
        <div class="modal-section">
          <h3><i class="fas fa-user-shield"></i> ${nom} <span style="font-size:0.7em;color:#aaa;">${id}</span></h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Grade :</span>
              <span class="info-value">${grade}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Unité :</span>
              <span class="info-value">${unite}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Statut :</span>
              <span class="info-value status-${statut.toLowerCase().replace(' ', '-')}">${statut}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Missions :</span>
              <span class="info-value">${missions}</span>
            </div>
          </div>
        </div>
      `;
      showModal(html);
    };
  });
}

export function startApp() {
  // Initialiser les soldats
  initSoldats();
  
  // Initialiser les filtres
  initFilters();
}

function initFilters() {
  const filterStatus = document.querySelector('#filter-status');
  const filterUnite = document.querySelector('#filter-unite');
  const filterGrade = document.querySelector('#filter-grade');
  const searchInput = document.querySelector('#search');
  const btnSearch = document.querySelector('#btn-search');
  const btnReset = document.querySelector('#btn-reset');
  
  if (btnSearch) {
    btnSearch.onclick = applyFilters;
  }
  
  if (btnReset) {
    btnReset.onclick = resetFilters;
  }
  
  [filterStatus, filterUnite, filterGrade, searchInput].forEach(el => {
    if (el) {
      el.onchange = applyFilters;
    }
  });
}

function applyFilters() {
  const statusFilter = document.querySelector('#filter-status')?.value.toLowerCase() || '';
  const uniteFilter = document.querySelector('#filter-unite')?.value.toLowerCase() || '';
  const gradeFilter = document.querySelector('#filter-grade')?.value.toLowerCase() || '';
  const searchTerm = document.querySelector('#search')?.value.toLowerCase() || '';
  
  document.querySelectorAll('.card').forEach(card => {
    const status = card.querySelector('.info-row:nth-child(3) .info-value')?.textContent.toLowerCase() || '';
    const unite = card.querySelector('.info-row:nth-child(2) .info-value')?.textContent.toLowerCase() || '';
    const grade = card.querySelector('.info-row:nth-child(1) .info-value')?.textContent.toLowerCase() || '';
    const nom = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const id = card.querySelector('.badge')?.textContent.toLowerCase() || '';
    
    const matchesStatus = !statusFilter || status.includes(statusFilter);
    const matchesUnite = !uniteFilter || unite.includes(uniteFilter);
    const matchesGrade = !gradeFilter || grade.includes(gradeFilter);
    const matchesSearch = !searchTerm || 
      nom.includes(searchTerm) || 
      id.includes(searchTerm) || 
      grade.includes(searchTerm);
    
    if (matchesStatus && matchesUnite && matchesGrade && matchesSearch) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
  
  updateSoldiersCount();
}

function resetFilters() {
  const filters = ['#filter-status', '#filter-unite', '#filter-grade', '#search'];
  filters.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.value = '';
    }
  });
  applyFilters();
}

function updateSoldiersCount() {
  const countElement = document.querySelector('#soldats-count');
  if (countElement) {
    const visibleCount = document.querySelectorAll('.cards-container .card:not(.hidden)').length;
    countElement.textContent = `${visibleCount} soldat${visibleCount > 1 ? 's' : ''}`;
  }
} 