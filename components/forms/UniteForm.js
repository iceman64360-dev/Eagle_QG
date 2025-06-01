/**
 * Formulaire d’ajout/édition unité
 * @param {object} unite (optionnel)
 * @returns {string} HTML
 */
export function UniteForm(unite = {}) {
  return `
    <form id=\"unite-form\" class=\"flex flex-col gap-2\">
      <label>Nom <input name=\"nom\" required class=\"input\" value=\"${unite.nom || ''}\"></label>
      <label>Type <input name=\"type\" required class=\"input\" value=\"${unite.type || ''}\" placeholder=\"compagnie, section...\"></label>
      <label>Supérieur <input name=\"superieur\" class=\"input\" value=\"${unite.superieur || ''}\" placeholder=\"ID du supérieur\"></label>
      <label>Occupants <input name=\"occupants\" class=\"input\" value=\"${(unite.occupants||[]).join(', ')}\" placeholder=\"pseudo1, pseudo2\"></label>
      <div class=\"flex gap-2 mt-2\">
        <button type=\"submit\" class=\"btn bg-yellow-400 text-black\">${unite.id_unite ? 'Enregistrer' : 'Ajouter'}</button>
        <button type=\"button\" id=\"cancel-form\" class=\"btn bg-gray-700 text-yellow-400\">Annuler</button>
      </div>
    </form>
  `;
}
