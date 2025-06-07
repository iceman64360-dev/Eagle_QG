import { getUnites, createUnite, updateUnite, deleteUnite } from './dataManager.js';

// État de l'application
let unites = [];
let selectedUnite = null;

// Initialisation
export async function initUnites() {
    try {
        unites = await getUnites();
        renderUniteTree();
        updateUnitesCount();
        const searchInput = document.getElementById('search-unite');
        if (searchInput) {
            searchInput.addEventListener('input', () => filterUnites(searchInput.value));
        }
    } catch (error) {
        console.error('Erreur lors du chargement des unités:', error);
    }
}

// Rendu de l'arbre des unités
function renderUniteTree() {
    const treeContainer = document.querySelector('.unit-tree');
    if (!treeContainer) return;

    // Nettoyer le conteneur
    treeContainer.innerHTML = '';

    // Créer l'unité principale (Eagle Company)
    const hqUnit = unites.find(u => u.id === 'EGC-HQ');
    if (hqUnit) {
        const hqNode = createUniteNode(hqUnit);
        treeContainer.appendChild(hqNode);
        selectedUnite = hqUnit;
        updateSelectedNode(hqNode);
        renderUniteDetails(hqUnit);
    }

    const searchInput = document.getElementById('search-unite');
    if (searchInput && searchInput.value) {
        filterUnites(searchInput.value);
    }
}

// Création d'un nœud d'unité
function createUniteNode(unite) {
    const node = document.createElement('div');
    node.className = 'unit-node';
    if (unite.id === 'EGC-HQ') node.classList.add('unit-hq');

    node.innerHTML = `
        <div class="unit-header">
            <div class="unit-toggle">
                <i class="fas fa-chevron-${unite.children?.length ? 'down' : 'right'}"></i>
            </div>
            <div class="unit-icon">
                <i class="fas ${getUniteIcon(unite.type)}"></i>
            </div>
            <div class="unit-info">
                <h3>${unite.nom}</h3>
                <div class="unit-meta">
                    <span class="unit-id">${unite.id}</span>
                    <span class="unit-count">${unite.membres?.length || 0} soldats</span>
                </div>
            </div>
            <div class="unit-actions">
                <button class="btn btn-sm" onclick="viewUnite('${unite.id}')" title="Voir les détails">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm" onclick="editUnite('${unite.id}')" title="Modifier l'unité">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
        ${unite.children?.length ? '<div class="unit-children"></div>' : ''}
    `;

    // Ajouter les sous-unités si présentes
    if (unite.children?.length) {
        const childrenContainer = node.querySelector('.unit-children');
        unite.children.forEach(childId => {
            const childUnite = unites.find(u => u.id === childId);
            if (childUnite) {
                childrenContainer.appendChild(createUniteNode(childUnite));
            }
        });
    }

    // Gestionnaire d'événements pour le toggle
    const toggle = node.querySelector('.unit-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const children = node.querySelector('.unit-children');
            if (children) {
                children.style.display = children.style.display === 'none' ? 'block' : 'none';
                toggle.querySelector('i').className =
                    children.style.display === 'none' ? 'fas fa-chevron-right' : 'fas fa-chevron-down';
            }
        });
    }

    // Sélection de l'unité au clic sur l'en-tête
    const header = node.querySelector('.unit-header');
    if (header) {
        header.addEventListener('click', () => {
            selectedUnite = unite;
            updateSelectedNode(node);
            renderUniteDetails(unite);
        });
    }

    return node;
}

// Obtenir l'icône appropriée pour le type d'unité
function getUniteIcon(type) {
    switch (type) {
        case 'HQ': return 'fa-star';
        case 'SQUAD': return 'fa-shield-alt';
        case 'TEAM': return 'fa-users';
        default: return 'fa-users';
    }
}

// Mise à jour du compteur d'unités
function updateUnitesCount() {
    const countElement = document.getElementById('unites-count');
    if (countElement) {
        countElement.textContent = `${unites.length} unités`;
    }
}

function updateSelectedNode(node) {
    document.querySelectorAll('.unit-selected').forEach(n => n.classList.remove('unit-selected'));
    node.classList.add('unit-selected');
}

