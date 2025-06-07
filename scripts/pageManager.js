// Gestionnaire de pages pour initialiser les fonctionnalités spécifiques

import { initUnites } from './unitesManager.js';
import { initSoldats } from './soldatsManager.js';
import { initMissions } from './missionsManager.js';
import { initFormations } from './formationsManager.js';
import { displayDashboard } from './displayManager.js';

const PAGE_INITIALIZERS = {
    '#dashboard': displayDashboard,
    '#unites': initUnites,
    '#soldats': initSoldats,
    '#missions': initMissions,
    '#formations': initFormations
};

export function initializePage(pageHash) {
    const initializer = PAGE_INITIALIZERS[pageHash];
    if (initializer) {
        console.log(`Initialisation de la page: ${pageHash}`);
        initializer();
    }
}

// Fonction pour réinitialiser les gestionnaires d'événements
export function resetEventListeners() {
    // Supprimer tous les gestionnaires d'événements existants
    const oldElements = document.querySelectorAll('[data-event-bound]');
    oldElements.forEach(element => {
        element.removeAttribute('data-event-bound');
    });
}

// Fonction pour ajouter des gestionnaires d'événements aux éléments
export function addEventListeners() {
    // Gestionnaires pour les modales
    document.querySelectorAll('.modal-close').forEach(button => {
        if (!button.hasAttribute('data-event-bound')) {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.remove();
                }
            });
            button.setAttribute('data-event-bound', 'true');
        }
    });

    // Gestionnaires pour les filtres
    document.querySelectorAll('.filters-container select, .filters-container input').forEach(element => {
        if (!element.hasAttribute('data-event-bound')) {
            element.addEventListener('change', () => {
                const filterForm = element.closest('form');
                if (filterForm) {
                    filterForm.dispatchEvent(new Event('submit'));
                }
            });
            element.setAttribute('data-event-bound', 'true');
        }
    });

    // Gestionnaires pour les formulaires
    document.querySelectorAll('form').forEach(form => {
        if (!form.hasAttribute('data-event-bound')) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                console.log('Form submitted:', data);
                // Ici, vous pouvez ajouter la logique spécifique pour chaque formulaire
            });
            form.setAttribute('data-event-bound', 'true');
        }
    });
}

// Fonction pour initialiser une nouvelle page
export function initNewPage(pageHash) {
    resetEventListeners();
    initializePage(pageHash);
    addEventListeners();
} 