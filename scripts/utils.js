// Fonctions utilitaires globales

/**
 * Récupère l'environnement courant (TEST ou PROD)
 */
export function getEnv() {
  return window.EAGLE_ENV || 'TEST';
}

/**
 * Charge dynamiquement un fichier JSON du dossier data/test ou data/prod selon l'environnement
 * @param {string} name - Nom du fichier sans extension (ex: 'soldats', 'unites')
 * @returns {Promise<Object>} Données JSON
 */
export async function fetchData(name) {
  const env = getEnv();
  const url = `/data/${env.toLowerCase()}/${name}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur lors du chargement de ${url}`);
    return await response.json();
  } catch (err) {
    console.error('Erreur fetchData:', err);
    throw err;
  }
}

/**
 * Affiche une modale universelle avec le contenu HTML fourni
 * @param {string} contentHtml
 */
export function showModal(contentHtml) {
  // Supprime toute modale existante
  document.querySelectorAll('.modal-bg').forEach(e => e.remove());

  // Log du contenu injecté pour debug
  console.log('[showModal] HTML injecté :', contentHtml);

  // Crée le fond de la modale
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;';
  bg.innerHTML = `
    <div class="eagle-modal" style="background:#222 !important;color:#fff !important;padding:2em !important;border-radius:8px !important;min-width:300px !important;max-width:90vw !important;position:relative !important;border:2px solid #fff !important;box-shadow:0 0 20px #000 !important;z-index:100000 !important;opacity:1 !important;display:block !important;">
      <button class="modal-close" style="position:absolute;top:1em;right:1em;font-size:2em;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>
      <div class="modal-content">${contentHtml}</div>
    </div>
  `;
  document.body.appendChild(bg);

  // Fermer la modale
  bg.querySelector('.modal-close').onclick = () => bg.remove();
  bg.onclick = e => { if (e.target === bg) bg.remove(); };
}
