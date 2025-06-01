/**
 * Composant réutilisable : modale générique
 * @param {string} title - titre
 * @param {string} content - contenu HTML
 * @returns {string} HTML
 */
export function GenericModal(title, content) {
  return `
    <div id=\"modal-bg\" class=\"fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50\">
      <div class=\"bg-gray-900 border-4 border-yellow-400 rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in\">
        <button id=\"close-modal\" class=\"absolute top-2 right-2 text-yellow-400 text-2xl font-bold hover:text-yellow-200\">&times;</button>
        <h2 class=\"text-2xl font-bold text-yellow-400 mb-2\">${title}</h2>
        <div>${content}</div>
      </div>
    </div>
  `;
}
