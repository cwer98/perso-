import pool from './connection.js';

const exercises = [
  // CHEST
  { name: 'Développé couché barre', muscle_groups: ['chest','triceps','shoulders'], primary_muscle: 'chest', equipment: 'barbell' },
  { name: 'Développé couché haltères', muscle_groups: ['chest','triceps','shoulders'], primary_muscle: 'chest', equipment: 'dumbbell' },
  { name: 'Développé incliné barre', muscle_groups: ['chest','triceps','shoulders'], primary_muscle: 'chest', equipment: 'barbell' },
  { name: 'Développé incliné haltères', muscle_groups: ['chest','triceps','shoulders'], primary_muscle: 'chest', equipment: 'dumbbell' },
  { name: 'Développé décliné barre', muscle_groups: ['chest','triceps'], primary_muscle: 'chest', equipment: 'barbell' },
  { name: 'Écarté couché haltères', muscle_groups: ['chest'], primary_muscle: 'chest', equipment: 'dumbbell' },
  { name: 'Écarté poulie basse', muscle_groups: ['chest'], primary_muscle: 'chest', equipment: 'cable' },
  { name: 'Crossover câble', muscle_groups: ['chest'], primary_muscle: 'chest', equipment: 'cable' },
  { name: 'Pompes', muscle_groups: ['chest','triceps','shoulders'], primary_muscle: 'chest', equipment: 'bodyweight' },
  { name: 'Dips (pectoraux)', muscle_groups: ['chest','triceps'], primary_muscle: 'chest', equipment: 'bodyweight' },
  { name: 'Machine pec-deck', muscle_groups: ['chest'], primary_muscle: 'chest', equipment: 'machine' },
  { name: 'Développé machine', muscle_groups: ['chest','triceps'], primary_muscle: 'chest', equipment: 'machine' },

  // BACK
  { name: 'Tractions (Pull-ups)', muscle_groups: ['back','biceps'], primary_muscle: 'back', equipment: 'bodyweight' },
  { name: 'Tirage barre large', muscle_groups: ['back','biceps'], primary_muscle: 'back', equipment: 'cable' },
  { name: 'Tirage barre serré', muscle_groups: ['back','biceps'], primary_muscle: 'back', equipment: 'cable' },
  { name: 'Rowing barre', muscle_groups: ['back','biceps'], primary_muscle: 'back', equipment: 'barbell' },
  { name: 'Rowing haltère', muscle_groups: ['back','biceps'], primary_muscle: 'back', equipment: 'dumbbell' },
  { name: 'Rowing machine', muscle_groups: ['back','biceps'], primary_muscle: 'back', equipment: 'machine' },
  { name: 'Tirage horizontal câble', muscle_groups: ['back','biceps'], primary_muscle: 'back', equipment: 'cable' },
  { name: 'Soulevé de terre', muscle_groups: ['back','hamstrings','glutes'], primary_muscle: 'back', equipment: 'barbell' },
  { name: 'Pull-over haltère', muscle_groups: ['back','chest'], primary_muscle: 'back', equipment: 'dumbbell' },
  { name: 'Face pull', muscle_groups: ['back','shoulders'], primary_muscle: 'back', equipment: 'cable' },
  { name: 'Good morning', muscle_groups: ['back','hamstrings'], primary_muscle: 'back', equipment: 'barbell' },
  { name: 'Hyperextension', muscle_groups: ['back','glutes'], primary_muscle: 'back', equipment: 'machine' },

  // SHOULDERS
  { name: 'Développé militaire barre', muscle_groups: ['shoulders','triceps'], primary_muscle: 'shoulders', equipment: 'barbell' },
  { name: 'Développé haltères', muscle_groups: ['shoulders','triceps'], primary_muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Arnold press', muscle_groups: ['shoulders','triceps'], primary_muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Élévations latérales haltères', muscle_groups: ['shoulders'], primary_muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Élévations frontales haltères', muscle_groups: ['shoulders'], primary_muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Oiseau (rear delt)', muscle_groups: ['shoulders','back'], primary_muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Tirage menton', muscle_groups: ['shoulders','traps','biceps'], primary_muscle: 'shoulders', equipment: 'barbell' },
  { name: 'Développé militaire machine', muscle_groups: ['shoulders','triceps'], primary_muscle: 'shoulders', equipment: 'machine' },
  { name: 'Élévations latérales câble', muscle_groups: ['shoulders'], primary_muscle: 'shoulders', equipment: 'cable' },

  // BICEPS
  { name: 'Curl barre droite', muscle_groups: ['biceps','forearms'], primary_muscle: 'biceps', equipment: 'barbell' },
  { name: 'Curl barre EZ', muscle_groups: ['biceps','forearms'], primary_muscle: 'biceps', equipment: 'barbell' },
  { name: 'Curl haltères alterné', muscle_groups: ['biceps','forearms'], primary_muscle: 'biceps', equipment: 'dumbbell' },
  { name: 'Curl marteau', muscle_groups: ['biceps','forearms'], primary_muscle: 'biceps', equipment: 'dumbbell' },
  { name: 'Curl concentré', muscle_groups: ['biceps'], primary_muscle: 'biceps', equipment: 'dumbbell' },
  { name: 'Curl poulie basse', muscle_groups: ['biceps'], primary_muscle: 'biceps', equipment: 'cable' },
  { name: 'Curl incliné haltères', muscle_groups: ['biceps'], primary_muscle: 'biceps', equipment: 'dumbbell' },
  { name: 'Curl machine', muscle_groups: ['biceps'], primary_muscle: 'biceps', equipment: 'machine' },
  { name: 'Curl à la barre fixe', muscle_groups: ['biceps','back'], primary_muscle: 'biceps', equipment: 'bodyweight' },

  // TRICEPS
  { name: 'Dips (triceps)', muscle_groups: ['triceps','chest'], primary_muscle: 'triceps', equipment: 'bodyweight' },
  { name: 'Extension poulie haute', muscle_groups: ['triceps'], primary_muscle: 'triceps', equipment: 'cable' },
  { name: 'Extension poulie (corde)', muscle_groups: ['triceps'], primary_muscle: 'triceps', equipment: 'cable' },
  { name: 'Skull crusher barre EZ', muscle_groups: ['triceps'], primary_muscle: 'triceps', equipment: 'barbell' },
  { name: 'Skull crusher haltères', muscle_groups: ['triceps'], primary_muscle: 'triceps', equipment: 'dumbbell' },
  { name: 'Extension haltère derrière la tête', muscle_groups: ['triceps'], primary_muscle: 'triceps', equipment: 'dumbbell' },
  { name: 'Kickback haltère', muscle_groups: ['triceps'], primary_muscle: 'triceps', equipment: 'dumbbell' },
  { name: 'Développé prise serrée', muscle_groups: ['triceps','chest'], primary_muscle: 'triceps', equipment: 'barbell' },
  { name: 'Pompes prise serrée', muscle_groups: ['triceps','chest'], primary_muscle: 'triceps', equipment: 'bodyweight' },

  // FOREARMS
  { name: 'Curl poignets barre', muscle_groups: ['forearms'], primary_muscle: 'forearms', equipment: 'barbell' },
  { name: 'Extension poignets barre', muscle_groups: ['forearms'], primary_muscle: 'forearms', equipment: 'barbell' },
  { name: 'Reverse curl', muscle_groups: ['forearms','biceps'], primary_muscle: 'forearms', equipment: 'barbell' },
  { name: 'Farmer walk', muscle_groups: ['forearms','traps'], primary_muscle: 'forearms', equipment: 'dumbbell' },

  // ABS
  { name: 'Crunch', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'bodyweight' },
  { name: 'Crunch machine', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'machine' },
  { name: 'Planche', muscle_groups: ['abs','shoulders'], primary_muscle: 'abs', equipment: 'bodyweight' },
  { name: 'Gainage latéral', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'bodyweight' },
  { name: 'Relevé de jambes', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'bodyweight' },
  { name: 'Russian twist', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'bodyweight' },
  { name: 'Ab wheel', muscle_groups: ['abs','shoulders'], primary_muscle: 'abs', equipment: 'other' },
  { name: 'Torsion câble', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'cable' },
  { name: 'Crunch poulie haute', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'cable' },
  { name: 'Windshield wipers', muscle_groups: ['abs'], primary_muscle: 'abs', equipment: 'bodyweight' },

  // QUADS
  { name: 'Squat barre', muscle_groups: ['quads','glutes','hamstrings'], primary_muscle: 'quads', equipment: 'barbell' },
  { name: 'Squat goblet', muscle_groups: ['quads','glutes'], primary_muscle: 'quads', equipment: 'dumbbell' },
  { name: 'Squat hack machine', muscle_groups: ['quads','glutes'], primary_muscle: 'quads', equipment: 'machine' },
  { name: 'Leg press', muscle_groups: ['quads','glutes','hamstrings'], primary_muscle: 'quads', equipment: 'machine' },
  { name: 'Extension jambes machine', muscle_groups: ['quads'], primary_muscle: 'quads', equipment: 'machine' },
  { name: 'Fentes avant', muscle_groups: ['quads','glutes'], primary_muscle: 'quads', equipment: 'bodyweight' },
  { name: 'Fentes haltères', muscle_groups: ['quads','glutes'], primary_muscle: 'quads', equipment: 'dumbbell' },
  { name: 'Split squat bulgare', muscle_groups: ['quads','glutes'], primary_muscle: 'quads', equipment: 'dumbbell' },
  { name: 'Pistol squat', muscle_groups: ['quads','glutes'], primary_muscle: 'quads', equipment: 'bodyweight' },

  // HAMSTRINGS / GLUTES
  { name: 'Romanian Deadlift', muscle_groups: ['hamstrings','glutes','back'], primary_muscle: 'hamstrings', equipment: 'barbell' },
  { name: 'Romanian Deadlift haltères', muscle_groups: ['hamstrings','glutes'], primary_muscle: 'hamstrings', equipment: 'dumbbell' },
  { name: 'Leg curl allongé machine', muscle_groups: ['hamstrings'], primary_muscle: 'hamstrings', equipment: 'machine' },
  { name: 'Leg curl assis machine', muscle_groups: ['hamstrings'], primary_muscle: 'hamstrings', equipment: 'machine' },
  { name: 'Hip thrust barre', muscle_groups: ['glutes','hamstrings'], primary_muscle: 'glutes', equipment: 'barbell' },
  { name: 'Glute bridge', muscle_groups: ['glutes','hamstrings'], primary_muscle: 'glutes', equipment: 'bodyweight' },
  { name: 'Kickback câble', muscle_groups: ['glutes'], primary_muscle: 'glutes', equipment: 'cable' },
  { name: 'Abducteur machine', muscle_groups: ['glutes'], primary_muscle: 'glutes', equipment: 'machine' },
  { name: 'Adducteur machine', muscle_groups: ['glutes','hamstrings'], primary_muscle: 'glutes', equipment: 'machine' },

  // CALVES
  { name: 'Extension mollets debout', muscle_groups: ['calves'], primary_muscle: 'calves', equipment: 'machine' },
  { name: 'Extension mollets assis', muscle_groups: ['calves'], primary_muscle: 'calves', equipment: 'machine' },
  { name: 'Extension mollets barre', muscle_groups: ['calves'], primary_muscle: 'calves', equipment: 'barbell' },
  { name: 'Sauts à la corde', muscle_groups: ['calves'], primary_muscle: 'calves', equipment: 'other', category: 'cardio', has_duration: true },

  // TRAPS
  { name: 'Shrugs barre', muscle_groups: ['traps'], primary_muscle: 'traps', equipment: 'barbell' },
  { name: 'Shrugs haltères', muscle_groups: ['traps'], primary_muscle: 'traps', equipment: 'dumbbell' },

  // CARDIO
  { name: 'Rameur', muscle_groups: ['back','shoulders','legs'], primary_muscle: 'cardio', equipment: 'cardio', category: 'cardio', has_distance: true, has_duration: true },
  { name: 'Ski Erg', muscle_groups: ['shoulders','back','abs'], primary_muscle: 'cardio', equipment: 'cardio', category: 'cardio', has_distance: true, has_duration: true },
  { name: 'Vélo stationnaire', muscle_groups: ['quads','calves'], primary_muscle: 'cardio', equipment: 'cardio', category: 'cardio', has_distance: true, has_duration: true },
  { name: 'Tapis roulant', muscle_groups: ['quads','calves'], primary_muscle: 'cardio', equipment: 'cardio', category: 'cardio', has_distance: true, has_duration: true },
  { name: 'Vélo elliptique', muscle_groups: ['quads','glutes'], primary_muscle: 'cardio', equipment: 'cardio', category: 'cardio', has_distance: true, has_duration: true },
  { name: 'Burpees', muscle_groups: ['chest','quads','shoulders'], primary_muscle: 'cardio', equipment: 'bodyweight', category: 'cardio', has_duration: true },
  { name: 'Kettlebell swing', muscle_groups: ['glutes','hamstrings','back'], primary_muscle: 'glutes', equipment: 'kettlebell' },
  { name: 'Turkish Get Up', muscle_groups: ['shoulders','abs','glutes'], primary_muscle: 'shoulders', equipment: 'kettlebell' },
];

async function seed() {
  try {
    await pool.query('DELETE FROM exercises');
    for (const ex of exercises) {
      await pool.query(
        `INSERT INTO exercises (name, muscle_groups, primary_muscle, equipment, category, has_distance, has_duration)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [ex.name, ex.muscle_groups, ex.primary_muscle, ex.equipment, ex.category || 'strength', ex.has_distance || false, ex.has_duration || false]
      );
    }
    console.log(`✓ ${exercises.length} exercices insérés`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
