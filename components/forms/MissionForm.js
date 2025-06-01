/**
 * Formulaire d’ajout/édition mission
 * @param {object} mission (optionnel)
 * @returns {string} HTML
 */
export function MissionForm(mission = {}) {
  return `
    <form id=\"mission-form\" class=\"flex flex-col gap-2\">
      <label>Nom <input name=\"nom\" required class=\"input\" value=\"${mission.nom || ''}\"></label>
      <label>Date <input name=\"date\" type=\"date\" class=\"input\" value=\"${mission.date || ''}\"></label>
      <label>Statut <input name=\"statut\" class=\"input\" value=\"${mission.statut || ''}\" placeholder=\"en cours, terminée...\"></label>
      <label>Participants <input name=\"participants\" class=\"input\" value=\"${(mission.participants||[]).join(', ')}\" placeholder=\"pseudo1, pseudo2\"></label>
      <div class=\"flex gap-2 mt-2\">
        <button type=\"submit\" class=\"btn bg-yellow-400 text-black\">${mission.id ? 'Enregistrer' : 'Ajouter'}</button>
        <button type=\"button\" id=\"cancel-form\" class=\"btn bg-gray-700 text-yellow-400\">Annuler</button>
      </div>
    </form>
  `;
}
