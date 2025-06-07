const db = require('../db/db');

function all() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM missions', (err, rows) => {
      if (err) reject(err); else resolve(rows.map(parse));
    });
  });
}

function get(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM missions WHERE id = ?', [id], (err, row) => {
      if (err) reject(err); else resolve(row ? parse(row) : undefined);
    });
  });
}

function create(data) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`INSERT INTO missions (id, nom, type, dateDebut, dateFin, statut, unite, participants, objectifs, notes, debriefed, createdAt, updatedAt)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const participants = JSON.stringify(data.participants || []);
  return new Promise((resolve, reject) => {
    stmt.run([
      data.id,
      data.nom,
      data.type,
      data.dateDebut,
      data.dateFin,
      data.statut,
      data.unite,
      participants,
      data.objectifs || '',
      data.notes || '',
      data.debriefed ? 1 : 0,
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
      participants: updates.participants ? updates.participants : current.participants,
      updatedAt: now
    };
    const stmt = db.prepare(`UPDATE missions SET nom=?, type=?, dateDebut=?, dateFin=?, statut=?, unite=?, participants=?, objectifs=?, notes=?, debriefed=?, createdAt=?, updatedAt=? WHERE id=?`);
    return new Promise((resolve, reject) => {
      stmt.run([
        data.nom,
        data.type,
        data.dateDebut,
        data.dateFin,
        data.statut,
        data.unite,
        JSON.stringify(data.participants || []),
        data.objectifs,
        data.notes,
        data.debriefed ? 1 : 0,
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
  const stmt = db.prepare('DELETE FROM missions WHERE id = ?');
  return new Promise((resolve, reject) => {
    stmt.run(id, function (err) {
      if (err) reject(err); else resolve(this.changes > 0);
    });
  });
}

function parse(row) {
  return { ...row, participants: row.participants ? JSON.parse(row.participants) : [] };
}

module.exports = { all, get, create, update, remove };
