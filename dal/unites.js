const db = require('../db/db');

function all() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM unites', (err, rows) => {
      if (err) reject(err); else resolve(rows.map(parse));
    });
  });
}

function get(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM unites WHERE id = ?', [id], (err, row) => {
      if (err) reject(err); else resolve(row ? parse(row) : undefined);
    });
  });
}

function create(data) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO unites (id, nom, type, chef, membres, specialite, statut, missions, notes, createdAt, updatedAt)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  return new Promise((resolve, reject) => {
    stmt.run([
      data.id,
      data.nom,
      data.type,
      data.chef,
      JSON.stringify(data.membres || []),
      data.specialite,
      data.statut,
      JSON.stringify(data.missions || []),
      data.notes || '',
      now,
      now
    ], function (err) {
      if (err) reject(err); else get(data.id).then(resolve, reject);
    });
  });
}

function update(id, updates) {
  return get(id).then(current => {
    if (!current) return undefined;
    const now = new Date().toISOString();
    const data = {
      ...current,
      ...updates,
      membres: updates.membres ? updates.membres : current.membres,
      missions: updates.missions ? updates.missions : current.missions,
      updatedAt: now
    };
    const stmt = db.prepare(`UPDATE unites SET nom=?, type=?, chef=?, membres=?, specialite=?, statut=?, missions=?, notes=?, createdAt=?, updatedAt=? WHERE id=?`);
    return new Promise((resolve, reject) => {
      stmt.run([
        data.nom,
        data.type,
        data.chef,
        JSON.stringify(data.membres || []),
        data.specialite,
        data.statut,
        JSON.stringify(data.missions || []),
        data.notes,
        data.createdAt,
        data.updatedAt,
        id
      ], err => {
        if (err) reject(err); else resolve(parse(data));
      });
    });
  });
}

function remove(id) {
  const stmt = db.prepare('DELETE FROM unites WHERE id = ?');
  return new Promise((resolve, reject) => {
    stmt.run(id, function (err) {
      if (err) reject(err); else resolve(this.changes > 0);
    });
  });
}

function parse(row) {
  return { ...row, membres: JSON.parse(row.membres || '[]'), missions: JSON.parse(row.missions || '[]') };
}

module.exports = { all, get, create, update, remove };
