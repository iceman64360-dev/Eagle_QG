const fs = require('fs');
const path = require('path');
const db = require('../db/db');

function run(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, err => err ? reject(err) : resolve());
  });
}

async function setup() {
  await run(`CREATE TABLE IF NOT EXISTS soldats (
    id TEXT PRIMARY KEY,
    nom TEXT, grade TEXT, unite TEXT, statut TEXT,
    missions INTEGER, notes TEXT,
    createdAt TEXT, updatedAt TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS missions (
    id TEXT PRIMARY KEY,
    nom TEXT, type TEXT, dateDebut TEXT, dateFin TEXT,
    statut TEXT, unite TEXT, participants TEXT,
    objectifs TEXT, notes TEXT, debriefed INTEGER,
    createdAt TEXT, updatedAt TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS formations (
    id TEXT PRIMARY KEY,
    nom TEXT, type TEXT, dateDebut TEXT, dateFin TEXT,
    statut TEXT, formateur TEXT, participants TEXT,
    objectifs TEXT, notes TEXT, confirmed INTEGER,
    createdAt TEXT, updatedAt TEXT
  )`);
  await run(`CREATE TABLE IF NOT EXISTS unites (
    id TEXT PRIMARY KEY,
    nom TEXT, type TEXT, chef TEXT, membres TEXT,
    specialite TEXT, statut TEXT, missions TEXT,
    notes TEXT, createdAt TEXT, updatedAt TEXT
  )`);
}

function loadJSON(file) {
  const p = path.join(__dirname, '..', 'data', 'api', file);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

async function seed() {
  await setup();

  const soldats = loadJSON('soldats.json');
  const insertSoldat = db.prepare('INSERT OR REPLACE INTO soldats VALUES (?,?,?,?,?,?,?,?,?)');
  for (const s of soldats) {
    insertSoldat.run(s.id, s.nom, s.grade, s.unite, s.statut, s.missions, s.notes, s.createdAt, s.updatedAt);
  }
  insertSoldat.finalize();

  const missions = loadJSON('missions.json');
  const insertMission = db.prepare('INSERT OR REPLACE INTO missions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const m of missions) {
    insertMission.run(m.id, m.nom, m.type, m.dateDebut, m.dateFin, m.statut, m.unite, JSON.stringify(m.participants||[]), m.objectifs, m.notes, m.debriefed?1:0, m.createdAt, m.updatedAt);
  }
  insertMission.finalize();

  const formations = loadJSON('formations.json');
  const insertFormation = db.prepare('INSERT OR REPLACE INTO formations VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  for (const f of formations) {
    insertFormation.run(f.id, f.nom, f.type, f.dateDebut, f.dateFin, f.statut, f.formateur, JSON.stringify(f.participants||[]), f.objectifs, f.notes, f.confirmed?1:0, f.createdAt, f.updatedAt);
  }
  insertFormation.finalize();

  const unites = loadJSON('unites.json');
  const insertUnite = db.prepare('INSERT OR REPLACE INTO unites VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  for (const u of unites) {
    insertUnite.run(u.id, u.nom, u.type, u.chef, JSON.stringify(u.membres||[]), u.specialite, u.statut, JSON.stringify(u.missions||[]), u.notes, u.createdAt, u.updatedAt);
  }
  insertUnite.finalize();

  console.log('Database seeded');
  db.close();
}

seed().catch(err => { console.error(err); db.close(); });
