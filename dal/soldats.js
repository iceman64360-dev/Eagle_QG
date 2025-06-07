const db = require('../db/db');

function all() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM soldats', (err, rows) => {
      if (err) reject(err); else resolve(rows.map(parse));
    });
  });
}

function get(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM soldats WHERE id = ?', [id], (err, row) => {
      if (err) reject(err); else resolve(row ? parse(row) : undefined);
    });
  });
}

function create(data) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO soldats (id, nom, grade, unite, statut, missions, notes, createdAt, updatedAt)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  return new Promise((resolve, reject) => {
    stmt.run([
      data.id,
      data.nom,
      data.grade,
      data.unite,
      data.statut,
      data.missions || 0,
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
      updatedAt: now
    };
    const stmt = db.prepare(`UPDATE soldats SET nom=?, grade=?, unite=?, statut=?, missions=?, notes=?, createdAt=?, updatedAt=? WHERE id=?`);
    return new Promise((resolve, reject) => {
      stmt.run([
        data.nom,
        data.grade,
        data.unite,
        data.statut,
        data.missions,
        data.notes,
        data.createdAt,
        data.updatedAt,
        id
      ], err => {
        if (err) reject(err); else resolve(data);
      });
    });
  });
}

function remove(id) {
  const stmt = db.prepare('DELETE FROM soldats WHERE id = ?');
  return new Promise((resolve, reject) => {
    stmt.run(id, function (err) {
      if (err) reject(err); else resolve(this.changes > 0);
    });
  });
}

function parse(row) {
  return { ...row };
}

module.exports = { all, get, create, update, remove };
