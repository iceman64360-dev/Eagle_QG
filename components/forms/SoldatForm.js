/**
 * Formulaire d’ajout/édition soldat (modulaire)
 * @param {object} soldat (optionnel)
 * @returns {string} HTML
 */
export function SoldatForm(soldat = {}) {
  return `
    <form id=\"soldat-form\" class=\"flex flex-col gap-2\">
      <label>Pseudo <input name=\"pseudo\" required class=\"input\" value=\"${soldat.pseudo || ''}\"></label>
      <label>Grade <input name=\"grade\" required class=\"input\" value=\"${soldat.grade || ''}\"></label>
      <label>Unité <input name=\"unite\" class=\"input\" value=\"${soldat.unite || ''}\"></label>
      <label>Statut <input name=\"statut\" class=\"input\" value=\"${soldat.statut || ''}\"></label>
      <label>Formations suivies <input name=\"formations_suivies\" class=\"input\" value=\"${(soldat.formations_suivies||[]).join(', ')}\" placeholder=\"ex: Formation Alpha, Formation Bravo\"></label>
      <label>Missions effectuées <input name=\"missions_effectuees\" type=\"number\" min=\"0\" class=\"input\" value=\"${soldat.missions_effectuees || 0}\"></label>
      <label>Faits d'armes <input name=\"faits_d_armes\" class=\"input\" value=\"${(soldat.faits_d_armes||[]).join(', ')}\" placeholder=\"ex: Action héroïque\"></label>
      <label>Récompenses <input name=\"recompenses\" class=\"input\" value=\"${(soldat.recompenses||[]).join(', ')}\" placeholder=\"ex: Médaille\"></label>
      <div class=\"flex gap-2 mt-2\">
        <button type=\"submit\" class=\"btn bg-yellow-400 text-black\">${soldat.id ? 'Enregistrer' : 'Ajouter'}</button>
        <button type=\"button\" id=\"cancel-form\" class=\"btn bg-gray-700 text-yellow-400\">Annuler</button>
      </div>
    </form>
  `;
}
