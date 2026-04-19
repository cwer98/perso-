import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../muscletrack.sqlite');
const WASM_PATH = path.join(__dirname, '../node_modules/sql.js/dist/sql-wasm.wasm');

// Chargement du moteur SQLite (WebAssembly, aucune compilation nécessaire)
const SQL = await initSqlJs({ locateFile: () => WASM_PATH });

let sqlDb;
if (existsSync(DB_PATH)) {
  sqlDb = new SQL.Database(readFileSync(DB_PATH));
} else {
  sqlDb = new SQL.Database();
}

sqlDb.run('PRAGMA foreign_keys = ON');

function save() {
  writeFileSync(DB_PATH, Buffer.from(sqlDb.export()));
}

// Wrapper API compatible avec better-sqlite3 (synchrone)
const db = {
  exec(sql) {
    sqlDb.exec(sql);
    save();
  },
  prepare(sql) {
    return {
      all(...params) {
        const stmt = sqlDb.prepare(sql);
        const rows = [];
        if (params.length) stmt.bind(params);
        while (stmt.step()) rows.push(stmt.getAsObject());
        stmt.free();
        return rows;
      },
      get(...params) {
        const stmt = sqlDb.prepare(sql);
        if (params.length) stmt.bind(params);
        const has = stmt.step();
        const row = has ? stmt.getAsObject() : null;
        stmt.free();
        return row;
      },
      run(...params) {
        sqlDb.run(sql, params.length ? params : undefined);
        const lastInsertRowid = sqlDb.exec('SELECT last_insert_rowid()')[0]?.values[0][0] ?? 0;
        const changes = sqlDb.getRowsModified();
        save();
        return { lastInsertRowid, changes };
      }
    };
  }
};

