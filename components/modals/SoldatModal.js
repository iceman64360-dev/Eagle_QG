/**
 * Composant réutilisable : modale fiche soldat
 * @param {object} soldat - objet soldat complet
 * @param {function} onClose - callback fermeture
 * @returns {string} HTML
 */
export function SoldatModal(soldat) {
  return `
    <div id=\"modal-bg\" class=\"fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50\">
      <div class=\"bg-gray-900 border-4 border-yellow-400 rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in\">
        <button id=\"close-modal\" class=\"absolute top-2 right-2 text-yellow-400 text-2xl font-bold hover:text-yellow-200\">&times;</button>
        <h2 class=\"text-2xl font-bold text-yellow-400 mb-2\">${soldat.pseudo}</h2>
        <div class=\"mb-2\"><span class=\"font-bold\">Grade :</span> ${soldat.grade}</div>
        <div class=\"mb-2\"><span class=\"font-bold\">Unité :</span> ${soldat.unite || '-'} </div>
        <div class=\"mb-2\"><span class=\"font-bold\">Statut :</span> ${soldat.statut || '-'}</div>
        <div class=\"mb-2\"><span class=\"font-bold\">Formations suivies :</span> ${(soldat.formations_suivies && soldat.formations_suivies.length) ? soldat.formations_suivies.join(', ') : '-'}</div>
        <div class=\"mb-2\"><span class=\"font-bold\">Missions effectuées :</span> ${soldat.missions_effectuees || 0}</div>
        <div class=\"mb-2\"><span class=\"font-bold\">Faits d'armes :</span> ${(soldat.faits_d_armes && soldat.faits_d_armes.length) ? soldat.faits_d_armes.join(', ') : '-'}</div>
        <div class=\"mb-2\"><span class=\"font-bold\">Récompenses :</span> ${(soldat.recompenses && soldat.recompenses.length) ? soldat.recompenses.join(', ') : '-'}</div>
      </div>
    </div>
  `;
}
