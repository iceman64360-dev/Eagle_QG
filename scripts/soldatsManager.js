import { showModal } from './utils.js';

export function initSoldats() {
  // Sélectionne tous les boutons Détails
  document.querySelectorAll('.card-footer .btn:first-child').forEach(btn => {
    btn.onclick = function() {
      const card = this.closest('.card');
      if (!card) return;
      
      // Récupération des données de base
      const nom = card.querySelector('.card-title')?.textContent || 'Inconnu';
      const id = card.querySelector('.badge')?.textContent || '';
      const grade = card.querySelector('.info-row:nth-child(1) .info-value')?.textContent || '';
      const unite = card.querySelector('.info-row:nth-child(2) .info-value')?.textContent || '';
      const statut = card.querySelector('.info-row:nth-child(3) .info-value')?.textContent || '';
      const missions = card.querySelector('.info-row:nth-child(4) .info-value')?.textContent || '';
      
      // Génération du HTML de la modale
      const html = `
        <!-- En-tête de la modale -->
        <div class="modal-header">
          <div class="soldier-header">
            <h2 class="soldier-name">${nom}</h2>
            <span class="soldier-id">${id}</span>
          </div>
          <div class="soldier-status">
            <div class="status-main">
              <i class="fas fa-user-shield"></i>
              <span class="grade">${grade}</span>
              <a href="#" class="unite-link">${unite}</a>
            </div>
            <div class="status-details">
              <span class="status-badge status-${statut.toLowerCase().replace(' ', '-')}">${statut}</span>
              ${getStatusAlerts(statut, missions)}
            </div>
          </div>
        </div>

        <!-- Onglets de navigation -->
        <div class="modal-tabs">
          <button class="tab-btn active" data-tab="general">
            <i class="fas fa-info-circle"></i> Informations
          </button>
          <button class="tab-btn" data-tab="formations">
            <i class="fas fa-graduation-cap"></i> Formations
          </button>
          <button class="tab-btn" data-tab="missions">
            <i class="fas fa-tasks"></i> Missions
          </button>
          <button class="tab-btn" data-tab="sanctions">
            <i class="fas fa-exclamation-triangle"></i> Sanctions
          </button>
          <button class="tab-btn" data-tab="promotions">
            <i class="fas fa-star"></i> Promotions
          </button>
          <button class="tab-btn" data-tab="historique">
            <i class="fas fa-history"></i> Historique
          </button>
        </div>

        <!-- Contenu des onglets -->
        <div class="modal-content">
          <!-- Onglet Informations -->
          <div class="tab-content active" id="general">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Matricule</span>
                <span class="info-value">${id}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date d'incorporation</span>
                <span class="info-value">01/01/2024</span>
              </div>
              <div class="info-item">
                <span class="info-label">Parrain</span>
                <span class="info-value"><a href="#">ICEMAN</a></span>
              </div>
              <div class="info-item">
                <span class="info-label">Fonction</span>
                <span class="info-value">Chef de groupe</span>
              </div>
              <div class="info-item">
                <span class="info-label">Dernière mission</span>
                <span class="info-value">15/02/2024</span>
              </div>
            </div>
          </div>

          <!-- Onglet Formations -->
          <div class="tab-content" id="formations">
            <div class="formations-list">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Formation</th>
                    <th>Date</th>
                    <th>État</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tactique de base</td>
                    <td>01/02/2024</td>
                    <td><span class="badge badge-success">Validée</span></td>
                    <td><button class="btn btn-sm">Détails</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            ${grade.toLowerCase().includes('recrue') ? getRecrueProgress() : ''}
          </div>

          <!-- Onglet Missions -->
          <div class="tab-content" id="missions">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Opération Alpha</td>
                  <td>15/02/2024</td>
                  <td><span class="badge badge-success">Réussite</span></td>
                  <td><button class="btn btn-sm">Détails</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Onglet Sanctions -->
          <div class="tab-content" id="sanctions">
            <div class="actions-bar">
              <button class="btn btn-primary" onclick="showNewSanctionModal()">
                <i class="fas fa-plus"></i> Nouvelle sanction
              </button>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01/03/2024</td>
                  <td><span class="badge badge-warning">Avertissement</span></td>
                  <td>Retard formation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Onglet Promotions -->
          <div class="tab-content" id="promotions">
            <div class="actions-bar">
              <button class="btn btn-primary" onclick="showPromotionModal()">
                <i class="fas fa-arrow-up"></i> Promouvoir
              </button>
              <button class="btn btn-warning" onclick="showRetrogradationModal()">
                <i class="fas fa-arrow-down"></i> Rétrograder
              </button>
              <button class="btn btn-info" onclick="showCitationModal()">
                <i class="fas fa-medal"></i> Ajouter citation
              </button>
            </div>
            <div class="promotions-history">
              <h3>Historique des promotions</h3>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Promotion</th>
                    <th>Décision par</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01/01/2024</td>
                    <td>Soldat → Caporal</td>
                    <td>ICEMAN (CCH)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="citations-history">
              <h3>Citations</h3>
              <div class="badges-container">
                <span class="badge badge-bronze">Bronze (5 missions)</span>
                <span class="badge badge-silver">Silver (10 missions)</span>
              </div>
            </div>
          </div>

          <!-- Onglet Historique -->
          <div class="tab-content" id="historique">
            <div class="actions-bar">
              <select class="filter-select">
                <option value="all">Tous les événements</option>
                <option value="missions">Missions</option>
                <option value="formations">Formations</option>
                <option value="promotions">Promotions</option>
                <option value="sanctions">Sanctions</option>
              </select>
              <button class="btn btn-primary" onclick="exportHistory('pdf')">
                <i class="fas fa-file-pdf"></i> PDF
              </button>
              <button class="btn btn-primary" onclick="exportHistory('csv')">
                <i class="fas fa-file-csv"></i> CSV
              </button>
            </div>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-date">01/03/2024</div>
                <div class="timeline-content">
                  <span class="badge badge-mission">Mission</span>
                  <p>Opération Alpha - Réussite</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions principales -->
        <div class="modal-actions">
          <button class="btn btn-primary" onclick="exportSoldierCard()">
            <i class="fas fa-file-export"></i> Exporter la fiche
          </button>
          <button class="btn btn-secondary modal-close">
            <i class="fas fa-times"></i> Fermer
          </button>
        </div>
      `;
      
      showModal(html);
      initModalTabs();
    };
  });
}

