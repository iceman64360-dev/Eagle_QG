/**
 * Composant réutilisable : carte formation
 * @param {object} f - formation
 * @returns {string} HTML
 */
export function FormationCard(f) {
  const badge = (!f.description || f.description.trim() === '') ? '<span class=\"ml-2 px-2 py-0.5 bg-red-500 text-white rounded text-xs\">Description manquante</span>' : '';
  return `
    <div class=\"bg-yellow-900 bg-opacity-10 border-l-4 border-yellow-400 p-4 rounded shadow flex flex-col gap-1 mb-2\">
      <div class=\"flex items-center gap-2\">
        <span class=\"font-bold text-yellow-400\">${f.nom}</span>
        ${badge}
      </div>
      <div class=\"text-sm text-yellow-200\">${f.description || '-'} </div>
    </div>
  `;
}
