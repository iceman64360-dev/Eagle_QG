// Variables globales
let modal;
let closeBtn;
let closeModalBtn;
let editBtn;
let detailBtns = [];
let soldatCards = [];
let isInitialized = false;
let currentSoldierId = null;
let soldiersData = []; // Stocke les données des soldats pour le filtrage

// Constantes pour les sélecteurs
const SELECTORS = {
  FILTER_STATUS: '#filter-status',
  FILTER_UNITE: '#filter-unite',
  FILTER_GRADE: '#filter-grade',
  SEARCH_INPUT: '#search',
  BTN_SEARCH: '#btn-search',
  BTN_RESET: '#btn-reset',
  BTN_ADD_SOLDIER: '#btn-add-soldat',
  SOLDAT_FORM: '#soldat-form',
  CARDS_CONTAINER: '.cards-container',
  SOLDATS_COUNT: '#soldats-count'
};

// Fonction pour charger les données des soldats depuis le stockage local
function loadSoldiersData() {
  try {
    const savedData = localStorage.getItem('soldiersData');
    if (savedData) {
      soldiersData = JSON.parse(savedData);
      console.log('[DATA] Données des soldats chargées:', soldiersData.length);
    } else {
      // Données par défaut si aucune donnée n'est sauvegardée
      soldiersData = Array.from(document.querySelectorAll('.card')).map(card => ({
        id: card.querySelector('.badge').textContent,
        nom: card.querySelector('.card-title').textContent,
        grade: card.querySelector('.info-row:nth-child(1) .info-value').textContent,
        unite: card.querySelector('.info-row:nth-child(2) .info-value').textContent,
        statut: card.querySelector('.info-row:nth-child(3) .info-value').textContent,
        missions: parseInt(card.querySelector('.info-row:nth-child(4) .info-value').textContent) || 0,
        notes: ''
      }));
      saveSoldiersData();
    }
    updateSoldiersCount();
    return true;
  } catch (error) {
    console.error('[ERREUR] Erreur lors du chargement des données:', error);
    return false;
  }
}

// Fonction pour sauvegarder les données des soldats
function saveSoldiersData() {
  try {
    localStorage.setItem('soldiersData', JSON.stringify(soldiersData));
    return true;
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la sauvegarde des données:', error);
    return false;
  }
}

// Fonction pour mettre à jour le compteur de soldats
function updateSoldiersCount() {
  const countElement = document.querySelector(SELECTORS.SOLDATS_COUNT);
  if (countElement) {
    const visibleCount = document.querySelectorAll(`${SELECTORS.CARDS_CONTAINER} .card:not(.hidden)`).length;
    countElement.textContent = `${visibleCount} soldat${visibleCount > 1 ? 's' : ''}`;
  }
}

// Fonction pour appliquer les filtres
function applyFilters() {
  const statusFilter = document.querySelector(SELECTORS.FILTER_STATUS).value.toLowerCase();
  const uniteFilter = document.querySelector(SELECTORS.FILTER_UNITE).value.toLowerCase();
  const gradeFilter = document.querySelector(SELECTORS.FILTER_GRADE).value.toLowerCase();
  const searchTerm = document.querySelector(SELECTORS.SEARCH_INPUT).value.toLowerCase();
  
  document.querySelectorAll('.card').forEach(card => {
    const status = card.querySelector('.info-row:nth-child(3) .info-value').textContent.toLowerCase();
    const unite = card.querySelector('.info-row:nth-child(2) .info-value').textContent.toLowerCase();
    const grade = card.querySelector('.info-row:nth-child(1) .info-value').textContent.toLowerCase();
    const nom = card.querySelector('.card-title').textContent.toLowerCase();
    const id = card.querySelector('.badge').textContent.toLowerCase();
    
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

// Fonction pour réinitialiser les filtres
function resetFilters() {
  document.querySelector(SELECTORS.FILTER_STATUS).value = '';
  document.querySelector(SELECTORS.FILTER_UNITE).value = '';
  document.querySelector(SELECTORS.FILTER_GRADE).value = '';
  document.querySelector(SELECTORS.SEARCH_INPUT).value = '';
  applyFilters();
}

// Fonction pour initialiser les écouteurs d'événements
function initEventListeners() {
  // Événements pour les filtres
  document.querySelector(SELECTORS.FILTER_STATUS)?.addEventListener('change', applyFilters);
  document.querySelector(SELECTORS.FILTER_UNITE)?.addEventListener('change', applyFilters);
  document.querySelector(SELECTORS.FILTER_GRADE)?.addEventListener('change', applyFilters);
  document.querySelector(SELECTORS.BTN_SEARCH)?.addEventListener('click', applyFilters);
  document.querySelector(SELECTORS.BTN_RESET)?.addEventListener('click', resetFilters);
  document.querySelector(SELECTORS.BTN_ADD_SOLDIER)?.addEventListener('click', () => {
    resetSoldierForm();
    toggleFormMode(true);
  });
  
  // Événements pour le formulaire
  const form = document.querySelector(SELECTORS.SOLDAT_FORM);
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      saveSoldier();
    });
  }
}

