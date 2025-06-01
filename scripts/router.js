// Routage SPA simple basé sur le hash

const ROUTES = {
  '#dashboard': 'pages/dashboard.html',
  '#soldats': 'pages/soldats.html',
  '#unites': 'pages/unites.html',
  '#missions': 'pages/missions.html',
  '#formations': 'pages/formations.html',
  '#admin': 'pages/admin.html',
};

/**
 * Charge dynamiquement le contenu d'une page dans #app-root
 * @param {string} routeHash
 */
export async function loadPage(routeHash) {
  const page = ROUTES[routeHash] || ROUTES['#dashboard'];
  try {
    // Mise à jour des classes actives dans la navigation
    updateActiveNavLinks(routeHash);
    
    const resp = await fetch(page);
    if (!resp.ok) throw new Error(`Erreur chargement ${page}`);
    const html = await resp.text();
    // Extraire le <main> de la page cible pour l'injecter dans #app-root
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const main = doc.querySelector('main');
    document.getElementById('app-root').innerHTML = main ? main.innerHTML : html;
    console.log(`[Router] Page chargée: ${routeHash}`);
    
    // Ajouter un effet de transition
    const appRoot = document.getElementById('app-root');
    appRoot.style.opacity = '0';
    setTimeout(() => {
      appRoot.style.opacity = '1';
    }, 50);
  } catch (e) {
    document.getElementById('app-root').innerHTML = `<div class='alert alert-danger'><i class="fas fa-exclamation-triangle"></i> Erreur lors du chargement de la page.</div>`;
    console.error('[Router] Erreur:', e);
  }
}

/**
 * Navigation JS vers une route
 * @param {string} hash
 */
export function navigateTo(hash) {
  window.location.hash = hash;
}

/**
 * Met à jour les classes actives dans la navigation
 * @param {string} currentHash
 */
function updateActiveNavLinks(currentHash) {
  // Supprimer la classe active de tous les liens
  document.querySelectorAll('nav .nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Ajouter la classe active au lien correspondant au hash actuel
  const activeLink = document.querySelector(`nav .nav-link[href="${currentHash}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

function handleHashChange() {
  loadPage(window.location.hash);
}

window.addEventListener('hashchange', handleHashChange);

// Initialisation : charger la page par défaut ou celle du hash courant
window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash || !ROUTES[window.location.hash]) {
    window.location.hash = '#dashboard';
  } else {
    loadPage(window.location.hash);
  }
});
