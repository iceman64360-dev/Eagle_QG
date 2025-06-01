/**
 * Composant réutilisable : carte soldat
 * @param {object} s - soldat
 * @param {function} onDetails - callback pour afficher la fiche/modale
 * @returns {string} HTML
 */
export function SoldatCard(s, onDetails) {
  let badge = '';
  if (s.grade && s.grade.toLowerCase().includes('recrue')) {
    badge = `<span class=\"ml-2 px-2 py-0.5 bg-blue-500 text-white rounded text-xs\">Recrue</span>`;
  } else if (s.statut && s.statut.toLowerCase().includes('inactif')) {
    badge = `<span class=\"ml-2 px-2 py-0.5 bg-red-500 text-white rounded text-xs\">Inactif</span>`;
  }
  return `
    <div class=\"bg-yellow-900 bg-opacity-10 border-l-4 border-yellow-400 p-4 rounded shadow flex flex-col gap-1 mb-2\">
      <div class=\"flex items-center gap-2\">
        <span class=\"font-bold text-yellow-400\">${s.pseudo}</span>
        <span class=\"text-xs text-yellow-200\">${s.grade}</span>
        ${badge}
      </div>
      <div class=\"text-sm text-yellow-200\">Unité : <span class=\"font-mono\">${s.unite || '-'}</span></div>
      <div class=\"text-xs text-yellow-600\">Statut : ${s.statut || '-'}</div>
      <button class=\"mt-2 px-2 py-1 bg-yellow-400 text-black rounded text-xs font-bold hover:bg-yellow-500 transition\" data-soldat-id=\"${s.id}\">Détails</button>
    </div>
  `;
}
