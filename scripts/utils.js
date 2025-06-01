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
