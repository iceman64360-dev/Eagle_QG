/**
 * Formulaire d’ajout/édition formation
 * @param {object} formation (optionnel)
 * @returns {string} HTML
 */
export function FormationForm(formation = {}) {
  return `
    <form id=\"formation-form\" class=\"flex flex-col gap-2\">
      <label>Nom <input name=\"nom\" required class=\"input\" value=\"${formation.nom || ''}\"></label>
      <label>Description <input name=\"description\" class=\"input\" value=\"${formation.description || ''}\"></label>
      <div class=\"flex gap-2 mt-2\">
        <button type=\"submit\" class=\"btn bg-yellow-400 text-black\">${formation.id ? 'Enregistrer' : 'Ajouter'}</button>
        <button type=\"button\" id=\"cancel-form\" class=\"btn bg-gray-700 text-yellow-400\">Annuler</button>
      </div>
    </form>
  `;
}
