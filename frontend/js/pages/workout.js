// ===== WORKOUT STATE =====
let ws = {
  id: null, startTime: null, timerInterval: null,
  exercises: [], pickerOpen: true,
  selectedMuscle: null, selectedEquipment: null, searchText: '',
  allExercises: [], bodyView: 'front',
};

// ===== EXERCISE ICONS =====
const ICONS = {
  benchPress: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="54" width="64" height="5" rx="2.5"/>
    <line x1="14" y1="59" x2="14" y2="70"/><line x1="66" y1="59" x2="66" y2="70"/>
    <circle cx="63" cy="40" r="7"/>
    <line x1="56" y1="43" x2="18" y2="54"/>
    <line x1="46" y1="47" x2="40" y2="22"/><line x1="55" y1="44" x2="40" y2="22"/>
    <line x1="16" y1="22" x2="64" y2="22" stroke-width="3.5"/>
    <rect x="10" y="17" width="6" height="10" rx="2"/><rect x="64" y="17" width="6" height="10" rx="2"/>
  </svg>`,

  inclinePress: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="10" y1="68" x2="70" y2="48" stroke-width="3"/>
    <circle cx="60" cy="36" r="7"/>
    <line x1="53" y1="39" x2="20" y2="55"/>
    <line x1="45" y1="42" x2="36" y2="20"/><line x1="53" y1="38" x2="36" y2="20"/>
    <line x1="14" y1="20" x2="58" y2="20" stroke-width="3.5"/>
    <rect x="8" y="15" width="6" height="10" rx="2"/><rect x="58" y="15" width="6" height="10" rx="2"/>
  </svg>`,

  fly: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="22" y="52" width="36" height="5" rx="2.5"/>
    <circle cx="40" cy="36" r="7"/>
    <line x1="40" y1="43" x2="40" y2="52"/>
    <line x1="36" y1="46" x2="12" y2="38"/><circle cx="10" cy="37" r="4"/>
    <line x1="44" y1="46" x2="68" y2="38"/><circle cx="70" cy="37" r="4"/>
  </svg>`,

  pushup: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="66" cy="24" r="7"/>
    <line x1="60" y1="28" x2="14" y2="50"/>
    <line x1="50" y1="35" x2="42" y2="50"/><line x1="28" y1="42" x2="28" y2="58"/>
    <line x1="14" y1="58" x2="66" y2="58"/>
  </svg>`,

  dips: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="10" y1="28" x2="10" y2="72"/><line x1="70" y1="28" x2="70" y2="72"/>
    <line x1="4" y1="28" x2="76" y2="28"/>
    <circle cx="40" cy="18" r="7"/>
    <line x1="40" y1="25" x2="40" y2="48"/>
    <line x1="40" y1="30" x2="14" y2="28"/><line x1="40" y1="30" x2="66" y2="28"/>
    <line x1="40" y1="48" x2="32" y2="62"/><line x1="40" y1="48" x2="48" y2="62"/>
  </svg>`,

  pullup: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" y1="14" x2="74" y2="14" stroke-width="3.5"/>
    <circle cx="40" cy="30" r="7"/>
    <line x1="40" y1="37" x2="40" y2="55"/>
    <line x1="34" y1="22" x2="26" y2="14"/><line x1="46" y1="22" x2="54" y2="14"/>
    <line x1="40" y1="55" x2="30" y2="70"/><line x1="40" y1="55" x2="50" y2="70"/>
  </svg>`,

  pulldown: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" y1="8" x2="74" y2="8" stroke-width="3"/>
    <line x1="18" y1="8" x2="28" y2="28"/><line x1="62" y1="8" x2="52" y2="28"/>
    <line x1="28" y1="28" x2="52" y2="28"/>
    <circle cx="40" cy="38" r="7"/>
    <line x1="40" y1="45" x2="40" y2="60"/>
    <line x1="30" y1="48" x2="28" y2="32"/><line x1="50" y1="48" x2="52" y2="32"/>
    <line x1="40" y1="60" x2="32" y2="74"/><line x1="40" y1="60" x2="48" y2="74"/>
  </svg>`,

  row: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="58" cy="22" r="7"/>
    <line x1="52" y1="26" x2="30" y2="38"/>
    <line x1="30" y1="38" x2="28" y2="56"/>
    <line x1="44" y1="30" x2="14" y2="30"/><line x1="14" y1="30" x2="8" y2="36"/>
    <line x1="38" y1="32" x2="34" y2="22"/>
    <line x1="28" y1="56" x2="18" y2="70"/><line x1="28" y1="56" x2="38" y2="70"/>
    <line x1="8" y1="26" x2="8" y2="58"/>
  </svg>`,

  deadlift: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="16" r="7"/>
    <line x1="40" y1="23" x2="38" y2="44"/>
    <line x1="24" y1="44" x2="56" y2="44"/>
    <line x1="24" y1="44" x2="18" y2="68"/><line x1="56" y1="44" x2="62" y2="68"/>
    <line x1="32" y1="30" x2="16" y2="56"/><line x1="44" y1="28" x2="58" y2="56"/>
    <line x1="6" y1="68" x2="74" y2="68" stroke-width="3"/>
    <ellipse cx="10" cy="65" rx="4" ry="7"/><ellipse cx="70" cy="65" rx="4" ry="7"/>
  </svg>`,

  overheadPress: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="28" r="7"/>
    <line x1="40" y1="35" x2="40" y2="54"/>
    <line x1="40" y1="54" x2="28" y2="70"/><line x1="40" y1="54" x2="52" y2="70"/>
    <line x1="30" y1="42" x2="24" y2="16"/><line x1="50" y1="42" x2="56" y2="16"/>
    <line x1="12" y1="16" x2="68" y2="16" stroke-width="3.5"/>
    <rect x="6" y="11" width="6" height="10" rx="2"/><rect x="68" y="11" width="6" height="10" rx="2"/>
  </svg>`,

  lateralRaise: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="20" r="7"/>
    <line x1="40" y1="27" x2="40" y2="52"/>
    <line x1="40" y1="52" x2="28" y2="70"/><line x1="40" y1="52" x2="52" y2="70"/>
    <line x1="34" y1="36" x2="10" y2="44"/><circle cx="7" cy="45" r="4"/>
    <line x1="46" y1="36" x2="70" y2="44"/><circle cx="73" cy="45" r="4"/>
  </svg>`,

  curl: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="18" r="7"/>
    <line x1="40" y1="25" x2="40" y2="42"/>
    <line x1="40" y1="42" x2="28" y2="70"/><line x1="40" y1="42" x2="52" y2="70"/>
    <path d="M34 38 Q22 40 20 52 Q18 62 28 64"/>
    <rect x="24" y="62" width="16" height="6" rx="3" fill="currentColor" opacity="0.3"/>
    <rect x="20" y="63" width="6" height="4" rx="2"/><rect x="34" y="63" width="6" height="4" rx="2"/>
  </svg>`,

  tricepExt: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="18" r="7"/>
    <line x1="40" y1="25" x2="40" y2="44"/>
    <line x1="40" y1="44" x2="28" y2="60"/><line x1="40" y1="44" x2="52" y2="60"/>
    <line x1="34" y1="32" x2="34" y2="14"/><line x1="34" y1="14" x2="34" y2="50"/>
    <path d="M34 14 Q46 14 46 28 Q46 42 34 50"/>
    <ellipse cx="34" cy="12" rx="5" ry="3" fill="currentColor" opacity="0.4"/>
  </svg>`,

  squat: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="18" r="7"/>
    <line x1="28" y1="26" x2="52" y2="26"/>
    <line x1="14" y1="22" x2="66" y2="22" stroke-width="3.5"/>
    <rect x="8" y="17" width="6" height="10" rx="2"/><rect x="66" y="17" width="6" height="10" rx="2"/>
    <line x1="40" y1="25" x2="40" y2="44"/>
    <line x1="40" y1="44" x2="22" y2="60"/><line x1="40" y1="44" x2="58" y2="60"/>
    <line x1="22" y1="60" x2="16" y2="74"/><line x1="58" y1="60" x2="64" y2="74"/>
  </svg>`,

  legPress: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="46" y="8" width="28" height="36" rx="4"/>
    <line x1="46" y1="14" x2="46" y2="38"/>
    <circle cx="28" cy="44" r="7"/>
    <line x1="22" y1="46" x2="10" y2="58"/>
    <line x1="22" y1="40" x2="12" y2="30"/>
    <line x1="34" y1="40" x2="46" y2="26"/><line x1="30" y1="48" x2="46" y2="38"/>
    <line x1="10" y1="58" x2="10" y2="72"/>
  </svg>`,

  lunge: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="14" r="7"/>
    <line x1="40" y1="21" x2="40" y2="40"/>
    <line x1="40" y1="40" x2="20" y2="58"/><line x1="40" y1="40" x2="58" y2="52"/>
    <line x1="20" y1="58" x2="16" y2="74"/>
    <line x1="58" y1="52" x2="62" y2="68"/><line x1="62" y1="68" x2="72" y2="68"/>
    <line x1="16" y1="74" x2="30" y2="74"/>
  </svg>`,

  hipThrust: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="40" width="22" height="8" rx="3"/>
    <circle cx="28" cy="34" r="7"/>
    <line x1="28" y1="41" x2="28" y2="44"/>
    <line x1="28" y1="44" x2="50" y2="36"/>
    <line x1="50" y1="36" x2="60" y2="52"/>
    <line x1="60" y1="52" x2="72" y2="52"/>
    <line x1="34" y1="44" x2="46" y2="56"/><line x1="46" y1="56" x2="56" y2="44"/>
    <line x1="38" y1="36" x2="54" y2="36" stroke-width="3.5"/>
    <ellipse cx="35" cy="36" rx="4" ry="6"/><ellipse cx="57" cy="36" rx="4" ry="6"/>
  </svg>`,

  crunch: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="28" r="7"/>
    <path d="M30 32 Q40 30 44 38 Q48 46 40 50"/>
    <line x1="40" y1="50" x2="30" y2="66"/><line x1="40" y1="50" x2="52" y2="60"/>
    <line x1="30" y1="66" x2="24" y2="74"/><line x1="52" y1="60" x2="58" y2="74"/>
    <line x1="18" y1="74" x2="70" y2="74"/>
    <line x1="18" y1="38" x2="28" y2="33"/>
  </svg>`,

  plank: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="64" cy="30" r="7"/>
    <line x1="57" y1="34" x2="14" y2="46"/>
    <line x1="50" y1="36" x2="46" y2="50"/><line x1="20" y1="43" x2="20" y2="56"/>
    <line x1="14" y1="50" x2="66" y2="50"/>
    <line x1="20" y1="56" x2="14" y2="64"/><line x1="46" y1="56" x2="44" y2="64"/>
    <line x1="8" y1="64" x2="52" y2="64"/>
  </svg>`,

  calfRaise: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="14" r="7"/>
    <line x1="40" y1="21" x2="40" y2="42"/>
    <line x1="40" y1="42" x2="28" y2="56"/><line x1="40" y1="42" x2="52" y2="56"/>
    <line x1="28" y1="56" x2="24" y2="70"/><line x1="52" y1="56" x2="56" y2="70"/>
    <line x1="18" y1="78" x2="30" y2="70"/><line x1="50" y1="78" x2="62" y2="70"/>
    <line x1="14" y1="78" x2="34" y2="78"/><line x1="46" y1="78" x2="66" y2="78"/>
  </svg>`,

  cardioRun: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="52" cy="14" r="7"/>
    <line x1="48" y1="20" x2="38" y2="40"/>
    <line x1="38" y1="40" x2="18" y2="30"/><line x1="38" y1="40" x2="56" y2="30"/>
    <line x1="38" y1="40" x2="28" y2="58"/><line x1="38" y1="40" x2="54" y2="56"/>
    <line x1="28" y1="58" x2="16" y2="72"/><line x1="54" y1="56" x2="66" y2="68"/>
  </svg>`,

  cardioRow: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" y1="62" x2="74" y2="62" stroke-width="3"/>
    <circle cx="56" cy="28" r="7"/>
    <line x1="50" y1="32" x2="28" y2="40"/>
    <line x1="28" y1="40" x2="24" y2="62"/>
    <line x1="32" y1="36" x2="10" y2="42"/><line x1="10" y1="42" x2="8" y2="38"/>
    <line x1="38" y1="42" x2="44" y2="62"/>
    <line x1="28" y1="62" x2="22" y2="72"/><line x1="40" y1="62" x2="40" y2="72"/>
    <ellipse cx="60" cy="62" rx="10" ry="6" fill="none"/>
  </svg>`,

  cardioBike: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="18" cy="58" r="14"/><circle cx="62" cy="58" r="14"/>
    <line x1="18" y1="58" x2="40" y2="36"/><line x1="40" y1="36" x2="62" y2="58"/>
    <line x1="40" y1="36" x2="42" y2="22"/><line x1="36" y1="22" x2="48" y2="22"/>
    <circle cx="48" cy="16" r="6"/>
    <line x1="44" y1="20" x2="38" y2="36"/>
    <line x1="30" y1="28" x2="48" y2="28"/>
  </svg>`,

  skiErg: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="40" y1="4" x2="40" y2="18" stroke-width="3"/>
    <circle cx="40" cy="24" r="7"/>
    <line x1="40" y1="31" x2="40" y2="52"/>
    <line x1="40" y1="36" x2="14" y2="48"/><line x1="40" y1="36" x2="66" y2="48"/>
    <line x1="14" y1="48" x2="10" y2="68"/><line x1="66" y1="48" x2="70" y2="68"/>
    <line x1="40" y1="52" x2="30" y2="70"/><line x1="40" y1="52" x2="50" y2="70"/>
  </svg>`,

  shrug: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="16" r="7"/>
    <line x1="40" y1="23" x2="40" y2="48"/>
    <line x1="40" y1="48" x2="28" y2="66"/><line x1="40" y1="48" x2="52" y2="66"/>
    <line x1="28" y1="30" x2="8" y2="28"/><line x1="52" y1="30" x2="72" y2="28"/>
    <circle cx="6" cy="28" r="4"/><circle cx="74" cy="28" r="4"/>
    <path d="M30 27 Q30 18 40 18 Q50 18 50 27"/>
  </svg>`,

  generic: `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="16" r="7"/>
    <line x1="40" y1="23" x2="40" y2="48"/>
    <line x1="40" y1="48" x2="26" y2="66"/><line x1="40" y1="48" x2="54" y2="66"/>
    <line x1="28" y1="32" x2="12" y2="40"/><line x1="52" y1="32" x2="68" y2="40"/>
  </svg>`,
};

function getIcon(ex) {
  const n = ex.name.toLowerCase();
  const pm = ex.primary_muscle;
  if (n.includes('développé couché') || n.includes('bench')) return ICONS.benchPress;
  if (n.includes('incliné') || n.includes('décliné')) return ICONS.inclinePress;
  if (n.includes('écarté') || n.includes('crossover') || n.includes('pec-deck') || n.includes('fly')) return ICONS.fly;
  if (n.includes('pompe')) return ICONS.pushup;
  if (n.includes('dips')) return ICONS.dips;
  if (n.includes('traction') || n.includes('pull-up')) return ICONS.pullup;
  if (n.includes('tirage barre') || n.includes('tirage poulie') || n.includes('tirage poitrine') || n.includes('pull-over')) return ICONS.pulldown;
  if (n.includes('rowing') || n.includes('tirage horizontal') || n.includes('face pull') || n.includes('oiseau')) return ICONS.row;
  if (n.includes('soulevé') || n.includes('deadlift') || n.includes('hyperextension') || n.includes('good morning')) return ICONS.deadlift;
  if (n.includes('militaire') || n.includes('arnold') || n.includes('développé halt') || n.includes('développé machine')) return ICONS.overheadPress;
  if (n.includes('élévation') || n.includes('tirage menton')) return ICONS.lateralRaise;
  if (n.includes('curl') && !n.includes('leg curl')) return ICONS.curl;
  if (n.includes('extension') && (pm === 'triceps' || n.includes('skull'))) return ICONS.tricepExt;
  if (n.includes('kickback') || n.includes('dips tric')) return ICONS.tricepExt;
  if (n.includes('squat') || n.includes('goblet')) return ICONS.squat;
  if (n.includes('leg press')) return ICONS.legPress;
  if (n.includes('extension jambes') || n.includes('leg curl') || n.includes('abducteur') || n.includes('adducteur')) return ICONS.legPress;
  if (n.includes('fente') || n.includes('lunge') || n.includes('bulgare') || n.includes('pistol')) return ICONS.lunge;
  if (n.includes('hip thrust') || n.includes('glute bridge') || n.includes('kickback câble')) return ICONS.hipThrust;
  if (n.includes('crunch') || n.includes('relevé') || n.includes('russian') || n.includes('ab wheel') || n.includes('torsion')) return ICONS.crunch;
  if (n.includes('planche') || n.includes('gainage')) return ICONS.plank;
  if (n.includes('mollets') || n.includes('calves')) return ICONS.calfRaise;
  if (n.includes('shrug')) return ICONS.shrug;
  if (n.includes('farmer')) return ICONS.generic;
  if (n.includes('rameur')) return ICONS.cardioRow;
  if (n.includes('ski erg')) return ICONS.skiErg;
  if (n.includes('vélo') || n.includes('elliptique')) return ICONS.cardioBike;
  if (n.includes('tapis') || n.includes('burpee') || n.includes('corde')) return ICONS.cardioRun;
  if (pm === 'cardio') return ICONS.cardioRun;
  return ICONS.generic;
}

// ===== MUSCLE / EQUIPMENT LABELS =====
const MUSCLE_LABELS = {
  chest: 'Pectoraux', back: 'Dos', shoulders: 'Épaules',
  biceps: 'Biceps', triceps: 'Triceps', forearms: 'Avant-bras',
  abs: 'Abdos', quads: 'Quadriceps', hamstrings: 'Ischio',
  glutes: 'Fessiers', calves: 'Mollets', traps: 'Trapèzes', cardio: 'Cardio',
};
const EQUIPMENT_LABELS = {
  barbell: 'Barre', dumbbell: 'Haltères', machine: 'Machine',
  cable: 'Poulie', bodyweight: 'Poids du corps', kettlebell: 'Kettlebell',
  cardio: 'Cardio', other: 'Autre',
};

// ===== BODY MAP SVG =====
function bodyMapSvg(view) {
  const am = ws.selectedMuscle;
  function c(m) { return `body-part${am === m ? ' active' : ''}`; }

  if (view === 'front') return `<svg viewBox="0 0 100 242" width="90" height="217" style="display:block;margin:0 auto">
    <ellipse cx="50" cy="14" rx="11" ry="12" class="body-outline"/>
    <rect x="44" y="26" width="12" height="8" rx="3" class="body-outline"/>
    <ellipse cx="27" cy="44" rx="13" ry="9" class="${c('shoulders')}" data-muscle="shoulders"/>
    <ellipse cx="73" cy="44" rx="13" ry="9" class="${c('shoulders')}" data-muscle="shoulders"/>
    <path d="M34,34 L50,34 L50,62 Q38,65 30,57 Q27,49 34,34Z" class="${c('chest')}" data-muscle="chest"/>
    <path d="M66,34 L50,34 L50,62 Q62,65 70,57 Q73,49 66,34Z" class="${c('chest')}" data-muscle="chest"/>
    <rect x="13" y="52" width="12" height="23" rx="5" class="${c('biceps')}" data-muscle="biceps"/>
    <rect x="75" y="52" width="12" height="23" rx="5" class="${c('biceps')}" data-muscle="biceps"/>
    <rect x="11" y="76" width="11" height="22" rx="4" class="${c('forearms')}" data-muscle="forearms"/>
    <rect x="78" y="76" width="11" height="22" rx="4" class="${c('forearms')}" data-muscle="forearms"/>
    <rect x="34" y="62" width="32" height="32" rx="4" class="${c('abs')}" data-muscle="abs"/>
    <rect x="33" y="96" width="14" height="38" rx="5" class="${c('quads')}" data-muscle="quads"/>
    <rect x="53" y="96" width="14" height="38" rx="5" class="${c('quads')}" data-muscle="quads"/>
    <rect x="34" y="138" width="12" height="30" rx="5" class="${c('calves')}" data-muscle="calves"/>
    <rect x="54" y="138" width="12" height="30" rx="5" class="${c('calves')}" data-muscle="calves"/>
  </svg>`;

  return `<svg viewBox="0 0 100 242" width="90" height="217" style="display:block;margin:0 auto">
    <ellipse cx="50" cy="14" rx="11" ry="12" class="body-outline"/>
    <rect x="44" y="26" width="12" height="8" rx="3" class="body-outline"/>
    <path d="M37,26 Q50,20 63,26 L58,44 L50,40 L42,44Z" class="${c('traps')}" data-muscle="traps"/>
    <ellipse cx="27" cy="44" rx="13" ry="9" class="${c('shoulders')}" data-muscle="shoulders"/>
    <ellipse cx="73" cy="44" rx="13" ry="9" class="${c('shoulders')}" data-muscle="shoulders"/>
    <rect x="36" y="44" width="28" height="20" rx="3" class="${c('back')}" data-muscle="back"/>
    <rect x="36" y="64" width="28" height="18" rx="3" class="${c('back')}" data-muscle="back"/>
    <rect x="13" y="52" width="12" height="23" rx="5" class="${c('triceps')}" data-muscle="triceps"/>
    <rect x="75" y="52" width="12" height="23" rx="5" class="${c('triceps')}" data-muscle="triceps"/>
    <rect x="11" y="76" width="11" height="22" rx="4" class="${c('forearms')}" data-muscle="forearms"/>
    <rect x="78" y="76" width="11" height="22" rx="4" class="${c('forearms')}" data-muscle="forearms"/>
    <path d="M36,82 L50,82 L50,106 Q36,106 36,90Z" class="${c('glutes')}" data-muscle="glutes"/>
    <path d="M64,82 L50,82 L50,106 Q64,106 64,90Z" class="${c('glutes')}" data-muscle="glutes"/>
    <rect x="33" y="108" width="14" height="36" rx="5" class="${c('hamstrings')}" data-muscle="hamstrings"/>
    <rect x="53" y="108" width="14" height="36" rx="5" class="${c('hamstrings')}" data-muscle="hamstrings"/>
    <rect x="34" y="148" width="12" height="28" rx="5" class="${c('calves')}" data-muscle="calves"/>
    <rect x="54" y="148" width="12" height="28" rx="5" class="${c('calves')}" data-muscle="calves"/>
  </svg>`;
}

function refreshMuscleLabel() {
  const lbl = document.getElementById('muscle-label');
  if (!lbl) return;
  lbl.innerHTML = ws.selectedMuscle
    ? `<span style="color:var(--accent);font-weight:600">${MUSCLE_LABELS[ws.selectedMuscle]}</span> <button id="clear-muscle" style="color:var(--text-secondary);font-size:0.7rem;margin-left:2px">✕</button>`
    : '<span style="color:var(--text-muted)">Cliquer sur un muscle</span>';
}

// ===== RENDER WORKOUT PAGE =====
function renderWorkout() {
  const el = document.getElementById('main-content');
  if (ws.id) { renderActiveWorkout(); return; }
  el.innerHTML = `
    <div class="workout-idle">
      <svg viewBox="0 0 24 24" style="width:64px;height:64px;color:var(--accent)"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>
      <h2>Prêt à vous entraîner ?</h2>
      <p>Démarrez une séance et suivez vos exercices en temps réel.</p>
      <button class="start-btn" id="start-workout-btn">Démarrer une séance</button>
    </div>`;
  document.getElementById('start-workout-btn').addEventListener('click', startWorkout);
}

async function startWorkout() {
  try {
    const data = await api.workouts.create({ title: 'Séance', started_at: new Date().toISOString() });
    ws.id = data.id;
    ws.startTime = Date.now();
    ws.exercises = [];
    ws.allExercises = await api.exercises.list();
    renderActiveWorkout();
    startTimer();
  } catch (err) { toast(err.message); }
}

function startTimer() {
  if (ws.timerInterval) clearInterval(ws.timerInterval);
  ws.timerInterval = setInterval(() => {
    const el = document.getElementById('workout-timer');
    if (el) el.textContent = formatElapsed();
  }, 1000);
}

function formatElapsed() {
  const secs = Math.floor((Date.now() - ws.startTime) / 1000);
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function renderActiveWorkout() {
  const el = document.getElementById('main-content');
  el.innerHTML = `
    <div class="workout-active">
      <div class="workout-topbar">
        <div class="workout-timer" id="workout-timer">${formatElapsed()}</div>
        <input class="workout-title-input" id="workout-title" value="Séance" />
        <button class="btn-danger" id="finish-btn" style="padding:0.5rem 1rem;font-size:0.85rem">Terminer</button>
      </div>

      <div class="workout-body">
        <!-- EXERCISE PICKER -->
        <div class="exercise-picker">
          <div class="picker-header" id="picker-header">
            <h3>+ Ajouter un exercice</h3>
            <div class="picker-toggle ${ws.pickerOpen ? 'open' : ''}" id="picker-chevron">
              <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
            </div>
          </div>

          <div class="picker-content" id="picker-content" style="${ws.pickerOpen ? '' : 'display:none'}">
            <div class="body-picker-wrap">
              <!-- LEFT: Body map for muscle selection -->
              <div class="body-map-container">
                <div class="body-view-toggle">
                  <button class="body-view-btn ${ws.bodyView==='front'?'active':''}" data-view="front">Avant</button>
                  <button class="body-view-btn ${ws.bodyView==='back'?'active':''}" data-view="back">Arrière</button>
                </div>
                <div class="body-svg-wrap" id="body-svg-wrap">${bodyMapSvg(ws.bodyView)}</div>
                <div id="muscle-label" style="min-height:1.2rem;text-align:center;font-size:0.72rem;margin-top:0.15rem">
                  ${ws.selectedMuscle
                    ? `<span style="color:var(--accent);font-weight:600">${MUSCLE_LABELS[ws.selectedMuscle]}</span> <button id="clear-muscle" style="color:var(--text-secondary);font-size:0.7rem;margin-left:2px">✕</button>`
                    : '<span style="color:var(--text-muted)">Cliquer sur un muscle</span>'}
                </div>
              </div>

              <!-- RIGHT: Search + equipment filter + exercise icon grid -->
              <div class="exercise-picker-right">
                <input type="text" id="exercise-search" placeholder="🔍 Rechercher..." value="${ws.searchText}" style="font-size:0.82rem;padding:0.4rem 0.65rem" />
                <div class="filter-pills-row" id="equipment-filters">
                  <button class="eq-pill ${!ws.selectedEquipment?'active':''}" data-eq="">Tout</button>
                  ${Object.entries(EQUIPMENT_LABELS).map(([k,v])=>`<button class="eq-pill ${ws.selectedEquipment===k?'active':''}" data-eq="${k}">${v}</button>`).join('')}
                </div>
                <div class="exercise-grid" id="exercise-grid">
                  ${filteredExercisesGrid()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- WORKOUT EXERCISES -->
        <div class="workout-exercises-list" id="workout-exercises-list">
          ${ws.exercises.map((ex, i) => exerciseItemHtml(ex, i)).join('')}
          ${ws.exercises.length === 0 ? '<div class="empty-state" style="padding:2rem"><p>Ajoutez un exercice ci-dessus</p></div>' : ''}
        </div>
      </div>

      <div class="workout-bottom">
        <button class="btn-secondary btn-full" id="cancel-workout-btn">Annuler la séance</button>
      </div>
    </div>`;

  bindWorkoutEvents();
  if (ws.timerInterval) startTimer();
}

function filteredExercisesGrid() {
  let list = ws.allExercises;
  if (ws.selectedMuscle) list = list.filter(e => {
    const mg = Array.isArray(e.muscle_groups) ? e.muscle_groups : JSON.parse(e.muscle_groups || '[]');
    return mg.includes(ws.selectedMuscle) || e.primary_muscle === ws.selectedMuscle;
  });
  if (ws.selectedEquipment) list = list.filter(e => e.equipment === ws.selectedEquipment);
  if (ws.searchText) list = list.filter(e => e.name.toLowerCase().includes(ws.searchText.toLowerCase()));
  if (!list.length) return '<p class="text-secondary text-sm" style="padding:1rem;grid-column:1/-1">Aucun exercice trouvé</p>';
  return list.slice(0, 30).map(e => `
    <div class="exercise-card" data-ex-id="${e.id}">
      <div class="exercise-card-icon">${getIcon(e)}</div>
      <div class="exercise-card-name">${e.name}</div>
      <div class="exercise-card-badge">${EQUIPMENT_LABELS[e.equipment] || e.equipment}</div>
    </div>`).join('');
}

function exerciseItemHtml(ex, idx) {
  const hasDist = ex.has_distance;
  const hasDur = ex.has_duration;
  const cols = hasDist || hasDur ? 'grid-template-columns:32px 1fr 1fr 1fr auto' : 'grid-template-columns:32px 1fr 1fr auto';
  return `
    <div class="workout-exercise-item" data-we-id="${ex.weId}">
      <div class="we-header">
        <div class="we-icon-name">
          <div style="width:32px;height:32px;color:var(--accent);flex-shrink:0">${getIcon(ex)}</div>
          <div>
            <div class="we-name">${ex.name}</div>
            <div class="we-muscle">${EQUIPMENT_LABELS[ex.equipment] || ex.equipment}</div>
          </div>
        </div>
        <button class="btn-ghost remove-exercise-btn" data-we-id="${ex.weId}" style="color:var(--red);font-size:0.8rem">Retirer</button>
      </div>
      <div class="sets-table">
        <div class="sets-header" style="${cols}">
          <span>#</span>
          <span>${hasDist ? 'Distance' : 'Poids (kg)'}</span>
          <span>${hasDur ? 'Durée (s)' : 'Répétitions'}</span>
          ${hasDist || hasDur ? '<span></span>' : ''}
          <span></span>
        </div>
        <div class="sets-list" id="sets-list-${ex.weId}">
          ${ex.sets.map((s, si) => setRowHtml(s, si, ex, cols)).join('')}
        </div>
        <div class="add-set-row">
          <button class="add-set-btn" data-we-id="${ex.weId}" data-ex-idx="${idx}">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Ajouter une série
          </button>
        </div>
      </div>
    </div>`;
}

function setRowHtml(s, si, ex, cols) {
  const hasDist = ex.has_distance, hasDur = ex.has_duration;
  return `
    <div class="set-row" style="${cols}" data-set-id="${s.id}">
      <span class="set-num">${si + 1}</span>
      <input type="number" step="0.5" min="0" placeholder="${hasDist ? 'm' : 'kg'}" value="${hasDist ? (s.distance || '') : (s.weight || '')}" class="set-weight-input" />
      <input type="number" min="0" placeholder="${hasDur ? 'sec' : 'reps'}" value="${hasDur ? (s.duration_seconds || '') : (s.reps || '')}" class="set-reps-input" />
      ${hasDist || hasDur ? '<span></span>' : ''}
      <button class="delete-set-btn" data-set-id="${s.id}">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>`;
}

function bindWorkoutEvents() {
  const el = document.getElementById('main-content');

  document.getElementById('picker-header').addEventListener('click', () => {
    ws.pickerOpen = !ws.pickerOpen;
    document.getElementById('picker-content').style.display = ws.pickerOpen ? '' : 'none';
    document.getElementById('picker-chevron').classList.toggle('open', ws.pickerOpen);
  });

  document.getElementById('exercise-search').addEventListener('input', (e) => {
    ws.searchText = e.target.value;
    document.getElementById('exercise-grid').innerHTML = filteredExercisesGrid();
    bindGridEvents();
  });

  // Body view toggle (front / back)
  el.querySelectorAll('.body-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      ws.bodyView = btn.dataset.view;
      el.querySelectorAll('.body-view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === ws.bodyView));
      document.getElementById('body-svg-wrap').innerHTML = bodyMapSvg(ws.bodyView);
      refreshMuscleLabel();
      document.getElementById('exercise-grid').innerHTML = filteredExercisesGrid();
      bindGridEvents();
    });
  });

  // Body part click (event delegation on stable wrapper)
  const svgWrap = document.getElementById('body-svg-wrap');
  svgWrap.addEventListener('click', (e) => {
    const part = e.target.closest('.body-part');
    if (!part) return;
    const muscle = part.dataset.muscle;
    ws.selectedMuscle = ws.selectedMuscle === muscle ? null : muscle;
    svgWrap.innerHTML = bodyMapSvg(ws.bodyView);
    refreshMuscleLabel();
    document.getElementById('exercise-grid').innerHTML = filteredExercisesGrid();
    bindGridEvents();
  });

  // Clear muscle selection
  document.getElementById('muscle-label').addEventListener('click', (e) => {
    if (!e.target.closest('#clear-muscle')) return;
    ws.selectedMuscle = null;
    document.getElementById('body-svg-wrap').innerHTML = bodyMapSvg(ws.bodyView);
    refreshMuscleLabel();
    document.getElementById('exercise-grid').innerHTML = filteredExercisesGrid();
    bindGridEvents();
  });

  el.querySelectorAll('.eq-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      ws.selectedEquipment = btn.dataset.eq || null;
      el.querySelectorAll('.eq-pill').forEach(b => b.classList.toggle('active', b.dataset.eq === (ws.selectedEquipment || '')));
      document.getElementById('exercise-grid').innerHTML = filteredExercisesGrid();
      bindGridEvents();
    });
  });

  bindGridEvents();

  el.addEventListener('click', async (e) => {
    const btn = e.target.closest('.add-set-btn');
    if (btn) { await addSet(btn.dataset.weId, parseInt(btn.dataset.exIdx)); return; }

    const del = e.target.closest('.delete-set-btn');
    if (del) {
      try {
        await api.workouts.deleteSet(del.dataset.setId);
        del.closest('.set-row').remove();
      } catch (err) { toast(err.message); }
      return;
    }

    const rem = e.target.closest('.remove-exercise-btn');
    if (rem) {
      ws.exercises = ws.exercises.filter(ex => ex.weId !== parseInt(rem.dataset.weId));
      rem.closest('.workout-exercise-item').remove();
      return;
    }
  });

  document.getElementById('workout-title').addEventListener('blur', async (e) => {
    try { await api.workouts.update(ws.id, { title: e.target.value }); } catch {}
  });

  document.getElementById('finish-btn').addEventListener('click', finishWorkout);

  document.getElementById('cancel-workout-btn').addEventListener('click', async () => {
    if (!confirm('Annuler cette séance ?')) return;
    try { await api.workouts.delete(ws.id); } catch {}
    resetWorkoutState(); renderWorkout();
  });
}

function bindGridEvents() {
  document.querySelectorAll('.exercise-card').forEach(card => {
    card.addEventListener('click', () => addExerciseToWorkout(parseInt(card.dataset.exId)));
  });
}

async function addExerciseToWorkout(exId) {
  if (ws.exercises.find(e => e.exerciseId === exId)) { toast('Exercice déjà ajouté'); return; }
  try {
    const data = await api.workouts.addExercise(ws.id, { exercise_id: exId, order_index: ws.exercises.length });
    const ex = { weId: data.id, exerciseId: exId, name: data.name, equipment: data.equipment, has_distance: data.has_distance, has_duration: data.has_duration, sets: [] };
    ws.exercises.push(ex);
    const list = document.getElementById('workout-exercises-list');
    const empty = list.querySelector('.empty-state');
    if (empty) empty.remove();
    list.insertAdjacentHTML('beforeend', exerciseItemHtml(ex, ws.exercises.length - 1));
    toast(`${data.name} ajouté`);
    list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) { toast(err.message); }
}

async function addSet(weId, exIdx) {
  const ex = ws.exercises.find(e => e.weId === parseInt(weId));
  if (!ex) return;
  const setNum = ex.sets.length + 1;
  try {
    const s = await api.workouts.addSet(weId, { set_number: setNum });
    ex.sets.push(s);
    const cols = ex.has_distance || ex.has_duration ? 'grid-template-columns:32px 1fr 1fr 1fr auto' : 'grid-template-columns:32px 1fr 1fr auto';
    document.getElementById(`sets-list-${weId}`).insertAdjacentHTML('beforeend', setRowHtml(s, ex.sets.length - 1, ex, cols));
  } catch (err) { toast(err.message); }
}

async function finishWorkout() {
  const durationMins = Math.round((Date.now() - ws.startTime) / 60000);
  const title = document.getElementById('workout-title').value || 'Séance';
  await saveAllSetInputs();
  try {
    await api.workouts.update(ws.id, { title, duration_minutes: durationMins, completed_at: new Date().toISOString() });
    clearInterval(ws.timerInterval);
    showSummary(durationMins, title);
  } catch (err) { toast(err.message); }
}

async function saveAllSetInputs() {
  const rows = document.querySelectorAll('.set-row[data-set-id]');
  const promises = [];
  rows.forEach(row => {
    const setId = row.dataset.setId;
    const weEl = row.closest('[data-we-id]');
    const ex = ws.exercises.find(e => String(e.weId) === String(weEl?.dataset.weId));
    const v1 = row.querySelector('.set-weight-input')?.value;
    const v2 = row.querySelector('.set-reps-input')?.value;
    if (!setId || (!v1 && !v2)) return;
    const body = ex?.has_distance
      ? { distance: parseFloat(v1) || null, duration_seconds: parseInt(v2) || null }
      : { weight: parseFloat(v1) || null, reps: parseInt(v2) || null };
    promises.push(fetch(`http://localhost:3000/api/workouts/sets/${setId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(body)
    }).catch(() => {}));
  });
  await Promise.allSettled(promises);
}

