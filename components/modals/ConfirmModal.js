/**
 * Modale de confirmation universelle
 * @param {string} message
 * @returns {string} HTML
 */
export function ConfirmModal(message) {
  return `
    <div id=\"modal-bg\" class=\"fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50\">
      <div class=\"bg-gray-900 border-4 border-yellow-400 rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in\">
        <button id=\"close-modal\" class=\"absolute top-2 right-2 text-yellow-400 text-2xl font-bold hover:text-yellow-200\">&times;</button>
        <div class=\"text-lg font-bold text-yellow-400 mb-4\">${message}</div>
        <div class=\"flex gap-3 justify-end\">
          <button id=\"confirm-yes\" class=\"btn bg-yellow-400 text-black\">Oui</button>
          <button id=\"confirm-no\" class=\"btn bg-gray-700 text-yellow-400\">Annuler</button>
        </div>
      </div>
    </div>
  `;
}
