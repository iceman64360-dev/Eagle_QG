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
        <h2>${nom} <span style='font-size:0.7em;color:#aaa;'>${id}</span></h2>
        <p><b>Grade :</b> ${grade}</p>
        <p><b>Unité :</b> ${unite}</p>
        <p><b>Statut :</b> ${statut}</p>
        <p><b>Missions :</b> ${missions}</p>
      `;
      showModal(html);
    };
  });
} 