// Fonctions utilitaires
function getStatusAlerts(statut, missions) {
  const alerts = [];
  
  if (statut.toLowerCase().includes('recrue') && !unite) {
    alerts.push('Recrue non affectée');
  }
  
  if (parseInt(missions) === 0) {
    alerts.push('Aucune mission effectuée');
  }
  
  if (alerts.length > 0) {
    return `
      <div class="alerts-container">
        ${alerts.map(alert => `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            ${alert}
          </div>
        `).join('')}
      </div>
    `;
  }
  
  return '';
}

function getRecrueProgress() {
  return `
    <div class="recrue-progress">
      <h3>Progression recrue</h3>
      <div class="progress-steps">
        <div class="progress-step completed">
          <i class="fas fa-check-circle"></i>
          <span>Incorporation</span>
        </div>
        <div class="progress-step completed">
          <i class="fas fa-check-circle"></i>
          <span>Validation des modules</span>
        </div>
        <div class="progress-step">
          <i class="fas fa-clock"></i>
          <span>Affectation définitive</span>
        </div>
      </div>
    </div>
  `;
}

function initModalTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Désactive tous les onglets
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // Active l'onglet cliqué
      tab.classList.add('active');
      const contentId = tab.dataset.tab;
      document.getElementById(contentId).classList.add('active');
    });
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