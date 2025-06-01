// Point d’entrée principal pour Eagle Operator
import { loadPage } from './router.js';
import { initData } from './dataManager.js';
import './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initData();
  // Gestion SPA universelle sur nav (empêche reload complet)
  document.querySelectorAll('header nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      if (/^\/pages\/.+\.html$/.test(href)) {
        e.preventDefault();
        // Convertit /pages/xxx.html en #xxx
        const hash = '#' + href.replace(/^\/pages\//, '').replace(/\.html$/, '');
        window.location.hash = hash;
      }
    });
  });
  loadPage(window.location.hash || '#dashboard');
});

window.addEventListener('hashchange', () => {
  loadPage(window.location.hash);
});