// Création automatique des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER,
    following_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (follower_id, following_id)
  );
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    muscle_groups TEXT NOT NULL,
    primary_muscle TEXT NOT NULL,
    equipment TEXT NOT NULL,
    category TEXT DEFAULT 'strength',
    has_distance INTEGER DEFAULT 0,
    has_duration INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL DEFAULT 'Séance',
    type TEXT DEFAULT 'custom',
    duration_minutes INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    is_public INTEGER DEFAULT 1,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS workout_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER,
    exercise_id INTEGER,
    order_index INTEGER NOT NULL DEFAULT 0,
    notes TEXT DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_exercise_id INTEGER,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight REAL,
    weight_unit TEXT DEFAULT 'kg',
    distance REAL,
    distance_unit TEXT DEFAULT 'm',
    duration_seconds INTEGER,
    completed INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS kudos (
    user_id INTEGER,
    workout_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, workout_id)
  );
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    workout_id INTEGER,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed des exercices si la table est vide
const count = db.prepare('SELECT COUNT(*) as n FROM exercises').get().n;
if (count === 0) {
  const exercises = [
    ['Développé couché barre','["chest","triceps","shoulders"]','chest','barbell','strength',0,0],
    ['Développé couché haltères','["chest","triceps","shoulders"]','chest','dumbbell','strength',0,0],
    ['Développé incliné barre','["chest","triceps","shoulders"]','chest','barbell','strength',0,0],
    ['Développé incliné haltères','["chest","triceps","shoulders"]','chest','dumbbell','strength',0,0],
    ['Développé décliné barre','["chest","triceps"]','chest','barbell','strength',0,0],
    ['Écarté couché haltères','["chest"]','chest','dumbbell','strength',0,0],
    ['Écarté poulie basse','["chest"]','chest','cable','strength',0,0],
    ['Crossover câble','["chest"]','chest','cable','strength',0,0],
    ['Pompes','["chest","triceps","shoulders"]','chest','bodyweight','strength',0,0],
    ['Dips (pectoraux)','["chest","triceps"]','chest','bodyweight','strength',0,0],
    ['Machine pec-deck','["chest"]','chest','machine','strength',0,0],
    ['Tractions (Pull-ups)','["back","biceps"]','back','bodyweight','strength',0,0],
    ['Tirage barre large','["back","biceps"]','back','cable','strength',0,0],
    ['Tirage barre serré','["back","biceps"]','back','cable','strength',0,0],
    ['Rowing barre','["back","biceps"]','back','barbell','strength',0,0],
    ['Rowing haltère','["back","biceps"]','back','dumbbell','strength',0,0],
    ['Rowing machine','["back","biceps"]','back','machine','strength',0,0],
    ['Tirage horizontal câble','["back","biceps"]','back','cable','strength',0,0],
    ['Soulevé de terre','["back","hamstrings","glutes"]','back','barbell','strength',0,0],
    ['Pull-over haltère','["back","chest"]','back','dumbbell','strength',0,0],
    ['Face pull','["back","shoulders"]','back','cable','strength',0,0],
    ['Good morning','["back","hamstrings"]','back','barbell','strength',0,0],
    ['Hyperextension','["back","glutes"]','back','machine','strength',0,0],
    ['Développé militaire barre','["shoulders","triceps"]','shoulders','barbell','strength',0,0],
    ['Développé haltères','["shoulders","triceps"]','shoulders','dumbbell','strength',0,0],
    ['Arnold press','["shoulders","triceps"]','shoulders','dumbbell','strength',0,0],
    ['Élévations latérales haltères','["shoulders"]','shoulders','dumbbell','strength',0,0],
    ['Élévations frontales haltères','["shoulders"]','shoulders','dumbbell','strength',0,0],
    ['Oiseau (rear delt)','["shoulders","back"]','shoulders','dumbbell','strength',0,0],
    ['Tirage menton','["shoulders","traps","biceps"]','shoulders','barbell','strength',0,0],
    ['Élévations latérales câble','["shoulders"]','shoulders','cable','strength',0,0],
    ['Développé militaire machine','["shoulders","triceps"]','shoulders','machine','strength',0,0],
    ['Curl barre droite','["biceps","forearms"]','biceps','barbell','strength',0,0],
    ['Curl barre EZ','["biceps","forearms"]','biceps','barbell','strength',0,0],
    ['Curl haltères alterné','["biceps","forearms"]','biceps','dumbbell','strength',0,0],
    ['Curl marteau','["biceps","forearms"]','biceps','dumbbell','strength',0,0],
    ['Curl concentré','["biceps"]','biceps','dumbbell','strength',0,0],
    ['Curl poulie basse','["biceps"]','biceps','cable','strength',0,0],
    ['Curl incliné haltères','["biceps"]','biceps','dumbbell','strength',0,0],
    ['Curl machine','["biceps"]','biceps','machine','strength',0,0],
    ['Dips (triceps)','["triceps","chest"]','triceps','bodyweight','strength',0,0],
    ['Extension poulie haute','["triceps"]','triceps','cable','strength',0,0],
    ['Extension poulie (corde)','["triceps"]','triceps','cable','strength',0,0],
    ['Skull crusher barre EZ','["triceps"]','triceps','barbell','strength',0,0],
    ['Skull crusher haltères','["triceps"]','triceps','dumbbell','strength',0,0],
    ['Extension haltère derrière la tête','["triceps"]','triceps','dumbbell','strength',0,0],
    ['Kickback haltère','["triceps"]','triceps','dumbbell','strength',0,0],
    ['Développé prise serrée','["triceps","chest"]','triceps','barbell','strength',0,0],
    ['Pompes prise serrée','["triceps","chest"]','triceps','bodyweight','strength',0,0],
    ['Curl poignets barre','["forearms"]','forearms','barbell','strength',0,0],
    ['Reverse curl','["forearms","biceps"]','forearms','barbell','strength',0,0],
    ['Farmer walk','["forearms","traps"]','forearms','dumbbell','strength',0,0],
    ['Crunch','["abs"]','abs','bodyweight','strength',0,0],
    ['Crunch machine','["abs"]','abs','machine','strength',0,0],
    ['Planche','["abs","shoulders"]','abs','bodyweight','strength',0,0],
    ['Gainage latéral','["abs"]','abs','bodyweight','strength',0,1],
    ['Relevé de jambes','["abs"]','abs','bodyweight','strength',0,0],
    ['Russian twist','["abs"]','abs','bodyweight','strength',0,0],
    ['Ab wheel','["abs","shoulders"]','abs','other','strength',0,0],
    ['Crunch poulie haute','["abs"]','abs','cable','strength',0,0],
    ['Squat barre','["quads","glutes","hamstrings"]','quads','barbell','strength',0,0],
    ['Squat goblet','["quads","glutes"]','quads','dumbbell','strength',0,0],
    ['Squat hack machine','["quads","glutes"]','quads','machine','strength',0,0],
    ['Leg press','["quads","glutes","hamstrings"]','quads','machine','strength',0,0],
    ['Extension jambes machine','["quads"]','quads','machine','strength',0,0],
    ['Fentes avant','["quads","glutes"]','quads','bodyweight','strength',0,0],
    ['Fentes haltères','["quads","glutes"]','quads','dumbbell','strength',0,0],
    ['Split squat bulgare','["quads","glutes"]','quads','dumbbell','strength',0,0],
    ['Romanian Deadlift','["hamstrings","glutes","back"]','hamstrings','barbell','strength',0,0],
    ['Romanian Deadlift haltères','["hamstrings","glutes"]','hamstrings','dumbbell','strength',0,0],
    ['Leg curl allongé machine','["hamstrings"]','hamstrings','machine','strength',0,0],
    ['Leg curl assis machine','["hamstrings"]','hamstrings','machine','strength',0,0],
    ['Hip thrust barre','["glutes","hamstrings"]','glutes','barbell','strength',0,0],
    ['Glute bridge','["glutes","hamstrings"]','glutes','bodyweight','strength',0,0],
    ['Kickback câble','["glutes"]','glutes','cable','strength',0,0],
    ['Abducteur machine','["glutes"]','glutes','machine','strength',0,0],
    ['Extension mollets debout','["calves"]','calves','machine','strength',0,0],
    ['Extension mollets assis','["calves"]','calves','machine','strength',0,0],
    ['Extension mollets barre','["calves"]','calves','barbell','strength',0,0],
    ['Shrugs barre','["traps"]','traps','barbell','strength',0,0],
    ['Shrugs haltères','["traps"]','traps','dumbbell','strength',0,0],
    ['Rameur','["back","shoulders","legs"]','cardio','cardio','cardio',1,1],
    ['Ski Erg','["shoulders","back","abs"]','cardio','cardio','cardio',1,1],
    ['Vélo stationnaire','["quads","calves"]','cardio','cardio','cardio',1,1],
    ['Tapis roulant','["quads","calves"]','cardio','cardio','cardio',1,1],
    ['Vélo elliptique','["quads","glutes"]','cardio','cardio','cardio',1,1],
    ['Burpees','["chest","quads","shoulders"]','cardio','bodyweight','cardio',0,1],
    ['Kettlebell swing','["glutes","hamstrings","back"]','glutes','kettlebell','strength',0,0],
    ['Sauts à la corde','["calves"]','calves','other','cardio',0,1],
  ];
  for (const e of exercises) {
    db.prepare('INSERT INTO exercises (name,muscle_groups,primary_muscle,equipment,category,has_distance,has_duration) VALUES (?,?,?,?,?,?,?)').run(...e);
  }
  console.log(`✓ ${exercises.length} exercices chargés`);
}

export default db;
