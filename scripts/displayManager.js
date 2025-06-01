// Gestion de l’affichage dynamique (dashboard, alertes, etc.)
import { fetchData } from './utils.js';
import { getData, setData, addItem, updateItem, deleteItem } from './dataManager.js';
import { showToast } from '../components/Toast.js';

/**
 * Affiche le dashboard dynamique dans #app-root
 */
export async function displayDashboard() {
  try {
    const soldats = getData('soldats');
    const unites = getData('unites');
    const missions = getData('missions');
    const formations = getData('formations');
    // Stats
    const totalSoldats = soldats.length;
    const totalRecrues = soldats.filter(s => s.grade.toLowerCase().includes('recrue')).length;
    const totalUnites = unites.length;
    const totalMissions = missions.length;
    // Alertes fictives
    const alertes = [];
    const recruesSansAffect = soldats.filter(s => s.grade.toLowerCase().includes('recrue') && (!s.unite || s.unite === ''));
    if (recruesSansAffect.length > 0) {
      alertes.push(`<span class='text-yellow-300 font-bold'>${recruesSansAffect.length} recrue(s) sans affectation !</span>`);
    }
    const soldatsInactifs = soldats.filter(s => s.statut && s.statut.toLowerCase().includes('inactif'));
    if (soldatsInactifs.length > 0) {
      alertes.push(`<span class='text-red-400 font-bold'>${soldatsInactifs.length} soldat(s) inactif(s) !</span>`);
    }
    // Raccourcis
    const shortcuts = [
      { label: 'Voir Soldats', hash: '#soldats' },
      { label: 'Voir Unités', hash: '#unites' },
      { label: 'Voir Missions', hash: '#missions' },
      { label: 'Voir Formations', hash: '#formations' },
      { label: 'Admin', hash: '#admin' },
    ];
    document.getElementById('app-root').innerHTML = `
      <section class="mb-4">
        <h2 class="text-xl font-bold text-yellow-400 mb-2">Alertes</h2>
        <div class="space-y-1">
          ${alertes.length ? alertes.join('<br>') : '<span class="text-green-400">Aucune alerte critique</span>'}
        </div>
      </section>
      <section class="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded shadow">
          <div class="text-3xl font-bold text-yellow-400">${totalSoldats}</div>
          <div class="uppercase text-xs text-yellow-300">Soldats</div>
        </div>
        <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-blue-400 p-4 rounded shadow">
          <div class="text-3xl font-bold text-blue-300">${totalRecrues}</div>
          <div class="uppercase text-xs text-blue-200">Recrues</div>
        </div>
        <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded shadow">
          <div class="text-3xl font-bold text-yellow-400">${totalUnites}</div>
          <div class="uppercase text-xs text-yellow-300">Unités</div>
        </div>
        <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded shadow">
          <div class="text-3xl font-bold text-yellow-400">${totalMissions}</div>
          <div class="uppercase text-xs text-yellow-300">Missions</div>
        </div>
      </section>
      <section class="mb-4">
        <h2 class="text-xl font-bold text-yellow-400 mb-2">Raccourcis</h2>
        <div class="flex flex-wrap gap-2">
          ${shortcuts.map(s => `<a href="${s.hash}" class="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition uppercase">${s.label}</a>`).join('')}
        </div>
      </section>
      <section id="soldats">
        <div class="flex justify-end mb-2">
          <button id="add-soldat" class="btn bg-yellow-400 text-black">Ajouter un soldat</button>
        </div>
        ${soldats.map(soldat => `
          <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded shadow mb-4">
            <div class="text-3xl font-bold text-yellow-400">${soldat.nom}</div>
            <div class="uppercase text-xs text-yellow-300">${soldat.grade}</div>
            <button class="mt-2 px-2 py-1 bg-yellow-400 text-black rounded text-xs font-bold hover:bg-yellow-500 transition" data-soldat-id="${soldat.id}">Détails</button>
            <button class="mt-2 px-2 py-1 bg-gray-700 text-yellow-400 rounded text-xs font-bold hover:bg-yellow-800 transition" data-edit-soldat-id="${soldat.id}">Éditer</button>
            <button class="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-800 transition" data-del-soldat-id="${soldat.id}">Supprimer</button>
          </div>
        `).join('')}
      </section>
      <section id="unites">
        <div class="flex justify-end mb-2">
          <button id="add-unite" class="btn bg-yellow-400 text-black">Ajouter une unité</button>
        </div>
        ${unites.map(unite => `
          <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded shadow mb-4">
            <div class="text-3xl font-bold text-yellow-400">${unite.nom}</div>
            <div class="uppercase text-xs text-yellow-300">${unite.type}</div>
            <button class="mt-2 px-2 py-1 bg-yellow-400 text-black rounded text-xs font-bold hover:bg-yellow-500 transition" data-unite-id="${unite.id}">Détails</button>
            <button class="mt-2 px-2 py-1 bg-gray-700 text-yellow-400 rounded text-xs font-bold hover:bg-yellow-800 transition" data-edit-unite-id="${unite.id}">Éditer</button>
            <button class="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-800 transition" data-del-unite-id="${unite.id}">Supprimer</button>
          </div>
        `).join('')}
      </section>
      <section id="missions">
        <div class="flex justify-end mb-2">
          <button id="add-mission" class="btn bg-yellow-400 text-black">Ajouter une mission</button>
        </div>
        ${missions.map(mission => `
          <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded shadow mb-4">
            <div class="text-3xl font-bold text-yellow-400">${mission.nom}</div>
            <div class="uppercase text-xs text-yellow-300">${mission.type}</div>
            <button class="mt-2 px-2 py-1 bg-yellow-400 text-black rounded text-xs font-bold hover:bg-yellow-500 transition" data-mission-id="${mission.id}">Détails</button>
            <button class="mt-2 px-2 py-1 bg-gray-700 text-yellow-400 rounded text-xs font-bold hover:bg-yellow-800 transition" data-edit-mission-id="${mission.id}">Éditer</button>
            <button class="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-800 transition" data-del-mission-id="${mission.id}">Supprimer</button>
          </div>
        `).join('')}
      </section>
      <section id="formations">
        <div class="flex justify-end mb-2">
          <button id="add-formation" class="btn bg-yellow-400 text-black">Ajouter une formation</button>
        </div>
        ${formations.map(formation => `
          <div class="bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded shadow mb-4">
            <div class="text-3xl font-bold text-yellow-400">${formation.nom}</div>
            <div class="uppercase text-xs text-yellow-300">${formation.type}</div>
            <button class="mt-2 px-2 py-1 bg-yellow-400 text-black rounded text-xs font-bold hover:bg-yellow-500 transition" data-formation-id="${formation.id}">Détails</button>
            <button class="mt-2 px-2 py-1 bg-gray-700 text-yellow-400 rounded text-xs font-bold hover:bg-yellow-800 transition" data-edit-formation-id="${formation.id}">Éditer</button>
            <button class="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-800 transition" data-del-formation-id="${formation.id}">Supprimer</button>
          </div>
        `).join('')}
      </section>
    `;
    // Bouton Ajouter Soldat
    document.getElementById('add-soldat').onclick = () => {
      import('../components/forms/SoldatForm.js').then(({ SoldatForm }) => {
        import('../components/modals/GenericModal.js').then(({ GenericModal }) => {
          const html = GenericModal('Ajouter un soldat', SoldatForm());
          document.body.insertAdjacentHTML('beforeend', html);
          document.getElementById('close-modal').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('modal-bg').onclick = e => { if (e.target.id === 'modal-bg') document.getElementById('modal-bg').remove(); };
          document.getElementById('cancel-form').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('soldat-form').onsubmit = e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            // Transforme les champs multiples en array
            if(data.formations_suivies) data.formations_suivies = data.formations_suivies.split(',').map(s=>s.trim()).filter(Boolean);
            if(data.faits_d_armes) data.faits_d_armes = data.faits_d_armes.split(',').map(s=>s.trim()).filter(Boolean);
            if(data.recompenses) data.recompenses = data.recompenses.split(',').map(s=>s.trim()).filter(Boolean);
            data.missions_effectuees = parseInt(data.missions_effectuees)||0;
            addItem('soldats', data);
            document.getElementById('modal-bg').remove();
            showToast('Soldat ajouté !');
            displaySoldats();
          };
        });
      });
    };
    // Bouton Ajouter Unité
    document.getElementById('add-unite').onclick = () => {
      import('../components/forms/UniteForm.js').then(({ UniteForm }) => {
        import('../components/modals/GenericModal.js').then(({ GenericModal }) => {
          const html = GenericModal('Ajouter une unité', UniteForm());
          document.body.insertAdjacentHTML('beforeend', html);
          document.getElementById('close-modal').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('modal-bg').onclick = e => { if (e.target.id === 'modal-bg') document.getElementById('modal-bg').remove(); };
          document.getElementById('cancel-form').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('unite-form').onsubmit = e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            if(data.occupants) data.occupants = data.occupants.split(',').map(s=>s.trim()).filter(Boolean);
            addItem('unites', data);
            document.getElementById('modal-bg').remove();
            showToast('Unité ajoutée !');
            displayUnites();
          };
        });
      });
    };
    // Bouton Ajouter Mission
    document.getElementById('add-mission').onclick = () => {
      import('../components/forms/MissionForm.js').then(({ MissionForm }) => {
        import('../components/modals/GenericModal.js').then(({ GenericModal }) => {
          const html = GenericModal('Ajouter une mission', MissionForm());
          document.body.insertAdjacentHTML('beforeend', html);
          document.getElementById('close-modal').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('modal-bg').onclick = e => { if (e.target.id === 'modal-bg') document.getElementById('modal-bg').remove(); };
          document.getElementById('cancel-form').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('mission-form').onsubmit = e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            addItem('missions', data);
            document.getElementById('modal-bg').remove();
            showToast('Mission ajoutée !');
            displayMissions();
          };
        });
      });
    };
    // Bouton Ajouter Formation
    document.getElementById('add-formation').onclick = () => {
      import('../components/forms/FormationForm.js').then(({ FormationForm }) => {
        import('../components/modals/GenericModal.js').then(({ GenericModal }) => {
          const html = GenericModal('Ajouter une formation', FormationForm());
          document.body.insertAdjacentHTML('beforeend', html);
          document.getElementById('close-modal').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('modal-bg').onclick = e => { if (e.target.id === 'modal-bg') document.getElementById('modal-bg').remove(); };
          document.getElementById('cancel-form').onclick = () => document.getElementById('modal-bg').remove();
          document.getElementById('formation-form').onsubmit = e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            console.log('[AJOUT FORMATION]', data); // Prêt pour intégration backend
            document.getElementById('modal-bg').remove();
          };
        });
      });
    };
  } catch (err) {
    document.getElementById('app-root').innerHTML = `<div class='text-red-500'>Erreur lors du chargement du dashboard.</div>`;
    console.error('[Dashboard] Erreur:', err);
  }
}
