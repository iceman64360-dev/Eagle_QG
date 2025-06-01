/**
 * Composant réutilisable : carte unité (pour arborescence ou stats)
 * @param {object} u - unité
 * @returns {string} HTML
 */
export function UniteCard(u) {
  const badge = (!u.occupants || u.occupants.length === 0) ? '<span class=\"ml-2 px-2 py-0.5 bg-red-500 text-white rounded text-xs\">Vide</span>' : '';
  return `
    <div class=\"bg-yellow-900 bg-opacity-10 border-l-4 border-yellow-400 p-4 rounded shadow flex flex-col gap-1 mb-2\">
      <div class=\"flex items-center gap-2\">
        <span class=\"font-bold text-yellow-400\">${u.nom}</span>
        <span class=\"text-xs text-yellow-200\">[${u.type.replace('_',' ').toUpperCase()}]</span>
        ${badge}
      </div>
      <div class=\"text-sm text-yellow-200\">ID : <span class=\"font-mono\">${u.id_unite}</span></div>
      <div class=\"text-xs text-yellow-600\">Occupants : ${(u.occupants && u.occupants.length) ? u.occupants.length : 0}</div>
    </div>
  `;
}