function updateBreadcrumb(unite) {
    const breadcrumbEl = document.getElementById('breadcrumb');
    if (!breadcrumbEl) return;
    const path = [];
    let current = unite;
    while (current) {
        path.unshift(current.nom);
        current = current.parent ? unites.find(u => u.id === current.parent) : null;
    }
    breadcrumbEl.textContent = path.join(' > ');
}

function renderUniteDetails(unite) {
    const container = document.getElementById('unite-details');
    if (!container) return;
    container.innerHTML = `
        <div class="unit-card">
            <div class="unit-card-header">
                <h3>${unite.nom}</h3>
                <span class="badge badge-warning">${unite.id}</span>
            </div>
            <div class="unit-card-content">
                <div class="unit-stats">
                    <div class="stat-item">
                        <div class="stat-value">${unite.membres?.length || 0}</div>
                        <div class="stat-label">Soldats</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${unite.missions?.length || 0}</div>
                        <div class="stat-label">Missions</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="unit-card">
            <div class="unit-card-header">
                <h3>Membres</h3>
            </div>
            <div class="unit-card-content">
                <ul class="members-list">
                    ${unite.membres?.map(m => `<li>${m}</li>`).join('') || '<li>Aucun membre</li>'}
                </ul>
            </div>
        </div>`;
    updateBreadcrumb(unite);
}

// Filtrer l'arbre des unités selon la recherche
function filterUnites(term) {
    const value = term.toLowerCase();
    document.querySelectorAll('.unit-node').forEach(node => {
        const name = node.querySelector('.unit-info h3')?.textContent.toLowerCase() || '';
        const id = node.querySelector('.unit-id')?.textContent.toLowerCase() || '';
        if (!value || name.includes(value) || id.includes(value)) {
            node.style.display = '';
        } else {
            node.style.display = 'none';
        }
    });
}

// Gestionnaires d'événements
export function setupUniteEventListeners() {
    // Bouton d'ajout d'unité
    const addButton = document.getElementById('btn-add-unite');
    if (addButton) {
        addButton.addEventListener('click', showAddUniteForm);
    }

    // Boutons d'expansion/réduction
    const expandButton = document.getElementById('btn-expand-all');
    const collapseButton = document.getElementById('btn-collapse-all');
    
    if (expandButton) {
        expandButton.addEventListener('click', () => toggleAllUnits(true));
    }
    if (collapseButton) {
        collapseButton.addEventListener('click', () => toggleAllUnits(false));
    }
}