// Fonction pour réinitialiser le formulaire du soldat
function resetSoldierForm() {
  const form = document.getElementById('soldat-form');
  if (form) {
    form.reset();
    // Réinitialiser l'ID et donner le focus au champ nom
    document.getElementById('soldat-id').value = '';
    document.getElementById('soldat-nom').focus();
    // Mettre à jour le titre de la modale
    document.getElementById('modal-soldat-nom').textContent = 'Nouveau soldat';
    document.getElementById('modal-soldat-id').textContent = '';
  }
}

// Fonction pour vérifier si un élément est visible dans le DOM
function isElementVisible(selector) {
  try {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    
    if (element.offsetParent === null) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification de la visibilité de l\'élément:', error);
    return false;
  }
}

// Fonction pour basculer entre le mode formulaire et le mode visualisation
function toggleFormMode(showForm = true) {
  const form = document.getElementById('soldat-form');
  const viewMode = document.querySelector('.modal-body');
  
  if (showForm) {
    form.style.display = 'block';
    if (viewMode) viewMode.style.display = 'none';
  } else {
    form.style.display = 'none';
    if (viewMode) viewMode.style.display = 'block';
  }
}

// Fonction pour afficher les détails d'un soldat
function viewSoldier(id) {
  const soldier = soldiersData.find(s => s.id === id);
  if (!soldier) return;
  
  // Basculer en mode visualisation
  toggleFormMode(false);
  
  // Mettre à jour la modale avec les données du soldat
  document.getElementById('modal-soldat-nom').textContent = soldier.nom || 'Inconnu';
  document.getElementById('modal-soldat-id').textContent = soldier.id || '';
  
  // Mettre à jour le contenu de la modale
  const detailsHtml = `
    <div class="modal-section">
      <h3><i class="fas fa-info-circle"></i> Informations personnelles</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Grade :</span>
          <span class="info-value">${soldier.grade || 'Non spécifié'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Statut :</span>
          <span class="info-value status-${(soldier.statut || '').toLowerCase().replace(' ', '-')}">${soldier.statut || 'Inconnu'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Unité :</span>
          <span class="info-value">${soldier.unite || 'Non affecté'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Spécialité :</span>
          <span class="info-value">${soldier.specialite || 'Non spécifiée'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Missions :</span>
          <span class="info-value">${soldier.missions || 0}</span>
        </div>
      </div>
    </div>
    
    <div class="modal-section">
      <h3><i class="fas fa-clipboard-list"></i> Notes</h3>
      <div class="notes-container">
        <p>${soldier.notes || 'Aucune note pour ce soldat.'}</p>
      </div>
    </div>
    
    <div class="modal-actions">
      <button type="button" class="btn btn-primary" onclick="editSoldier('${soldier.id}')">
        <i class="fas fa-edit"></i> Modifier
      </button>
      <button type="button" class="btn btn-danger" onclick="if(confirm('Êtes-vous sûr de vouloir supprimer ce soldat ?')) deleteSoldier('${soldier.id}')">
        <i class="fas fa-trash"></i> Supprimer
      </button>
      <button type="button" class="btn btn-secondary" onclick="closeModal()">
        <i class="fas fa-times"></i> Fermer
      </button>
    </div>
  `;
  
  // Mettre à jour le contenu de la modale
  const modalBody = document.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML = detailsHtml;
  }
  
  // Afficher la modale
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

