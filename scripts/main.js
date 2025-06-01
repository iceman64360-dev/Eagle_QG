// Point d'entrée principal de l'application
// import { initData } from './dataManager.js'; // <-- supprimé pour version statique
import { loadPage } from './router.js';
import './utils.js';

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // await initData(); // <-- supprimé pour version statique
    
    // Configurer les liens de navigation pour éviter le rechargement complet
    document.querySelectorAll('nav .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          window.location.hash = href;
        }
      });
    });
    
    // Charger la page par défaut ou celle du hash courant
    const hash = window.location.hash || '#dashboard';
    await loadPage(hash);
    
    console.log('[Main] Application initialisée');
  } catch (error) {
    console.error('[Main] Erreur lors de l\'initialisation:', error);
    document.getElementById('app-root').innerHTML = `
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-triangle"></i>
        Une erreur est survenue lors de l'initialisation de l'application.
      </div>
    `;
  }
});

window.addEventListener('hashchange', () => {
  loadPage(window.location.hash);
});
