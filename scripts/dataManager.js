// dataManager.js — gestion centralisée CRUD en mémoire (prêt backend)

const dataStore = {
  soldats: [],
  unites: [],
  missions: [],
  formations: []
};

export async function initData() {
  const files = [
    { type: 'soldats', path: '/data/test/soldats.json' },
    { type: 'unites', path: '/data/test/unites.json' },
    { type: 'missions', path: '/data/test/missions.json' },
    { type: 'formations', path: '/data/test/formations.json' }
  ];
  for (const f of files) {
    try {
      const res = await fetch(f.path);
      if (res.ok) {
        const list = await res.json();
        dataStore[f.type] = list;
      }
    } catch (e) { /* ignore */ }
  }
}

export function setData(type, list) {
  if (dataStore[type]) dataStore[type] = list;
}
export function getData(type) {
  return dataStore[type] || [];
}
export function addItem(type, item) {
  if (!item.id) item.id = 'id_' + Math.random().toString(36).slice(2, 10);
  dataStore[type].push(item);
  return item;
}
export function updateItem(type, item) {
  const idx = dataStore[type].findIndex(e => e.id === item.id);
  if (idx !== -1) dataStore[type][idx] = item;
}
export function deleteItem(type, id) {
  const idx = dataStore[type].findIndex(e => e.id === id);
  if (idx !== -1) dataStore[type].splice(idx, 1);
}