// Fonction pour éditer un soldat
function editSoldier(id) {
  const soldier = soldiersData.find(s => s.id === id);
  if (!soldier) return;
  
  // Basculer en mode formulaire
  toggleFormMode(true);
  
  // Mettre à jour le formulaire avec les données du soldat
  currentSoldierId = id;
  const form = document.getElementById('soldat-form');
  if (form) {
    // Réinitialiser le formulaire d'abord
    form.reset();
    
    // Remplir avec les données du soldat
    document.getElementById('soldat-id').value = soldier.id;
    document.getElementById('soldat-nom').value = soldier.nom || '';
    document.getElementById('soldat-grade').value = soldier.grade || '';
    document.getElementById('soldat-unite').value = soldier.unite || '';
    document.getElementById('soldat-statut').value = soldier.statut || 'Actif';
    document.getElementById('soldat-missions').value = soldier.missions || 0;
    document.getElementById('soldat-specialite').value = soldier.specialite || '';
    document.getElementById('soldat-notes').value = soldier.notes || '';
    
    // Mettre à jour le titre de la modale
    document.getElementById('modal-soldat-nom').textContent = soldier.nom || 'Nouveau soldat';
    document.getElementById('modal-soldat-id').textContent = soldier.id || '';
  }
  
  // Donner le focus au premier champ
  document.getElementById('soldat-nom')?.focus();
}

// Fonction utilitaire pour mettre à jour un champ
function updateField(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || '';
  }
}

// Fonction pour ouvrir la modale avec les données du soldat
function openSoldatModal(cardElement) {
  console.log('[DEBUG] === openSoldatModal appelée ===');
  console.log('[DEBUG] Élément carte reçu:', cardElement);
  
  if (!cardElement) {
    console.error('Aucun élément de carte fourni');
    return;
  }
  
  // Récupérer les données du soldat depuis la carte
  const cardHeader = cardElement.querySelector('.card-header');
  const cardContent = cardElement.querySelector('.card-content');
  
  if (!cardHeader || !cardContent) {
    console.error('Impossible de trouver le header ou le content de la carte');
    return;
  }
  
  try {
    const nom = cardHeader.querySelector('.card-title')?.textContent || 'Inconnu';
    const id = cardHeader.querySelector('.badge')?.textContent || '';
    const grade = cardContent.querySelector('.info-row:nth-child(1) .info-value')?.textContent || '';
    const unite = cardContent.querySelector('.info-row:nth-child(2) .info-value')?.textContent || '';
    const statut = cardContent.querySelector('.info-row:nth-child(3) .info-value')?.textContent || '';
    
    console.log('Données du soldat:', { nom, id, grade, unite, statut });
    
    // Mettre à jour les champs de la modale
    updateField('modal-soldat-nom', nom);
    updateField('modal-soldat-id', id);
    updateField('modal-soldat-grade', grade);
    updateField('modal-soldat-unite', unite);
    updateField('modal-soldat-statut', statut);
    
    // Afficher la modale
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
      console.log('Modale affichée');
      
      // Empêcher le clic sur la modale de fermer la modale
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        // Supprimer d'abord les anciens écouteurs pour éviter les doublons
        modalContent.replaceWith(modalContent.cloneNode(true));
        // Ajouter le nouvel écouteur
        modal.querySelector('.modal-content').addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
    } else {
      console.error('La modale n\'a pas été trouvée dans le DOM');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de la modale:', error);
  }
}

// Fonction pour fermer la modale
function closeModal() {
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    console.log('Modale fermée via closeModal()');
  }
}