function showSummary(durationMins, title) {
  const totalSets = ws.exercises.reduce((a, ex) => a + ex.sets.length, 0);
  document.getElementById('main-content').innerHTML = `
    <div class="workout-summary">
      <div class="summary-header">
        <div style="font-size:3rem;margin-bottom:0.5rem">🏆</div>
        <div class="summary-title">Séance terminée !</div>
        <div class="summary-subtitle">${title}</div>
      </div>
      <div class="summary-stats">
        <div class="summary-stat"><div class="summary-stat-value">${formatDuration(durationMins)}</div><div class="summary-stat-label">Durée</div></div>
        <div class="summary-stat"><div class="summary-stat-value">${ws.exercises.length}</div><div class="summary-stat-label">Exercices</div></div>
        <div class="summary-stat"><div class="summary-stat-value">${totalSets}</div><div class="summary-stat-label">Séries</div></div>
      </div>
      <div class="summary-exercises">
        <h3 style="font-size:0.85rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.75rem">Exercices</h3>
        ${ws.exercises.map(ex => `
          <div class="summary-exercise-item">
            <div style="display:flex;align-items:center;gap:0.6rem">
              <div style="width:24px;height:24px;color:var(--accent)">${getIcon(ex)}</div>
              <span>${ex.name}</span>
            </div>
            <span class="text-secondary text-sm">${ex.sets.length} série${ex.sets.length > 1 ? 's' : ''}</span>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:0.75rem">
        <button class="btn-primary" style="flex:1" onclick="navigate('#/home');resetWorkoutState()">Voir le feed</button>
        <button class="btn-secondary" style="flex:1" onclick="navigate('#/history');resetWorkoutState()">Historique</button>
      </div>
    </div>`;
  resetWorkoutState();
}

function resetWorkoutState() {
  if (ws.timerInterval) clearInterval(ws.timerInterval);
  ws = { id: null, startTime: null, timerInterval: null, exercises: [], pickerOpen: true, selectedMuscle: null, selectedEquipment: null, searchText: '', allExercises: ws.allExercises, bodyView: 'front' };
}
window.resetWorkoutState = resetWorkoutState;
