/**
 * Composant réutilisable : carte mission
 * @param {object} m - mission
 * @returns {string} HTML
 */
export function MissionCard(m) {
  const badge = (!m.participants || m.participants.length === 0) ? '<span class=\"ml-2 px-2 py-0.5 bg-red-500 text-white rounded text-xs\">Aucun participant</span>' : '';
  return `
    <div class=\"bg-yellow-900 bg-opacity-10 border-l-4 border-yellow-400 p-4 rounded shadow flex flex-col gap-1 mb-2\">
      <div class=\"flex items-center gap-2\">
        <span class=\"font-bold text-yellow-400\">${m.nom}</span>
        <span class=\"text-xs text-yellow-200\">[${m.statut || '-'}]</span>
        ${badge}
      </div>
      <div class=\"text-sm text-yellow-200\">Date : <span class=\"font-mono\">${m.date || '-'}</span></div>
      <div class=\"text-xs text-yellow-600\">Participants : ${(m.participants && m.participants.length) ? m.participants.join(', ') : '-'}</div>
    </div>
  `;
}
