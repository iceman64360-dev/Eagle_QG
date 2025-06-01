// Toast.js — notification visuelle militaire
export function showToast(message, type = 'success') {
  const color = type === 'success' ? 'bg-yellow-400 text-black' : 'bg-red-600 text-white';
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded shadow-lg font-bold text-lg ${color} animate-fade-in`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.classList.add('opacity-0'); }, 1800);
  setTimeout(() => { toast.remove(); }, 2200);
}