// Gestion du formulaire d'unité
function showAddUniteForm() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Nouvelle unité</h2>
                <span class="modal-close">&times;</span>
            </div>
            <form id="unite-form">
                <div class="form-group">
                    <label for="unite-nom">Nom de l'unité</label>
                    <input type="text" id="unite-nom" required>
                </div>
                <div class="form-group">
                    <label for="unite-type">Type d'unité</label>
                    <select id="unite-type" required>
                        <option value="TEAM">Équipe</option>
                        <option value="SQUAD">Section</option>
                        <option value="HQ">Quartier général</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-parent">Unité parente</label>
                    <select id="unite-parent">
                        <option value="">Aucune</option>
                        ${unites.map(u => `<option value="${u.id}">${u.nom}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-chef">Chef d'unité</label>
                    <select id="unite-chef">
                        <option value="">Non assigné</option>
                        <!-- À remplir dynamiquement avec les soldats -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-membres">Membres</label>
                    <select id="unite-membres" multiple>
                        <!-- À remplir dynamiquement avec les soldats -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-notes">Notes</label>
                    <textarea id="unite-notes"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Enregistrer</button>
                    <button type="button" class="btn btn-secondary modal-close">Annuler</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Gestionnaires d'événements
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });

    const form = modal.querySelector('#unite-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            nom: document.getElementById('unite-nom').value,
            type: document.getElementById('unite-type').value,
            parent: document.getElementById('unite-parent').value || null,
            chef: document.getElementById('unite-chef').value || null,
            membres: Array.from(document.getElementById('unite-membres').selectedOptions).map(opt => opt.value),
            notes: document.getElementById('unite-notes').value
        };

        try {
            await createUnite(formData);
            modal.remove();
            await initUnites(); // Recharger l'arbre
        } catch (error) {
            console.error('Erreur lors de la création de l\'unité:', error);
            alert('Erreur lors de la création de l\'unité');
        }
    });
}

// Fonction pour éditer une unité existante
async function editUnite(id) {
    const unite = unites.find(u => u.id === id);
    if (!unite) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Modifier l'unité</h2>
                <span class="modal-close">&times;</span>
            </div>
            <form id="unite-form">
                <div class="form-group">
                    <label for="unite-nom">Nom de l'unité</label>
                    <input type="text" id="unite-nom" value="${unite.nom}" required>
                </div>
                <div class="form-group">
                    <label for="unite-type">Type d'unité</label>
                    <select id="unite-type" required>
                        <option value="TEAM" ${unite.type === 'TEAM' ? 'selected' : ''}>Équipe</option>
                        <option value="SQUAD" ${unite.type === 'SQUAD' ? 'selected' : ''}>Section</option>
                        <option value="HQ" ${unite.type === 'HQ' ? 'selected' : ''}>Quartier général</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-parent">Unité parente</label>
                    <select id="unite-parent">
                        <option value="">Aucune</option>
                        ${unites.filter(u => u.id !== id).map(u => 
                            `<option value="${u.id}" ${unite.parent === u.id ? 'selected' : ''}>${u.nom}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-chef">Chef d'unité</label>
                    <select id="unite-chef">
                        <option value="">Non assigné</option>
                        <!-- À remplir dynamiquement avec les soldats -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-membres">Membres</label>
                    <select id="unite-membres" multiple>
                        <!-- À remplir dynamiquement avec les soldats -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="unite-notes">Notes</label>
                    <textarea id="unite-notes">${unite.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Enregistrer</button>
                    <button type="button" class="btn btn-secondary modal-close">Annuler</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Gestionnaires d'événements
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });

    const form = modal.querySelector('#unite-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            id: unite.id,
            nom: document.getElementById('unite-nom').value,
            type: document.getElementById('unite-type').value,
            parent: document.getElementById('unite-parent').value || null,
            chef: document.getElementById('unite-chef').value || null,
            membres: Array.from(document.getElementById('unite-membres').selectedOptions).map(opt => opt.value),
            notes: document.getElementById('unite-notes').value
        };

        try {
            await updateUnite(id, formData);
            modal.remove();
            await initUnites(); // Recharger l'arbre
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'unité:', error);
            alert('Erreur lors de la mise à jour de l\'unité');
        }
    });
}

// Fonction pour afficher les détails d'une unité
async function viewUnite(id) {
    const unite = unites.find(u => u.id === id);
    if (!unite) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${unite.nom}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="unite-details">
                    <div class="detail-group">
                        <h3>Informations générales</h3>
                        <p><strong>ID:</strong> ${unite.id}</p>
                        <p><strong>Type:</strong> ${unite.type}</p>
                        <p><strong>Chef d'unité:</strong> ${unite.chef || 'Non assigné'}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Membres (${unite.membres?.length || 0})</h3>
                        <ul class="members-list">
                            ${unite.membres?.map(m => `<li>${m}</li>`).join('') || '<li>Aucun membre</li>'}
                        </ul>
                    </div>
                    ${unite.notes ? `
                        <div class="detail-group">
                            <h3>Notes</h3>
                            <p>${unite.notes}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-close">Fermer</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Gestionnaires d'événements
    const closeButtons = modal.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });
}

// Déplier/replier toutes les unités
function toggleAllUnits(expand) {
    const toggles = document.querySelectorAll('.unit-toggle');
    toggles.forEach(toggle => {
        const children = toggle.closest('.unit-node').querySelector('.unit-children');
        if (children) {
            children.style.display = expand ? 'block' : 'none';
            toggle.querySelector('i').className = 
                expand ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
        }
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initUnites();
    setupUniteEventListeners();
});

// Exporter les fonctions nécessaires
export { viewUnite, editUnite }; 