// Fonction pour initialiser les événements de la modale
function initModalEventListeners() {
  // Événements pour ouvrir la modale via le bouton Détails
  const detailBtns = document.querySelectorAll('.card-footer .btn:first-child');
  if (detailBtns.length > 0) {
    console.log(`Ajout des écouteurs sur ${detailBtns.length} boutons Détails`);
    detailBtns.forEach((btn, index) => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log(`Bouton Détails #${index + 1} cliqué`);
        const card = this.closest('.card');
        if (card) {
          console.log('Carte parente trouvée, ouverture de la modale...');
          openSoldatModal(card);
        } else {
          console.error('Impossible de trouver la carte parente');
        }
      });
    });
  } else {
    console.warn('ATTENTION: Aucun bouton Détails trouvé dans .card-footer .btn:first-child');
    console.log('Structure HTML actuelle des cartes:', document.querySelector('#liste .card')?.outerHTML);
  }
  
  // Événements pour ouvrir la modale en cliquant sur la carte
  const soldatCards = document.querySelectorAll('#liste .card');
  if (soldatCards.length > 0) {
    console.log(`Configuration des écouteurs pour ${soldatCards.length} cartes soldats`);
    soldatCards.forEach((card, index) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        // Ne pas ouvrir la modale si on clique sur un bouton ou un lien
        if (e.target.closest('button, a, .btn')) {
          console.log('Clic sur un bouton/élément interactif, annulation');
          return;
        }
        console.log(`Clic sur la carte soldat #${index + 1}`);
        openSoldatModal(this);
      });
    });
  } else {
    console.error('ERREUR CRITIQUE: Aucune carte de soldat trouvée dans #liste .card');
    console.log('Contenu de #liste:', document.getElementById('liste')?.innerHTML);
  }

  // Événements pour fermer la modale
  const closeBtn = document.querySelector('.modal-close');
  const closeModalBtn = document.getElementById('btn-close-modal');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
    console.log('Écouteur d\'événement ajouté sur le bouton de fermeture');
  } else {
    console.warn('Bouton de fermeture (.modal-close) non trouvé');
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
    console.log('Écouteur d\'événement ajouté sur le bouton Fermer');
  } else {
    console.warn('Bouton Fermer (#btn-close-modal) non trouvé');
  }
  
  // Fermer la modale si on clique en dehors
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      console.log('Clic en dehors de la modale détecté');
      closeModal();
    }
  });
  
  console.log('Gestion des clics en dehors de la modale configuré');

  // Mode édition des notes
  const notesTextarea = document.getElementById('modal-soldat-notes');
  const editBtn = document.getElementById('btn-edit-notes');
  
  if (editBtn && notesTextarea) {
    console.log('Configuration du bouton d\'édition des notes');
    editBtn.addEventListener('click', function() {
      const isDisabled = notesTextarea.disabled;
      notesTextarea.disabled = !isDisabled;
      
      if (isDisabled) {
        console.log('Activation du mode édition des notes');
        this.innerHTML = '<i class="fas fa-save"></i> Terminer';
        this.classList.add('btn-success');
        notesTextarea.focus();
      } else {
        console.log('Désactivation du mode édition des notes');
        this.innerHTML = '<i class="fas fa-edit"></i> Modifier';
        this.classList.remove('btn-success');
      }
    });
  } else {
    console.warn('Impossible de configurer l\'édition des notes:', {
      editBtn: !!editBtn,
      notesTextarea: !!notesTextarea
    });
  }
}

// Vérifier les éléments critiques au chargement
function checkCriticalElements() {
  const elements = {
    '#modal-soldat': 'Modale principale',
    '#liste .card': 'Cartes de soldats',
    '.card-footer .btn:first-child': 'Boutons Détails'
  };
  
  let allFound = true;
  for (const [selector, name] of Object.entries(elements)) {
    const found = document.querySelectorAll(selector).length > 0;
    console.log(`${name} (${selector}): ${found ? 'Trouvé' : 'Manquant'}`);
    allFound = allFound && found;
  }
  
  return allFound;
}

// Démarrer l'initialisation de la page
export function startApp() {
  console.log('[INIT] Démarrage de l\'application...');
  
  // Éviter les initialisations multiples
  if (isInitialized) {
    console.log('[INIT] L\'application est déjà initialisée');
    return;
  }
  
  // Initialiser les variables globales
  console.log('[INIT] Recherche des éléments du DOM...');
  modal = document.getElementById('modal-soldat');
  closeBtn = document.querySelector('.modal-close');
  closeModalBtn = document.getElementById('btn-close-modal');
  editBtn = document.getElementById('btn-edit-soldat');
  
  // Utiliser Array.from pour convertir les NodeList en tableaux
  detailBtns = Array.from(document.querySelectorAll('.card-footer .btn:first-child'));
  soldatCards = Array.from(document.querySelectorAll('#liste .card'));
  
  console.log('[INIT] Éléments trouvés:', {
    modal: !!modal,
    closeBtn: !!closeBtn,
    closeModalBtn: !!closeModalBtn,
    editBtn: !!editBtn,
    detailBtns: detailBtns.length,
    soldatCards: soldatCards.length
  });
  
  // Initialiser les écouteurs d'événements
  initEventListeners();
  
  // Initialiser les écouteurs d'événements de la modale
  initModalEventListeners();
  
  // Charger les données des soldats
  loadSoldiersData();
  
  // Mettre à jour le compteur de soldats
  updateSoldiersCount();
  
  // Appliquer les filtres par défaut
  applyFilters();
  
  console.log('[INIT] Application initialisée avec succès');
  isInitialized = true;
}

// Exporter les fonctions globales pour le débogage
window.openSoldatModal = openSoldatModal;
window.closeModal = closeModal; 