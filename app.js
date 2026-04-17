/* ═══════════════════════════════════════════════════════════════
   ARENA · Single-file app logic
   ═══════════════════════════════════════════════════════════════ */

/* ───── STORAGE ───── */
const S = {
  get(k, d) {
    try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; }
    catch { return d; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  }
};

/* ───── DATE HELPERS ───── */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const yesterday = () => {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const daysBetween = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);

const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const JOURS_LONG = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

/* ───── DOM HELPERS ───── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const setText = (id, v) => { const el = $(id); if (el) el.textContent = v; };
const setHTML = (id, v) => { const el = $(id); if (el) el.innerHTML = v; };

/* ───── PROGRAM DATA ───── */
const DAYS = [
  { num: 1, type: 'push', title: 'Push', weekday: 'Lundi', duration: '75 min', intensity: 'Haute',
    sections: [
      { title: 'Push — Haut du corps', exercises: [
        { name: 'Développé couché barre', sets: '4 × 6–8' },
        { name: 'Développé incliné haltères', sets: '3 × 10' },
        { name: 'Élévations latérales', sets: '4 × 12–15' },
        { name: 'Développé militaire', sets: '3 × 8–10' },
        { name: 'Pushdown triceps câble', sets: '3 × 12' },
        { name: 'Dips lestés', sets: '3 × max' },
      ]},
      { title: 'Cardio — Vélo', exercises: [
        { name: 'Échauffement', sets: '5 min' },
        { name: 'Zone 2 continu', sets: '25–30 min' },
        { name: 'Récupération', sets: '5 min' },
      ]},
    ], note: 'Vélo post-push = récupération active en Z2.' },

  { num: 2, type: 'pull', title: 'Pull', weekday: 'Mardi', duration: '70 min', intensity: 'Haute',
    sections: [
      { title: 'Pull — Dos & Biceps', exercises: [
        { name: 'Tractions lestées', sets: '4 × 6–8' },
        { name: 'Rowing barre', sets: '4 × 8' },
        { name: 'Tirage poitrine câble', sets: '3 × 10–12' },
        { name: 'Face pull', sets: '3 × 15' },
        { name: 'Curl barre', sets: '3 × 10' },
        { name: 'Curl marteau', sets: '3 × 12' },
      ]},
      { title: 'Run — 5 km', exercises: [
        { name: 'Échauffement marche', sets: '3 min' },
        { name: 'Run pace modérée', sets: '5 km' },
        { name: 'Cool-down + étirements', sets: '5 min' },
      ]},
    ], note: 'Run post-pull. Pace confortable, pas de perf.' },

  { num: 3, type: 'cardio', title: 'Cardio léger', weekday: 'Mercredi', duration: '50 min', intensity: 'Moyenne',
    sections: [
      { title: 'Cardio léger', exercises: [
        { name: 'Corde à sauter', sets: '3 × 3 min' },
        { name: 'Stair climber', sets: '15 min Z2' },
        { name: 'SkiErg ou Rameur', sets: '10 min Z2' },
      ]},
      { title: 'Core — Gainage', exercises: [
        { name: 'Planche frontale', sets: '4 × 45–60 sec' },
        { name: 'Planche latérale', sets: '3 × 30 sec' },
        { name: 'Ab wheel rollout', sets: '3 × 10' },
        { name: 'Leg raises suspendu', sets: '3 × 12–15' },
        { name: 'Russian twist lesté', sets: '3 × 20' },
      ]},
    ], note: 'Journée de décharge. Cardio basse intensité, core prio.' },

  { num: 4, type: 'legs', title: 'Jambes', weekday: 'Jeudi', duration: '80 min', intensity: 'Très haute',
    sections: [
      { title: 'Jambes — Force & Volume', exercises: [
        { name: 'Squat barre', sets: '5 × 5' },
        { name: 'Leg press', sets: '4 × 10–12' },
        { name: 'Romanian deadlift', sets: '4 × 8–10' },
        { name: 'Fentes marchées haltères', sets: '3 × 10' },
        { name: 'Leg curl allongé', sets: '3 × 12' },
        { name: 'Mollets debout', sets: '4 × 15–20' },
      ]},
    ], note: 'Séance la plus lourde. Montée progressive avant les 5×5.' },

  { num: 5, type: 'push', title: 'Push', weekday: 'Vendredi', duration: '75 min', intensity: 'Haute',
    sections: [
      { title: 'Push — Variation', exercises: [
        { name: 'Développé couché haltères', sets: '4 × 10' },
        { name: 'Écarté câble incliné', sets: '3 × 12' },
        { name: 'Développé Arnold', sets: '4 × 10' },
        { name: 'Élévations frontales', sets: '3 × 12' },
        { name: 'Extension triceps overhead', sets: '3 × 12' },
        { name: 'Pompes lestées', sets: '3 × max' },
      ]},
      { title: 'Cardio — Vélo', exercises: [{ name: 'Zone 2 continu', sets: '30 min' }]},
    ], note: 'Variation du J1 — préférer haltères. Vélo Z2.' },

  { num: 6, type: 'pull', title: 'Pull', weekday: 'Samedi', duration: '70 min', intensity: 'Haute',
    sections: [
      { title: 'Pull — Variation', exercises: [
        { name: 'Tractions prise neutre', sets: '4 × 8' },
        { name: 'Rowing unilatéral haltère', sets: '4 × 10' },
        { name: 'Tirage horizontal câble', sets: '3 × 12' },
        { name: 'Shrugs haltères', sets: '3 × 15' },
        { name: 'Curl incliné haltères', sets: '3 × 12' },
        { name: 'Curl concentré', sets: '3 × 12' },
      ]},
      { title: 'Cardio — Vélo', exercises: [{ name: 'Zone 2 continu', sets: '25 min' }]},
    ], note: 'Gérer la fatigue accumulée. Vélo facultatif.' },

  { num: 7, type: 'run', title: 'Run long', weekday: 'Dimanche', duration: '60–75 min', intensity: 'Moyenne',
    sections: [
      { title: 'Endurance — Run long', exercises: [
        { name: 'Échauffement marche/trot', sets: '5 min' },
        { name: 'Run continu Z2', sets: '45–60 min' },
        { name: 'Cool-down marche', sets: '5 min' },
        { name: 'Étirements dynamiques', sets: '10 min' },
      ]},
    ], note: 'Allure conversationnelle. Durée principale, distance secondaire.' },

  { num: 8, type: 'rest', title: 'Repos complet', weekday: 'Lundi', duration: '20–30 min', intensity: 'Faible',
    sections: [
      { title: 'Récupération — Mobilité', exercises: [
        { name: 'Hip flexors / pigeon', sets: '2 min' },
        { name: 'Ischio debout', sets: '2 min' },
        { name: 'Thoracique foam roller', sets: '5 min' },
        { name: 'Pecs contre mur', sets: '2 × 60 sec' },
        { name: 'Rotation cervicales lentes', sets: '2 min' },
      ]},
    ], note: 'Zéro intensité. Qualité de récup = qualité du prochain cycle.' },
];

/* ───── DAILY CHALLENGE ───── */
const DAILY = [
  { id: 0, icon: '💪', name: 'Pompes', target: 100, step: 10, unit: 'reps' },
  { id: 1, icon: '🦵', name: 'Squats', target: 100, step: 10, unit: 'reps' },
  { id: 2, icon: '🔥', name: 'Fentes', target: 60, step: 10, unit: 'reps' },
  { id: 3, icon: '⚡', name: 'Abdos', target: 60, step: 10, unit: 'reps' },
  { id: 4, icon: '🎯', name: 'Gainage', target: 180, step: 30, unit: 'sec' },
];
const DAILY_TOTAL = DAILY.reduce((a, c) => a + c.target, 0);

/* ───── RANKS ───── */
const RANKS = [
  { name: 'Rookie', min: 0, max: 3, color: '#78ff6b' },
  { name: 'Soldier', min: 4, max: 14, color: '#c9ff00' },
  { name: 'Warrior', min: 15, max: 29, color: '#ff4520' },
  { name: 'Beast', min: 30, max: 59, color: '#00b8ff' },
  { name: 'Monster', min: 60, max: 999, color: '#ff1a80' },
];
const getRank = s => RANKS.find(r => s >= r.min && s <= r.max) || RANKS[0];

/* ───── ACHIEVEMENTS ───── */
const ACHIEVEMENTS = [
  { id: 'first_blood', icon: '🩸', name: 'First Blood', desc: 'Première charge loggée' },
  { id: 'week_warrior', icon: '⚔️', name: 'Week Warrior', desc: '7j de streak' },
  { id: 'beast_mode', icon: '🦁', name: 'Beast Mode', desc: '30j de streak' },
  { id: 'monster', icon: '🧬', name: 'Monster', desc: '60j de streak' },
  { id: 'bench100', icon: '💯', name: 'Century Club', desc: '100kg au bench' },
  { id: 'squat120', icon: '🦵', name: 'Squat King', desc: '120kg au squat' },
  { id: 'pr_x10', icon: '🏆', name: 'PR Machine', desc: '10 PRs' },
  { id: 'iron', icon: '🔩', name: 'Iron Discipline', desc: 'Score ≥ 80%' },
  { id: 'run5', icon: '👟', name: 'Runner', desc: '5 runs' },
  { id: 'run25', icon: '🏅', name: 'Runner Pro', desc: '25 runs' },
  { id: 'km100', icon: '🌍', name: '100K Club', desc: '100km cumulés' },
  { id: 'speed', icon: '⚡', name: 'Speed Demon', desc: 'Pace ≤ 5\'00"/km' },
  { id: 'daily30', icon: '🔥', name: 'Grinder', desc: '30 daily complets' },
  { id: 'protein7', icon: '🥩', name: 'Protein King', desc: '7j protéines 100%' },
  { id: 'water7', icon: '💧', name: 'Hydration Hero', desc: '7j hydratation 100%' },
  { id: 'vol10k', icon: '👑', name: 'Volume 10T', desc: '10 tonnes cumulées' },
  { id: 'perfect_week', icon: '💎', name: 'Perfect Week', desc: 'Semaine parfaite' },
];

/* ───── MOTIVATION ───── */
const QUOTES = [
  "T'es en train de devenir une machine.",
  "Même fatigué tu bosses.",
  "Personne ne va le faire à ta place.",
  "Chaque jour compte.",
  "Discipline > motivation.",
  "Le futur Thomas te remercie.",
  "Un set de plus qu'hier.",
  "Les excuses changent rien au résultat.",
  "Process > résultat.",
  "Bali se mérite.",
];

/* ───── MIGRATION from old keys ───── */
(() => {
  /* prChargesData → prData */
  const oldPr = S.get('prChargesData', null);
  const newPr = S.get('prData', null);
  if (oldPr && !newPr) {
    S.set('prData', oldPr);
    console.log('[migration] prChargesData → prData');
  }
  /* proteinState → protein */
  const oldProt = S.get('proteinState', null);
  const newProt = S.get('protein', null);
  if (oldProt && !newProt && oldProt.blocks) {
    S.set('protein', oldProt);
    console.log('[migration] proteinState → protein');
  }
})();

/* ───── STATE ───── */
let state = {
  cycleStart:   S.get('cycleStart', null),
  cycleOffset:  S.get('cycleOffset', 0),
  progState:    S.get('progState', {}),
  dailyState:   S.get('dailyState', { date: '', reps: DAILY.map(() => 0) }),
  streakData:   S.get('streakData', { count: 0, lastDate: '', best: 0, rankLast: '' }),
  historyData:  S.get('historyData', []),
  hardcoreMode: S.get('hardcoreMode', false),
  chargesData:  S.get('chargesData', {}),
  prData:       S.get('prData', {}),
  sessionNotes: S.get('sessionNotes', {}),
  runHistory:   S.get('runHistory', []),
  bodyLog:      S.get('bodyLog', []),
  goals:        S.get('goals', []),
  achievements: S.get('achievements', {}),
  protein:      S.get('protein', { date: '', blocks: [false, false, false, false] }),
  proteinStreak:S.get('proteinStreak', { count: 0, lastDate: '' }),
  proteinTarget: S.get('proteinTarget', 150),
  water:        S.get('water', { date: '', ml: 0 }),
  waterStreak:  S.get('waterStreak', { count: 0, lastDate: '' }),
  waterTarget:  S.get('waterTarget', 2500),
};

/* UI state (not persisted to user data, just UI flags) */
let dailyUiOpen = S.get('dailyUiOpen', false);

/* ═══════════════════════════════════════════════════════════════
   MIGRATION + DAILY RESET — single source of truth, runs once
   ═══════════════════════════════════════════════════════════════ */
(function migrateAndResetDaily() {
  /* --- 1. Archive previous daily if new day --- */
  if (state.dailyState.date && state.dailyState.date !== today() && state.dailyState.reps?.some(v => v > 0)) {
    const reps = [...state.dailyState.reps];
    const total = reps.reduce((a, v) => a + v, 0);
    const pct = Math.round(total / DAILY_TOTAL * 100);
    const done = reps.every((r, i) => r >= DAILY[i].target);
    const existing = state.historyData.find(d => d.date === state.dailyState.date);
    if (!existing || (!existing.done && existing.pct < pct)) {
      state.historyData = state.historyData.filter(d => d.date !== state.dailyState.date);
      state.historyData.unshift({ date: state.dailyState.date, reps, pct, done });
      if (state.historyData.length > 180) state.historyData = state.historyData.slice(0, 180);
      S.set('historyData', state.historyData);
    }
  }
  /* Ensure dailyState shape */
  if (!state.dailyState || !Array.isArray(state.dailyState.reps) || state.dailyState.reps.length !== DAILY.length) {
    state.dailyState = { date: today(), reps: DAILY.map(() => 0) };
  }
  if (state.dailyState.date !== today()) {
    state.dailyState = { date: today(), reps: DAILY.map(() => 0) };
  }
  S.set('dailyState', state.dailyState);

  /* --- 2. Protein: migrate blocks[] → grams, then reset if new day --- */
  if (!state.protein || typeof state.protein !== 'object') {
    state.protein = { date: today(), grams: 0 };
  }
  if (Array.isArray(state.protein.blocks)) {
    // Legacy blocks → convert to grams
    const doneBlocks = state.protein.blocks.filter(Boolean).length;
    const grams = Math.round(doneBlocks * (state.proteinTarget / 4));
    state.protein = { date: state.protein.date || today(), grams };
  }
  if (typeof state.protein.grams !== 'number' || isNaN(state.protein.grams)) {
    state.protein.grams = 0;
  }
  if (state.protein.date !== today()) {
    state.protein = { date: today(), grams: 0 };
  }
  S.set('protein', state.protein);

  /* --- 3. Water: migrate count (glasses) → ml, then reset if new day --- */
  if (!state.water || typeof state.water !== 'object') {
    state.water = { date: today(), ml: 0 };
  }
  if (typeof state.water.count === 'number' && typeof state.water.ml !== 'number') {
    state.water = { date: state.water.date || today(), ml: state.water.count * 250 };
  }
  if (typeof state.water.ml !== 'number' || isNaN(state.water.ml)) {
    state.water.ml = 0;
  }
  if (state.water.date !== today()) {
    state.water = { date: today(), ml: 0 };
  }
  S.set('water', state.water);

  /* --- 4. Water target auto-init from body weight if missing --- */
  if (!state.waterTarget || state.waterTarget < 1000) {
    const w = state.bodyLog?.[0]?.kg || 70;
    state.waterTarget = Math.round((w * 35) / 250) * 250;
    S.set('waterTarget', state.waterTarget);
  }
})();

/* ───── TAB NAVIGATION ───── */
function goTab(name) {
  $$('.tab').forEach(t => t.classList.remove('active'));
  $$('.tab-btn').forEach(b => b.classList.remove('active'));
  $(`tab-${name}`).classList.add('active');
  $$(`[data-tab="${name}"]`).forEach(b => b.classList.add('active'));
  S.set('lastTab', name);
  window.scrollTo(0, 0);
  if (name === 'today') renderToday();
  if (name === 'train') renderTrain();
  if (name === 'body') renderBody();
  if (name === 'stats') renderStats();
}

function switchSub(name) {
  $$('.sub').forEach(b => b.classList.remove('active'));
  $$('.sub-content').forEach(c => c.classList.remove('active'));
  $$(`[data-sub="${name}"]`).forEach(b => b.classList.add('active'));
  $(`sub-${name}`).classList.add('active');
  S.set('lastSub', name);
  if (name === 'cycle') renderCycle();
  if (name === 'charges') renderCharges();
  if (name === 'run') renderRun();
}

/* ───── CURRENT DAY ───── */
function curDayIdx() {
  if (!state.cycleStart) return -1;
  const diff = daysBetween(state.cycleStart, today()) + state.cycleOffset;
  return diff < 0 ? -1 : diff % 8;
}

/* ═══════════════════════════════════════════════════════════════
   SCORE / XP / FOCUS helpers (premium dashboard)
   ═══════════════════════════════════════════════════════════════ */
function getSessionPct() {
  const cur = curDayIdx();
  if (cur < 0) return 0;
  const day = DAYS[cur];
  const totalExos = day.sections.reduce((a, s) => a + s.exercises.length, 0);
  let doneExos = 0;
  day.sections.forEach((sec, si) => sec.exercises.forEach((ex, ei) => { if (state.progState[`d${cur}s${si}e${ei}`]) doneExos++; }));
  return totalExos ? Math.round((doneExos / totalExos) * 100) : 0;
}
function getDailyPct() {
  const total = state.dailyState.reps.reduce((a, v) => a + v, 0);
  return Math.round(total / DAILY_TOTAL * 100);
}
function getTodayScore() {
  return Math.round(
    getSessionPct() * 0.30 +
    getDailyPct()   * 0.30 +
    getProteinPct() * 0.20 +
    getWaterPct()   * 0.20
  );
}
function calcLevelData() {
  const perfectDays = state.historyData.filter(d => d.done).length;
  const score = getTodayScore();
  const xp = perfectDays * 100 + (state.streakData.best || 0) * 40 + score * 6 + state.runHistory.length * 20;
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const curBase = (level - 1) * 250;
  return { xp, level, curXp: xp - curBase, nextXp: 250 };
}

/* ───── TODAY RENDER ───── */
function renderToday() {
  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  setHTML('greeting', `${greet}<span class="accent"> Thomas.</span>`);
  setText('todayDate', `${JOURS[now.getDay()]} ${now.getDate()} ${MOIS[now.getMonth()]}`);
  setText('quote', QUOTES[now.getDate() % QUOTES.length]);

  /* Status strip */
  const s = state.streakData.count;
  const rank = getRank(s);
  const next = RANKS[RANKS.indexOf(rank) + 1];
  setText('rankName', rank.name);
  if (next) {
    const prog = Math.round(((s - rank.min) / (next.min - rank.min)) * 100);
    const el = $('rankBar');
    if (el) { el.style.width = Math.min(prog, 100) + '%'; el.style.background = rank.color; }
  } else {
    const el = $('rankBar'); if (el) { el.style.width = '100%'; el.style.background = rank.color; }
  }

  setText('streakNum', s);
  setText('streakSub', s === 0 ? 'Commence aujourd\'hui' : s === 1 ? '1 jour' : s + ' jours');

  /* Discipline 30d */
  const last30 = state.historyData.slice(0, 30);
  const discPct = last30.length > 0 ? Math.round(last30.filter(d => d.done).length / last30.length * 100) : 0;
  setText('discScore', last30.length > 0 ? discPct + '%' : '—');

  /* Session card */
  const cur = curDayIdx();
  const sc = $('sessionCard');
  if (cur < 0) {
    setText('sessionTag', '—');
    setText('sessionDay', '—');
    setText('sessionTitle', 'Aucun cycle');
    setText('sessionMeta', 'Appuie pour démarrer');
    if (sc) sc.style.borderLeftColor = 'var(--muted-2)';
    $('sessionProgressBar').style.width = '0%';
    setText('sessionProgressText', '');
  } else {
    const day = DAYS[cur];
    const tagEl = $('sessionTag');
    if (tagEl) { tagEl.textContent = day.type.toUpperCase(); tagEl.className = 'session-tag ' + day.type; }
    setText('sessionDay', `J${day.num}/8`);
    setText('sessionTitle', day.title);
    setText('sessionMeta', `${day.duration} · ${day.intensity}`);
    if (sc) sc.style.borderLeftColor = `var(--${day.type})`;
    /* Progress */
    const totalExos = day.sections.reduce((a, s) => a + s.exercises.length, 0);
    let doneExos = 0;
    day.sections.forEach((sec, si) => sec.exercises.forEach((ex, ei) => { if (state.progState[`d${cur}s${si}e${ei}`]) doneExos++; }));
    const pct = Math.round(doneExos / totalExos * 100);
    $('sessionProgressBar').style.width = pct + '%';
    setText('sessionProgressText', `${doneExos} / ${totalExos} exos · ${pct}%`);
  }

  /* Daily */
  renderDailyGrid();

  /* Protein & water */
  renderProtein();
  renderWater();

  /* Premium dashboard: XP + today score + focus */
  const xpData = calcLevelData();
  setText('xpLevel', xpData.level);
  setText('xpMeta', `${xpData.curXp} / ${xpData.nextXp} XP`);

  const score = getTodayScore();
  setText('dailyScoreVal', score + '%');
  const ring = $('dailyScoreRing');
  if (ring) ring.style.setProperty('--score', score + '%');
  setText('scoreSummary',
    score >= 85 ? 'Grosse journée. T\'es verrouillé.'
    : score >= 60 ? 'Bonne cadence. Termine les détails.'
    : 'Pose les fondations avant de vouloir forcer.'
  );
  const bd = $('scoreBreakdown');
  if (bd) bd.innerHTML = `
    <div class="score-chip"><span>Train</span><strong>${getSessionPct()}%</strong></div>
    <div class="score-chip"><span>Daily</span><strong>${getDailyPct()}%</strong></div>
    <div class="score-chip"><span>Prot</span><strong>${getProteinPct()}%</strong></div>
    <div class="score-chip"><span>Eau</span><strong>${getWaterPct()}%</strong></div>`;

  const priorities = [
    { key: 'Train',   pct: getSessionPct() },
    { key: 'Protein', pct: getProteinPct() },
    { key: 'Hydrate', pct: getWaterPct()   },
    { key: 'Daily',   pct: getDailyPct()   },
  ].sort((a, b) => a.pct - b.pct);
  setText('focusTitle', priorities[0].pct >= 100 ? 'Tout est clean' : `Priorité : ${priorities[0].key}`);
  setText('focusText',
    priorities[0].pct >= 100
      ? 'Journée verrouillée. Tu peux juste maintenir.'
      : `${priorities[0].key} est le point faible du jour. Ferme cette boucle et ton score grimpe vite.`
  );
  setText('focusPill1', priorities[0].key);
  setText('focusPill2', priorities[1].key);
  setText('focusPill3', priorities[2].key);

  /* Sync daily card open state */
  toggleDailyCard(dailyUiOpen);
}

function renderDailyGrid() {
  const el = $('dailyGrid');
  if (!el) return;
  el.innerHTML = DAILY.map((ch, i) => {
    const v = state.dailyState.reps[i];
    const done = v >= ch.target;
    const pct = Math.min(v / ch.target, 1);
    return `<div class="daily-item ${done ? 'done' : ''}" style="--prog:${pct}">
      <div class="di-icon">${ch.icon}</div>
      <div class="di-name">${ch.name}</div>
      <div class="di-val ${done ? 'done-val' : ''}">${v}</div>
      <div class="di-target">/ ${ch.target}</div>
      <div class="di-btns">
        <button class="di-btn" onclick="event.stopPropagation(); dailyStep(${i}, -1)">−</button>
        <button class="di-btn plus" onclick="event.stopPropagation(); dailyStep(${i}, 1)">+</button>
      </div>
    </div>`;
  }).join('');

  const total = state.dailyState.reps.reduce((a, v) => a + v, 0);
  setText('dailyPct', Math.round(total / DAILY_TOTAL * 100) + '%');
}

function dailyStep(i, sign) {
  const ch = DAILY[i];
  const nv = Math.max(0, Math.min(ch.target, state.dailyState.reps[i] + sign * ch.step));
  state.dailyState.reps[i] = nv;
  S.set('dailyState', state.dailyState);

  /* Streak logic */
  const allDone = state.dailyState.reps.every((r, i) => r >= DAILY[i].target);
  if (allDone && state.streakData.lastDate !== today()) {
    const yd = yesterday();
    state.streakData.count = state.streakData.lastDate === yd ? state.streakData.count + 1 : 1;
    state.streakData.best = Math.max(state.streakData.best || 0, state.streakData.count);
    state.streakData.lastDate = today();
    S.set('streakData', state.streakData);
    toast('🎯', 'Daily complet !', `Streak: ${state.streakData.count} jours`);
    checkRankUp();
  }
  /* Archive to history */
  archiveDaily();

  if (navigator.vibrate) navigator.vibrate(sign > 0 ? 40 : 20);
  renderDailyGrid();
  checkAchievements();
}

function archiveDaily() {
  const reps = [...state.dailyState.reps];
  const total = reps.reduce((a, v) => a + v, 0);
  if (total === 0) return;
  const pct = Math.round(total / DAILY_TOTAL * 100);
  const done = reps.every((r, i) => r >= DAILY[i].target);
  const existing = state.historyData.find(d => d.date === today());
  if (existing && (existing.done || existing.pct >= pct)) return;
  state.historyData = state.historyData.filter(d => d.date !== today());
  state.historyData.unshift({ date: today(), reps, pct, done });
  if (state.historyData.length > 180) state.historyData = state.historyData.slice(0, 180);
  S.set('historyData', state.historyData);
}

/* ═══════════════════════════════════════════════════════════════
   PROTEIN — grams-based system (+10/+20/+30/+50, reset)
   ═══════════════════════════════════════════════════════════════ */
function getProteinPct() {
  return Math.min(100, Math.round((state.protein.grams / state.proteinTarget) * 100));
}

function renderProtein() {
  const el = $('protBlocks');
  if (!el) return;
  const pct = getProteinPct();
  setText('protG', Math.round(state.protein.grams));
  setText('protTargetLabel', Math.round(state.proteinTarget));
  setText('protPct', pct + '%');
  const status = pct >= 100 ? 'Objectif verrouillé 🔒'
    : pct >= 70 ? 'Bien parti — continue'
    : pct >= 30 ? 'Nourris la machine'
    : 'Objectif à lancer';
  setText('protStatus', status);
  const bar = $('protBar');
  if (bar) bar.style.width = pct + '%';
  el.innerHTML = `
    <button class="macro-btn compact" onclick="addProtein(10)">+10g</button>
    <button class="macro-btn compact" onclick="addProtein(20)">+20g</button>
    <button class="macro-btn compact" onclick="addProtein(30)">+30g</button>
    <button class="macro-btn compact" onclick="addProtein(50)">+50g</button>
    <button class="macro-btn compact ghost" onclick="resetProtein()">Reset</button>`;
}

function addProtein(amount) {
  state.protein.grams = Math.max(0, (state.protein.grams || 0) + amount);
  S.set('protein', state.protein);
  if (state.protein.grams >= state.proteinTarget && state.proteinStreak.lastDate !== today()) {
    state.proteinStreak.count = state.proteinStreak.lastDate === yesterday() ? state.proteinStreak.count + 1 : 1;
    state.proteinStreak.lastDate = today();
    S.set('proteinStreak', state.proteinStreak);
    toast('🥩', 'Objectif protéines !', `${state.proteinTarget}g atteints`);
  }
  if (navigator.vibrate) navigator.vibrate(25);
  renderProtein();
  checkAchievements();
}

function resetProtein() {
  state.protein.grams = 0;
  S.set('protein', state.protein);
  renderProtein();
}

/* ═══════════════════════════════════════════════════════════════
   WATER — ml-based system (+250/+500/+750/+1000, reset)
   ═══════════════════════════════════════════════════════════════ */
function getWaterPct() {
  return Math.min(100, Math.round((state.water.ml / state.waterTarget) * 100));
}

function renderWater() {
  const el = $('waterBlocks');
  if (!el) return;
  const pct = getWaterPct();
  setText('waterCount', Math.round(state.water.ml));
  setText('waterTargetLabel', Math.round(state.waterTarget));
  setText('waterPct', pct + '%');
  const status = pct >= 100 ? 'Hydratation validée 💧'
    : pct >= 70 ? 'Encore un peu'
    : pct >= 30 ? 'Monte le volume d\'eau'
    : 'Monte progressivement';
  setText('waterStatus', status);
  const bar = $('waterBar');
  if (bar) bar.style.width = pct + '%';
  el.innerHTML = `
    <button class="macro-btn compact water" onclick="addWater(250)">+250ml</button>
    <button class="macro-btn compact water" onclick="addWater(500)">+500ml</button>
    <button class="macro-btn compact water" onclick="addWater(750)">+750ml</button>
    <button class="macro-btn compact water" onclick="addWater(1000)">+1L</button>
    <button class="macro-btn compact ghost" onclick="resetWater()">Reset</button>`;
}

function addWater(amount) {
  state.water.ml = Math.max(0, (state.water.ml || 0) + amount);
  S.set('water', state.water);
  if (state.water.ml >= state.waterTarget && state.waterStreak.lastDate !== today()) {
    state.waterStreak.count = state.waterStreak.lastDate === yesterday() ? state.waterStreak.count + 1 : 1;
    state.waterStreak.lastDate = today();
    S.set('waterStreak', state.waterStreak);
    toast('💧', 'Hydratation au top', `${state.waterTarget}ml atteints`);
  }
  if (navigator.vibrate) navigator.vibrate(20);
  renderWater();
  checkAchievements();
}

function resetWater() {
  state.water.ml = 0;
  S.set('water', state.water);
  renderWater();
}

/* ═══════════════════════════════════════════════════════════════
   DAILY CARD — collapsible, fully clickable
   ═══════════════════════════════════════════════════════════════ */
function handleDailyCardClick(event) {
  const body = $('dailyCardBody');
  const insideBody = body && body.contains(event.target);
  const isAction = !!event.target.closest('button, .di-btn, .daily-item');
  // Ignore clicks on buttons/items inside the body — they handle their own logic
  if (insideBody && isAction) return;
  // Ignore all clicks inside body (prevents collapsing while interacting)
  if (insideBody) return;
  toggleDailyCard();
}

function toggleDailyCard(force) {
  dailyUiOpen = typeof force === 'boolean' ? force : !dailyUiOpen;
  S.set('dailyUiOpen', dailyUiOpen);
  const card = $('dailyCard');
  const body = $('dailyCardBody');
  const btn = $('dailyToggleBtn');
  const sub = $('dailyCardSub');
  if (card) card.classList.toggle('open', dailyUiOpen);
  if (body) body.style.display = dailyUiOpen ? 'block' : 'none';
  if (btn) btn.textContent = dailyUiOpen ? '▴' : '▾';
  if (sub) sub.textContent = dailyUiOpen ? 'Clique pour refermer' : 'Clique pour ouvrir';
}

function resetDailyProgress() {
  state.dailyState.reps = DAILY.map(() => 0);
  S.set('dailyState', state.dailyState);
  archiveDaily();
  renderDailyGrid();
  renderToday();
}



/* ───── TRAIN TAB ───── */
function renderTrain() {
  const lastSub = S.get('lastSub', 'cycle');
  switchSub(lastSub);
}

/* CYCLE */
function renderCycle() {
  /* Cycle status */
  const cur = curDayIdx();
  setText('cyclePos', state.cycleStart ? `J${cur + 1}/8` : 'Non démarré');
  if (state.cycleStart) {
    const d = new Date(state.cycleStart);
    setText('cycleDate', `Démarré ${d.getDate()} ${MOIS[d.getMonth()]}`);
  } else {
    setText('cycleDate', '');
  }
  const dots = $('cycleDots');
  if (dots) {
    dots.innerHTML = Array.from({ length: 8 }, (_, i) => {
      let cls = 'cycle-dot';
      if (i < cur) cls += ' done';
      else if (i === cur) cls += ' cur';
      return `<div class="${cls}"></div>`;
    }).join('');
  }

  /* Day cards */
  const grid = $('daysGrid');
  if (!grid) return;
  grid.innerHTML = DAYS.map((day, i) => {
    const totalExos = day.sections.reduce((a, s) => a + s.exercises.length, 0);
    let doneExos = 0;
    day.sections.forEach((sec, si) => sec.exercises.forEach((ex, ei) => { if (state.progState[`d${i}s${si}e${ei}`]) doneExos++; }));
    const isCur = i === cur;
    const isDone = doneExos === totalExos && totalExos > 0;
    const secHTML = day.sections.map((sec, si) => `
      <div class="day-section">
        <h4>${sec.title}</h4>
        ${sec.exercises.map((ex, ei) => {
          const key = `d${i}s${si}e${ei}`;
          const done = !!state.progState[key];
          const lastKg = getLastCharge(ex.name);
          return `<div class="ex-row ${done ? 'done' : ''}" data-key="${key}" onclick="toggleEx('${key}')">
            <div class="ex-check"></div>
            <div class="ex-name">${ex.name}</div>
            <div class="ex-sets">${ex.sets}</div>
            <button class="ex-kg ${lastKg ? 'has-data' : ''}" onclick="event.stopPropagation(); openCharge('${ex.name.replace(/'/g, '&#39;')}', '${ex.sets.replace(/'/g, '&#39;')}')">${lastKg ? lastKg + 'kg' : '+kg'}</button>
          </div>`;
        }).join('')}
      </div>`).join('');

    const note = state.sessionNotes[`d${i}`] || '';
    return `<div class="day-card ${isCur ? 'cur open' : ''}" data-type="${day.type}" data-idx="${i}">
      <div class="day-head" onclick="toggleDay(${i})">
        <div class="day-num">${String(day.num).padStart(2, '0')}</div>
        <div class="day-info">
          <div class="day-title">${day.title}</div>
          <div class="day-sub">${day.weekday} · ${day.duration} · ⚡ ${day.intensity}</div>
        </div>
        <div class="day-progress ${isDone ? 'done' : ''}">${doneExos}/${totalExos}</div>
        <div class="chev">▾</div>
      </div>
      <div class="day-body">
        ${secHTML}
        <div class="note-box">${day.note}</div>
        <div class="session-note">
          <label>📝 Note de séance</label>
          <textarea id="note-${i}" oninput="saveNote(${i}, this.value)" placeholder="Ressenti, charge perçue, progression...">${note}</textarea>
        </div>
      </div>
    </div>`;
  }).join('');

  /* Buttons */
  const btn = $('startCycleBtn');
  if (btn) btn.textContent = state.cycleStart ? '⟳ Redémarrer le cycle' : '⟳ Démarrer un cycle';
  const skip = $('skipSessionBtn');
  if (skip) skip.style.display = state.cycleStart ? 'inline-flex' : 'none';
}

function toggleDay(i) {
  const card = document.querySelector(`.day-card[data-idx="${i}"]`);
  if (!card) return;
  const open = card.classList.contains('open');
  $$('.day-card.open').forEach(c => c.classList.remove('open'));
  if (!open) card.classList.add('open');
}

function toggleEx(key) {
  const row = document.querySelector(`.ex-row[data-key="${key}"]`);
  if (!row) return;
  const wasDone = row.classList.contains('done');
  if (wasDone) delete state.progState[key];
  else state.progState[key] = true;
  S.set('progState', state.progState);
  row.classList.toggle('done');
  row.classList.remove('flash-on', 'flash-off');
  void row.offsetWidth;
  row.classList.add(wasDone ? 'flash-off' : 'flash-on');
  /* Update day progress */
  const card = row.closest('.day-card');
  const idx = parseInt(card.dataset.idx);
  const day = DAYS[idx];
  const totalExos = day.sections.reduce((a, s) => a + s.exercises.length, 0);
  let doneExos = 0;
  day.sections.forEach((sec, si) => sec.exercises.forEach((ex, ei) => { if (state.progState[`d${idx}s${si}e${ei}`]) doneExos++; }));
  const p = card.querySelector('.day-progress');
  if (p) { p.textContent = `${doneExos}/${totalExos}`; p.classList.toggle('done', doneExos === totalExos); }
  if (navigator.vibrate) navigator.vibrate(wasDone ? 15 : 35);
}

function saveNote(i, val) {
  state.sessionNotes[`d${i}`] = val;
  S.set('sessionNotes', state.sessionNotes);
}

/* CYCLE CONTROLS */
$('startCycleBtn').addEventListener('click', () => {
  if (state.cycleStart) {
    confirmAction(
      'Redémarrer le cycle ?',
      'Tous les exercices repartent à zéro. Les charges sont conservées.',
      () => doStartCycle()
    );
  } else {
    doStartCycle();
  }
});

function doStartCycle() {
  state.cycleStart = today();
  state.cycleOffset = 0;
  state.progState = {};
  S.set('cycleStart', state.cycleStart);
  S.set('cycleOffset', state.cycleOffset);
  S.set('progState', state.progState);
  toast('⟳', 'Cycle lancé', 'Let\'s go Thomas');
  renderCycle();
  renderToday();
}

$('skipSessionBtn').addEventListener('click', () => {
  if (!state.cycleStart) return;
  confirmAction(
    'Passer la séance ?',
    state.hardcoreMode
      ? '⚠️ Mode hardcore : ton streak sera reset.'
      : 'La prochaine séance sera considérée comme aujourd\'hui.',
    () => {
      if (state.hardcoreMode) {
        state.streakData.count = 0;
        S.set('streakData', state.streakData);
        toast('💀', 'Streak reset', 'Mode hardcore activé');
      }
      state.cycleOffset++;
      S.set('cycleOffset', state.cycleOffset);
      renderCycle();
      renderToday();
    }
  );
});

/* ───── CHARGES ───── */
function getLastCharge(exName) {
  const entries = state.chargesData[exName] || [];
  return entries.length ? entries[entries.length - 1].kg : null;
}

function calc1RM(kg, reps) {
  if (reps === 1) return kg;
  return Math.round(kg * (1 + reps / 30));
}

let activeCharge = { name: '', sets: '' };

function openCharge(exName, exSets) {
  activeCharge = { name: exName, sets: exSets };
  $('qlChargeName').textContent = exName;
  $('qlChargeSets').textContent = exSets;
  /* History */
  const entries = state.chargesData[exName] || [];
  const pr = state.prData[exName];
  const histEl = $('qlChargeHistory');
  if (histEl) {
    let html = '';
    if (pr) html += `<div class="charge-hist-row"><span class="charge-hist-date">🏆 PR · ${pr.date}</span><span class="charge-hist-val">${pr.kg}kg × ${pr.reps}</span></div>`;
    if (entries.length) {
      html += entries.slice().reverse().slice(0, 5).map(e => 
        `<div class="charge-hist-row"><span class="charge-hist-date">${e.date}</span><span class="charge-hist-val">${e.kg}kg × ${e.reps}</span></div>`
      ).join('');
    } else if (!pr) {
      html = '<div class="muted" style="font-size:12px;padding:8px 0">Aucune entrée — première fois 💪</div>';
    }
    histEl.innerHTML = html;
  }
  /* Pre-fill + suggestion */
  const last = entries[entries.length - 1];
  if (last) {
    $('qlChargeKg').value = last.kg;
    $('qlChargeReps').value = last.reps;
    renderChargeSuggest(last, exSets);
  } else if (pr) {
    $('qlChargeKg').value = pr.kg;
    $('qlChargeReps').value = pr.reps;
    $('qlChargeSuggest').innerHTML = '';
  } else {
    $('qlChargeKg').value = '';
    $('qlChargeReps').value = '';
    $('qlChargeSuggest').innerHTML = '';
  }
  showModal('quickLogModal', 'charge');
  setTimeout(() => $('qlChargeKg').focus(), 150);
}

function renderChargeSuggest(last, sets) {
  const el = $('qlChargeSuggest');
  if (!el) return;
  const rangeMatch = sets.match(/(\d+)\s*[\-–]\s*(\d+)/);
  const singleMatch = sets.match(/×\s*(\d+)/);
  let repMin = 6, repMax = 12;
  if (rangeMatch) { repMin = +rangeMatch[1]; repMax = +rangeMatch[2]; }
  else if (singleMatch) { repMin = repMax = +singleMatch[1]; }

  let type, nextKg, reason;
  if (last.reps >= repMax) { type = 'up'; nextKg = last.kg + 2.5; reason = `${last.reps} reps → haut fourchette`; }
  else if (last.reps < repMin) { type = 'down'; nextKg = Math.max(last.kg - 2.5, 0); reason = `${last.reps} reps → sous fourchette`; }
  else { type = 'hold'; nextKg = last.kg; reason = `Dans la fourchette, maintiens`; }

  const oneRM = calc1RM(last.kg, last.reps);
  const arrow = { up: '↑', down: '↓', hold: '→' }[type];
  el.className = 'charge-suggest ' + (type === 'hold' ? '' : type);
  el.innerHTML = `
    <div>
      <div class="cs-next ${type === 'hold' ? '' : type}">${arrow} ${nextKg}kg</div>
      <div class="cs-reason">${reason}</div>
    </div>
    <div>
      <div class="cs-1rm">${oneRM}kg</div>
      <div class="cs-1rm-lbl">1RM est.</div>
    </div>`;
}

function saveCharge() {
  const kg = parseFloat($('qlChargeKg').value);
  const reps = parseInt($('qlChargeReps').value);
  if (isNaN(kg) || kg <= 0) { $('qlChargeKg').focus(); return; }
  if (isNaN(reps) || reps <= 0) { $('qlChargeReps').focus(); return; }

  const name = activeCharge.name;
  if (!state.chargesData[name]) state.chargesData[name] = [];
  state.chargesData[name] = state.chargesData[name].filter(e => e.date !== today());
  state.chargesData[name].push({ date: today(), kg, reps });
  if (state.chargesData[name].length > 30) state.chargesData[name].shift();
  S.set('chargesData', state.chargesData);

  /* PR update */
  const currentPr = state.prData[name];
  const isPr = !currentPr || kg > currentPr.kg;
  if (isPr) {
    state.prData[name] = { kg, reps, date: today() };
    S.set('prData', state.prData);
    toast('🏆', 'Nouveau PR !', `${name} · ${kg}kg × ${reps}`);
  }

  closeModal('quickLogModal');
  if (navigator.vibrate) navigator.vibrate(80);
  renderCycle();
  checkAchievements();
}

/* CHARGES SUB */
function renderCharges() {
  const allNames = new Set([...Object.keys(state.chargesData).filter(n => state.chargesData[n].length), ...Object.keys(state.prData)]);
  const totalVol = Object.values(state.chargesData).reduce((a, arr) => a + arr.reduce((b, e) => b + e.kg * e.reps * 3, 0), 0);
  $('chargesBigStats').innerHTML = `
    <div class="big-stat"><div class="big-stat-val">${Object.keys(state.prData).length}</div><div class="big-stat-lbl">PRs</div></div>
    <div class="big-stat"><div class="big-stat-val">${(totalVol / 1000).toFixed(1)}</div><div class="big-stat-lbl">Vol total (t)</div></div>`;

  const keyLifts = ['Développé couché barre', 'Squat barre', 'Romanian deadlift', 'Tractions lestées', 'Développé militaire', 'Rowing barre'];
  const keyEl = $('keyLifts');
  const keyFound = keyLifts.filter(n => allNames.has(n));
  keyEl.innerHTML = keyFound.length
    ? keyFound.map(n => renderChargeRow(n, true)).join('')
    : '<div class="hist-empty">Pas encore de données sur les key lifts.</div>';

  const allEl = $('allCharges');
  const others = [...allNames].filter(n => !keyLifts.includes(n));
  allEl.innerHTML = others.length
    ? others.map(n => renderChargeRow(n, false)).join('')
    : '<div class="hist-empty">—</div>';
}

function renderChargeRow(name, isKey) {
  const entries = state.chargesData[name] || [];
  const pr = state.prData[name];
  if (!entries.length && !pr) return '';
  if (!entries.length && pr) {
    return `<div class="charge-row ${isKey ? 'key' : ''}">
      <div class="charge-name">${name}</div>
      <div class="charge-vals">
        <div class="charge-kg">${pr.kg}<span class="charge-kg-unit">kg</span></div>
        <div class="charge-reps">× ${pr.reps} <span class="charge-delta pr">🏆</span></div>
      </div>
    </div>`;
  }
  const sorted = entries.slice().sort((a, b) => a.date.localeCompare(b.date));
  const last = sorted[sorted.length - 1];
  const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const delta = prev ? last.kg - prev.kg : 0;
  const maxKg = Math.max(...sorted.map(e => e.kg), pr ? pr.kg : 0);
  const bars = sorted.slice(-8).map((e, i, arr) => {
    const h = Math.round((e.kg / maxKg) * 100);
    return `<div class="charge-bar ${i === arr.length - 1 ? 'last' : ''}" style="height:${h}%"></div>`;
  }).join('');
  const deltaStr = delta > 0 ? `<span class="charge-delta up">+${delta}</span>` 
    : delta < 0 ? `<span class="charge-delta down">${delta}</span>` : '';
  const prBadge = pr && last.kg >= pr.kg ? `<span class="charge-delta pr">🏆</span>` : '';

  return `<div class="charge-row ${isKey ? 'key' : ''}">
    <div class="charge-name">${name}</div>
    <div class="charge-bars">${bars}</div>
    <div class="charge-vals">
      <div class="charge-kg">${last.kg}<span class="charge-kg-unit">kg</span></div>
      <div class="charge-reps">× ${last.reps} ${deltaStr}${prBadge}</div>
    </div>
  </div>`;
}

/* ───── RUN ───── */
function formatPace(totalSec, distKm) {
  if (!distKm || !totalSec) return '—';
  const pace = totalSec / distKm;
  return `${Math.floor(pace/60)}'${String(Math.round(pace%60)).padStart(2,'0')}"`;
}
function formatDuration(sec) {
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}

function renderRun() {
  const rh = state.runHistory;
  const totalKm = rh.reduce((a, r) => a + r.dist, 0);
  const monthStr = today().slice(0, 7);
  const monthKm = rh.filter(r => r.date.startsWith(monthStr)).reduce((a, r) => a + r.dist, 0);
  const now = new Date();
  const monOffset = (now.getDay() + 6) % 7;
  const mon = new Date(now); mon.setDate(now.getDate() - monOffset);
  const monStr = `${mon.getFullYear()}-${String(mon.getMonth()+1).padStart(2,'0')}-${String(mon.getDate()).padStart(2,'0')}`;
  const weekRuns = rh.filter(r => r.date >= monStr).length;
  const validPaces = rh.filter(r => r.paceSec && isFinite(r.paceSec));
  const bestPaceSec = validPaces.length ? Math.min(...validPaces.map(r => r.paceSec)) : null;

  setText('runTotalKm', totalKm >= 100 ? Math.round(totalKm) : totalKm.toFixed(1));
  setText('runMonth', monthKm.toFixed(1));
  setText('runWeek', weekRuns);
  setText('runBest', bestPaceSec ? `${Math.floor(bestPaceSec/60)}'${String(Math.round(bestPaceSec%60)).padStart(2,'0')}"` : '—');

  /* PRs */
  const prDefs = [
    { name: 'Meilleur 5K', icon: '🏅', filter: r => r.dist >= 4.9 && r.dist <= 5.3, metric: 'pace' },
    { name: 'Meilleur 10K', icon: '🥇', filter: r => r.dist >= 9.5 && r.dist <= 10.5, metric: 'pace' },
    { name: 'Plus long run', icon: '📏', filter: () => true, metric: 'dist' },
    { name: 'Run le plus long (durée)', icon: '⏱', filter: () => true, metric: 'time' },
  ];
  const prHTML = prDefs.map(pr => {
    const matching = rh.filter(pr.filter);
    if (!matching.length) return `<div class="pr-card">
      <div class="pr-icon">${pr.icon}</div>
      <div class="pr-body"><div class="pr-name">${pr.name}</div><div class="pr-detail">Pas de donnée</div></div>
      <div class="pr-val empty">—</div>
    </div>`;
    let best, val, detail;
    if (pr.metric === 'pace') {
      best = matching.reduce((a, r) => (r.paceSec || Infinity) < (a.paceSec || Infinity) ? r : a);
      val = best.pace; detail = `${best.dist}km en ${formatDuration(best.timeSec)} · ${best.date}`;
    } else if (pr.metric === 'dist') {
      best = matching.reduce((a, r) => r.dist > a.dist ? r : a);
      val = best.dist.toFixed(1) + 'km'; detail = `en ${formatDuration(best.timeSec)} · ${best.pace}/km · ${best.date}`;
    } else {
      best = matching.reduce((a, r) => r.timeSec > a.timeSec ? r : a);
      val = formatDuration(best.timeSec); detail = `${best.dist}km · ${best.pace}/km · ${best.date}`;
    }
    return `<div class="pr-card has">
      <div class="pr-icon">${pr.icon}</div>
      <div class="pr-body"><div class="pr-name">${pr.name}</div><div class="pr-detail">${detail}</div></div>
      <div class="pr-val">${val}</div>
    </div>`;
  }).join('');
  $('runPrs').innerHTML = prHTML;

  /* Pace chart */
  renderPaceChart();

  /* History */
  const histEl = $('runHistory');
  if (rh.length === 0) {
    histEl.innerHTML = '<div class="hist-empty">Aucun run enregistré.<br>Logge ton premier run 🏃</div>';
    return;
  }
  const zoneLbl = { z2: 'Z2', tempo: 'Tempo', interval: 'Interval', long: 'Long' };
  histEl.innerHTML = rh.slice(0, 50).map((r, idx) => {
    const d = new Date(r.date);
    return `<div class="run-row">
      <div class="rr-date">
        <div class="rr-day">${d.getDate()}</div>
        <div class="rr-mo">${MOIS[d.getMonth()]}</div>
      </div>
      <div class="rr-body">
        <div class="rr-top">
          <span class="rr-zone ${r.zone}">${zoneLbl[r.zone] || r.zone}</span>
          <span class="rr-dist">${r.dist} km</span>
        </div>
        ${r.note ? `<div class="rr-note">${r.note}</div>` : ''}
      </div>
      <div class="rr-right">
        <div class="rr-pace">${r.pace}</div>
        <div class="rr-time">${formatDuration(r.timeSec)}</div>
      </div>
      <button class="rr-del" onclick="deleteRun(${idx})">✕</button>
    </div>`;
  }).join('');
}

function renderPaceChart() {
  const svg = $('paceChart');
  if (!svg) return;
  const last20 = state.runHistory.slice(0, 20).reverse().filter(r => r.paceSec && isFinite(r.paceSec));
  if (last20.length < 2) {
    svg.innerHTML = `<text x="250" y="55" text-anchor="middle" fill="#444" font-size="11" font-family="Bebas Neue">Minimum 2 runs pour le graphe</text>`;
    return;
  }
  const w = 500, h = 100, pad = 10;
  const paces = last20.map(r => r.paceSec);
  const minP = Math.min(...paces), maxP = Math.max(...paces);
  const range = maxP - minP || 1;
  const pts = last20.map((r, i) => ({
    x: pad + (i / (last20.length - 1)) * (w - pad * 2),
    y: h - pad - ((maxP - r.paceSec) / range) * (h - pad * 2),
  }));
  const line = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${pts[0].x},${h} ${line} ${pts[pts.length-1].x},${h}`;
  svg.innerHTML = `
    <polygon points="${area}" fill="rgba(255,26,128,0.1)"/>
    <polyline points="${line}" fill="none" stroke="#ff1a80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="2" fill="#ff1a80"/>`).join('')}
    <circle cx="${pts[pts.length-1].x}" cy="${pts[pts.length-1].y}" r="4" fill="#ff1a80"/>`;
}

function deleteRun(idx) {
  confirmAction('Supprimer ce run ?', 'Cette action est irréversible.', () => {
    state.runHistory.splice(idx, 1);
    S.set('runHistory', state.runHistory);
    renderRun();
  });
}

/* RUN QUICK LOG */
function openQuickLog(type) {
  const title = type === 'run' ? '🏃 Logger un run' : type === 'weight' ? '⚖️ Peser' : '';
  $('quickLogTitle').textContent = title;
  showModal('quickLogModal', type);
  if (type === 'run') {
    $('qlDist').value = '';
    $('qlMin').value = '';
    $('qlSec').value = '';
    $('qlNote').value = '';
    updatePacePreview();
    /* Auto-zone selection */
    const cur = curDayIdx();
    if (cur >= 0) {
      if (DAYS[cur].type === 'run') selectZone('long');
      else if (DAYS[cur].sections.some(s => s.title.includes('Run'))) selectZone('z2');
      else selectZone('z2');
    } else selectZone('z2');
    setTimeout(() => $('qlDist').focus(), 150);
  } else if (type === 'weight') {
    $('qlKg').value = state.bodyLog[0]?.kg || '';
    $('qlWaist').value = state.bodyLog[0]?.waist || '';
    setTimeout(() => $('qlKg').focus(), 150);
  }
}

let selectedZone = 'z2';
function selectZone(z) {
  selectedZone = z;
  $$('#qlZonePick .zone-btn').forEach(b => b.classList.toggle('active', b.dataset.zone === z));
}
$$('#qlZonePick .zone-btn').forEach(b => b.addEventListener('click', () => selectZone(b.dataset.zone)));

function updatePacePreview() {
  const dist = parseFloat($('qlDist').value) || 0;
  const mins = parseInt($('qlMin').value) || 0;
  const secs = parseInt($('qlSec').value) || 0;
  const total = mins * 60 + secs;
  const pp = $('qlPacePreview');
  if (dist > 0 && total > 0) {
    $('qlPaceVal').textContent = formatPace(total, dist);
    pp.classList.add('has');
  } else {
    $('qlPaceVal').textContent = '—';
    pp.classList.remove('has');
  }
}
['qlDist', 'qlMin', 'qlSec'].forEach(id => $(id).addEventListener('input', updatePacePreview));

function saveRun() {
  const dist = parseFloat($('qlDist').value);
  const mins = parseInt($('qlMin').value) || 0;
  const secs = parseInt($('qlSec').value) || 0;
  const totalSec = mins * 60 + secs;
  if (!dist || dist <= 0) { $('qlDist').focus(); return; }
  if (totalSec <= 0) { $('qlMin').focus(); return; }
  const entry = {
    date: today(),
    dist: Math.round(dist * 100) / 100,
    timeSec: totalSec,
    pace: formatPace(totalSec, dist),
    paceSec: totalSec / dist,
    zone: selectedZone,
    note: $('qlNote').value.trim(),
  };
  state.runHistory.unshift(entry);
  if (state.runHistory.length > 200) state.runHistory = state.runHistory.slice(0, 200);
  S.set('runHistory', state.runHistory);
  closeModal('quickLogModal');
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  toast('🏃', 'Run enregistré', `${dist}km · ${entry.pace}/km`);
  renderRun();
  renderToday();
  checkAchievements();
}

/* WEIGHT */
function saveWeight() {
  const kg = parseFloat($('qlKg').value);
  const waist = parseFloat($('qlWaist').value) || null;
  if (!kg || kg <= 0) { $('qlKg').focus(); return; }
  state.bodyLog = state.bodyLog.filter(e => e.date !== today());
  state.bodyLog.unshift({ date: today(), kg, waist });
  if (state.bodyLog.length > 365) state.bodyLog = state.bodyLog.slice(0, 365);
  S.set('bodyLog', state.bodyLog);
  closeModal('quickLogModal');
  if (navigator.vibrate) navigator.vibrate(60);
  toast('⚖️', 'Pesée enregistrée', `${kg}kg`);
  renderBody();
  renderToday();
}

/* ───── BODY TAB ───── */
function renderBody() {
  /* Weight stats */
  const bl = state.bodyLog;
  if (bl.length === 0) {
    setText('bodyCurrentKg', '—');
    setText('bodyDelta', '—');
  } else {
    setText('bodyCurrentKg', bl[0].kg);
    if (bl.length >= 2) {
      const refIdx = Math.min(29, bl.length - 1);
      const delta = bl[0].kg - bl[refIdx].kg;
      setText('bodyDelta', (delta > 0 ? '+' : '') + delta.toFixed(1));
      const el = $('bodyDelta');
      if (el) el.style.color = delta <= 0 ? 'var(--green)' : 'var(--legs)';
    } else {
      setText('bodyDelta', '—');
    }
  }

  /* Weight chart */
  renderWeightChart();

  /* Goals */
  renderGoals();

  /* Achievements */
  renderAchGrid();
}

function renderWeightChart() {
  const svg = $('weightChart');
  if (!svg) return;
  const entries = state.bodyLog.slice(0, 30).reverse();
  if (entries.length < 2) {
    svg.innerHTML = `<text x="250" y="65" text-anchor="middle" fill="#444" font-size="11" font-family="Bebas Neue">Minimum 2 pesées pour le graphe</text>`;
    return;
  }
  const w = 500, h = 120, pad = 12;
  const kgs = entries.map(e => e.kg);
  const minKg = Math.min(...kgs), maxKg = Math.max(...kgs);
  const range = maxKg - minKg || 1;
  const pts = entries.map((e, i) => ({
    x: pad + (i / (entries.length - 1)) * (w - pad * 2),
    y: h - pad - ((e.kg - minKg) / range) * (h - pad * 2),
  }));
  const line = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${pts[0].x},${h} ${line} ${pts[pts.length-1].x},${h}`;
  const last = entries[entries.length - 1];
  const delta = last.kg - entries[0].kg;
  const color = delta <= 0 ? '#78ff6b' : '#ffa800';
  svg.innerHTML = `
    <polygon points="${area}" fill="rgba(201,255,0,0.06)"/>
    <polyline points="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="2" fill="${color}"/>`).join('')}
    <circle cx="${pts[pts.length-1].x}" cy="${pts[pts.length-1].y}" r="4" fill="${color}"/>
    <text x="${pts[pts.length-1].x}" y="${pts[pts.length-1].y - 8}" text-anchor="middle" fill="${color}" font-size="11" font-family="Bebas Neue">${last.kg}kg</text>`;
}

/* GOALS */
const GOAL_TPL = [
  { type: 'bench', name: 'Bench Press', unit: 'kg', icon: '🏋️' },
  { type: 'squat', name: 'Squat', unit: 'kg', icon: '🦵' },
  { type: 'run5k', name: '5K en moins de', unit: 'min', icon: '🏃' },
  { type: 'weight', name: 'Poids de forme', unit: 'kg', icon: '⚖️' },
  { type: 'streak', name: 'Streak objectif', unit: 'j', icon: '🔥' },
  { type: 'custom', name: 'Custom', unit: '', icon: '🎯' },
];
let selectedGoalTpl = null;

function renderGoals() {
  const el = $('goalsList');
  if (!el) return;
  syncGoalsWithData();
  if (state.goals.length === 0) {
    el.innerHTML = '<div class="goals-empty">Aucun objectif défini.<br>Définis-en un pour rester focus.</div>';
    return;
  }
  el.innerHTML = state.goals.map(g => {
    const pct = Math.min(100, Math.round((g.current / g.target) * 100));
    const done = g.current >= g.target;
    const daysLeft = g.deadline ? daysBetween(today(), g.deadline) : null;
    const deadlineStr = daysLeft !== null
      ? (daysLeft > 0 ? `${daysLeft}j restants` : daysLeft === 0 ? 'Aujourd\'hui !' : `Dépassé de ${-daysLeft}j`)
      : '';
    const urgent = daysLeft !== null && daysLeft < 14 && !done;
    return `<div class="goal-card ${done ? 'done' : ''}">
      <div class="goal-head">
        <div class="goal-icon">${g.icon}</div>
        <div class="goal-title-wrap">
          <div class="goal-title">${g.name}</div>
          ${deadlineStr ? `<div class="goal-deadline ${urgent ? 'urgent' : ''}">${deadlineStr}</div>` : ''}
        </div>
        <div class="goal-vals">${g.current}<span class="muted">/${g.target}${g.unit}</span></div>
        <button class="goal-del" onclick="deleteGoal('${g.id}')">✕</button>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${pct}%"></div></div>
      <div class="goal-foot">
        <span class="goal-pct">${pct}%</span>
        <span>${done ? '✓ Atteint 🎉' : `${(g.target - g.current).toFixed(1)}${g.unit} restant`}</span>
      </div>
    </div>`;
  }).join('');
}

function syncGoalsWithData() {
  state.goals.forEach(g => {
    let v = null;
    if (g.type === 'bench' && state.prData['Développé couché barre']) v = state.prData['Développé couché barre'].kg;
    if (g.type === 'squat' && state.prData['Squat barre']) v = state.prData['Squat barre'].kg;
    if (g.type === 'weight' && state.bodyLog.length) v = state.bodyLog[0].kg;
    if (g.type === 'streak') v = state.streakData.count;
    if (v !== null) g.current = v;
  });
  S.set('goals', state.goals);
}

function openGoalModal() {
  selectedGoalTpl = null;
  $('goalForm').style.display = 'none';
  $('goalTplGrid').style.display = 'grid';
  $('goalTplGrid').innerHTML = GOAL_TPL.map(t =>
    `<div class="goal-tpl" onclick="selectGoalTpl('${t.type}')">
      <span class="goal-tpl-icon">${t.icon}</span>
      <span class="goal-tpl-name">${t.name}</span>
    </div>`
  ).join('');
  showModal('goalModal');
}

function selectGoalTpl(type) {
  const tpl = GOAL_TPL.find(t => t.type === type);
  selectedGoalTpl = tpl;
  $('goalTplGrid').style.display = 'none';
  $('goalForm').style.display = 'block';
  $('goalName').value = tpl.name;
  $('goalUnit1').textContent = tpl.unit;
  $('goalUnit2').textContent = tpl.unit;
  $('goalCurrent').value = '';
  $('goalTarget').value = '';
  $('goalDate').value = '';
  /* Pre-fill current */
  if (type === 'bench' && state.prData['Développé couché barre']) $('goalCurrent').value = state.prData['Développé couché barre'].kg;
  if (type === 'squat' && state.prData['Squat barre']) $('goalCurrent').value = state.prData['Squat barre'].kg;
  if (type === 'weight' && state.bodyLog.length) $('goalCurrent').value = state.bodyLog[0].kg;
  if (type === 'streak') $('goalCurrent').value = state.streakData.count;
}

function saveGoal() {
  if (!selectedGoalTpl) return;
  const name = $('goalName').value.trim() || selectedGoalTpl.name;
  const current = parseFloat($('goalCurrent').value) || 0;
  const target = parseFloat($('goalTarget').value);
  const deadline = $('goalDate').value || null;
  if (isNaN(target)) { $('goalTarget').focus(); return; }
  state.goals.push({
    id: Date.now().toString(),
    type: selectedGoalTpl.type,
    icon: selectedGoalTpl.icon,
    name, current, target,
    unit: selectedGoalTpl.unit,
    deadline,
    created: today(),
  });
  S.set('goals', state.goals);
  closeModal('goalModal');
  toast('🎯', 'Objectif créé', name);
  renderGoals();
}

function deleteGoal(id) {
  state.goals = state.goals.filter(g => g.id !== id);
  S.set('goals', state.goals);
  renderGoals();
}

/* ACHIEVEMENTS */
function checkAchievements() {
  const unlocked = [];
  const u = id => { if (!state.achievements[id]) unlocked.push(id); };

  if (Object.keys(state.prData).length > 0) u('first_blood');
  if (state.streakData.count >= 7) u('week_warrior');
  if (state.streakData.count >= 30) u('beast_mode');
  if (state.streakData.count >= 60) u('monster');
  if (state.prData['Développé couché barre']?.kg >= 100) u('bench100');
  if (state.prData['Squat barre']?.kg >= 120) u('squat120');
  if (Object.keys(state.prData).length >= 10) u('pr_x10');
  if (state.historyData.length >= 30) {
    const disc = state.historyData.slice(0, 30).filter(d => d.done).length / 30;
    if (disc >= 0.8) u('iron');
  }
  if (state.runHistory.length >= 5) u('run5');
  if (state.runHistory.length >= 25) u('run25');
  const totalKm = state.runHistory.reduce((a, r) => a + r.dist, 0);
  if (totalKm >= 100) u('km100');
  if (state.runHistory.some(r => r.paceSec && r.paceSec <= 300)) u('speed');
  if (state.historyData.filter(d => d.done).length >= 30) u('daily30');
  if (state.proteinStreak.count >= 7) u('protein7');
  if (state.waterStreak.count >= 7) u('water7');
  const totalVol = Object.values(state.chargesData).reduce((a, arr) => a + arr.reduce((b, e) => b + e.kg * e.reps * 3, 0), 0);
  if (totalVol >= 10000) u('vol10k');
  /* Perfect week: 7 consecutive days of session + daily both complete */
  const last7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    last7.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  }
  const dailiesDone = last7.every(date => {
    if (date === today()) {
      return state.dailyState.reps.every((r, i) => r >= DAILY[i].target);
    }
    const h = state.historyData.find(hd => hd.date === date);
    return h && h.done;
  });
  if (dailiesDone) u('perfect_week');

  unlocked.forEach(id => {
    state.achievements[id] = { date: today() };
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (def) toast(def.icon, 'Achievement débloqué !', def.name);
  });
  if (unlocked.length) S.set('achievements', state.achievements);
}

function renderAchGrid() {
  const el = $('achGrid');
  if (!el) return;
  const unlocked = Object.keys(state.achievements).length;
  setText('achCount', `${unlocked}/${ACHIEVEMENTS.length}`);
  el.innerHTML = ACHIEVEMENTS.map(a => {
    const isUnlocked = !!state.achievements[a.id];
    return `<div class="ach-card ${isUnlocked ? 'unlocked' : 'locked'}">
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${isUnlocked ? state.achievements[a.id].date : a.desc}</div>
    </div>`;
  }).join('');
}

/* ───── STATS TAB ───── */
function renderStats() {
  const perfectDays = state.historyData.filter(d => d.done).length;
  const totalReps = state.historyData.reduce((a, d) => a + ((d.reps || []).reduce((b, v) => b + v, 0)), 0);
  const totalVol = Object.values(state.chargesData).reduce((a, arr) => a + arr.reduce((b, e) => b + e.kg * e.reps * 3, 0), 0);
  setText('statPerfectDays', perfectDays);
  setText('statBestStreak', state.streakData.best || 0);
  setText('statTotalReps', totalReps >= 1000 ? (totalReps / 1000).toFixed(1) + 'k' : totalReps);
  setText('statTotalVolume', (totalVol / 1000).toFixed(1));

  /* Heatmap 90d */
  const hmEl = $('heatmap');
  if (hmEl) {
    hmEl.innerHTML = '';
    const histMap = {};
    state.historyData.forEach(e => { histMap[e.date] = e; });
    const tod = new Date(today());
    const start = new Date(tod); start.setDate(tod.getDate() - 89);
    const dow = start.getDay(); const toMon = dow === 0 ? 6 : dow - 1;
    start.setDate(start.getDate() - toMon);
    let cur = new Date(start);
    while (cur <= tod) {
      const week = document.createElement('div');
      week.className = 'hm-week';
      for (let d = 0; d < 7; d++) {
        const ds = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
        const cell = document.createElement('div');
        if (cur > tod) cell.className = 'hm-cell empty';
        else {
          const e = histMap[ds];
          cell.className = 'hm-cell ' + (e ? (e.done ? 'done' : 'partial') : '');
        }
        if (ds === today()) cell.classList.add('today');
        cell.title = ds;
        week.appendChild(cell);
        cur.setDate(cur.getDate() + 1);
      }
      hmEl.appendChild(week);
    }
  }

  /* Ex totals */
  const exTotals = DAILY.map((_, i) => state.historyData.reduce((a, d) => a + (d.reps?.[i] || 0), 0));
  const maxEx = Math.max(...exTotals, 1);
  const colors = ['var(--push)', 'var(--accent)', 'var(--green)', 'var(--pull)', 'var(--run)'];
  $('exTotals').innerHTML = DAILY.map((ch, i) => {
    const pct = Math.round(exTotals[i] / maxEx * 100);
    return `<div class="ex-total">
      <div class="et-icon">${ch.icon}</div>
      <div class="et-body">
        <div class="et-name">${ch.name}</div>
        <div class="et-bar-wrap"><div class="et-bar" style="width:${pct}%;background:${colors[i]}"></div></div>
      </div>
      <div class="et-val" style="color:${colors[i]}">${exTotals[i] >= 1000 ? (exTotals[i]/1000).toFixed(1)+'k' : exTotals[i]}</div>
    </div>`;
  }).join('');

  /* History */
  const histEl = $('historyList');
  if (state.historyData.length === 0) {
    histEl.innerHTML = '<div class="hist-empty">Aucune séance enregistrée.<br>Commence ton défi daily !</div>';
    return;
  }
  histEl.innerHTML = state.historyData.slice(0, 30).map(e => {
    const d = new Date(e.date);
    const chips = DAILY.map((ch, i) => {
      const v = e.reps[i] || 0;
      return v ? `<span class="hist-chip">${ch.icon} ${v}</span>` : '';
    }).join('');
    return `<div class="hist-row ${e.done ? 'full' : 'partial'}">
      <div class="hist-date">
        <div class="hist-day">${d.getDate()}</div>
        <div class="hist-mo">${MOIS[d.getMonth()]}</div>
      </div>
      <div style="flex:1;min-width:0">
        <div class="hist-chips">${chips || '<span class="muted">—</span>'}</div>
      </div>
      <div class="hist-pct">${e.pct}%</div>
    </div>`;
  }).join('');
}

/* ───── RANK UP ───── */
function checkRankUp() {
  const cur = getRank(state.streakData.count);
  if (!state.streakData.rankLast) {
    state.streakData.rankLast = cur.name;
    S.set('streakData', state.streakData);
    return;
  }
  if (state.streakData.rankLast !== cur.name) {
    state.streakData.rankLast = cur.name;
    S.set('streakData', state.streakData);
    toast('⚡', 'Level Up !', `Nouveau rang : ${cur.name}`);
    if (navigator.vibrate) navigator.vibrate([120, 80, 120, 80, 200]);
  }
}

/* ───── MODALS ───── */
function showModal(id, subType) {
  $(id).classList.add('show');
  if (subType) {
    if (id === 'quickLogModal') {
      $('qlRunForm').style.display = subType === 'run' ? 'block' : 'none';
      $('qlWeightForm').style.display = subType === 'weight' ? 'block' : 'none';
      $('qlChargeForm').style.display = subType === 'charge' ? 'block' : 'none';
    }
  }
}
function closeModal(id) { $(id).classList.remove('show'); }

/* CONFIRM */
function confirmAction(title, msg, onConfirm) {
  $('confirmTitle').textContent = title;
  $('confirmMsg').textContent = msg;
  const btn = $('confirmBtn');
  const clone = btn.cloneNode(true);
  btn.parentNode.replaceChild(clone, btn);
  clone.addEventListener('click', () => {
    closeModal('confirmModal');
    onConfirm();
  });
  showModal('confirmModal');
}

/* ───── SETTINGS ───── */
function openSettings() {
  $('hardcoreToggle').classList.toggle('on', state.hardcoreMode);
  $('proteinTarget').value = state.proteinTarget;
  const wt = $('waterTarget');
  if (wt) wt.value = state.waterTarget;
  showModal('settingsModal');
}

function toggleHardcore() {
  state.hardcoreMode = !state.hardcoreMode;
  S.set('hardcoreMode', state.hardcoreMode);
  $('hardcoreToggle').classList.toggle('on', state.hardcoreMode);
  toast(state.hardcoreMode ? '☠️' : '✓', state.hardcoreMode ? 'Mode Hardcore' : 'Mode normal',
    state.hardcoreMode ? 'Zéro pitié sur les skips.' : 'Mode flexible activé.');
}

function saveProteinTarget() {
  const v = parseFloat($('proteinTarget').value);
  if (!v || v < 50 || v > 400) { toast('⚠️', 'Valeur invalide', 'Entre 50 et 400g'); return; }
  state.proteinTarget = v;
  S.set('proteinTarget', v);
  toast('🥩', 'Objectif enregistré', v + 'g/jour');
  renderToday();
}

function saveWaterTarget() {
  const field = $('waterTarget');
  let v = field ? parseFloat(field.value) : 0;
  if (!v || v < 1000 || v > 6000) {
    const w = state.bodyLog?.[0]?.kg || 70;
    v = Math.round((w * 35) / 250) * 250;
  }
  state.waterTarget = v;
  S.set('waterTarget', v);
  if (field) field.value = v;
  toast('💧', 'Hydratation calibrée', v + 'ml/jour');
  renderToday();
}

/* ───── BACKUP / RESTORE ───── */
function exportData() {
  const data = { ...state, version: 2, exportDate: today() };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  a.href = url;
  a.download = `arena-backup-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('📦', 'Sauvegarde exportée', 'Fichier téléchargé');
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(k => {
        if (k !== 'version' && k !== 'exportDate' && k in state) {
          state[k] = data[k];
          S.set(k, data[k]);
        }
      });
      closeModal('settingsModal');
      toast('📂', 'Import réussi', 'Données restaurées');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      toast('⚠️', 'Fichier invalide', err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ───── RESET ───── */
function confirmReset(type) {
  const msgs = {
    stats: ['Effacer l\'historique stats ?', 'Historique, streak et totaux seront supprimés. Tes charges et runs restent.', () => {
      state.historyData = []; state.streakData = { count: 0, lastDate: '', best: 0, rankLast: '' };
      S.set('historyData', []); S.set('streakData', state.streakData);
    }],
    runs: ['Effacer tous les runs ?', 'Historique running, PRs et stats runs supprimés.', () => {
      state.runHistory = []; S.set('runHistory', []);
    }],
    all: ['⚠️ Tout réinitialiser ?', 'Cette action efface TOUT. Irréversible.', () => {
      Object.keys(localStorage).filter(k => !k.startsWith('_')).forEach(k => localStorage.removeItem(k));
      setTimeout(() => location.reload(), 300);
    }],
  };
  const [t, m, cb] = msgs[type];
  closeModal('settingsModal');
  setTimeout(() => confirmAction(t, m, () => { cb(); if (type !== 'all') { toast('✓', 'Reset effectué', ''); location.reload(); } }), 250);
}

/* ───── TOAST ───── */
function toast(icon, title, desc) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<div class="toast-icon">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-name">${desc}</div>
    </div>`;
  $('toastArea').appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

/* ───── RANK INFO ───── */
function showRankInfo() {
  const cur = getRank(state.streakData.count);
  const next = RANKS[RANKS.indexOf(cur) + 1];
  const msg = next
    ? `${state.streakData.count - cur.min}/${next.min - cur.min} jours vers ${next.name}`
    : 'Rang maximum atteint 🏆';
  toast('🎖️', cur.name, msg);
}

/* ───── INIT ───── */
function init() {
  renderToday();
  checkAchievements();
  checkRankUp();
  /* Restore last tab */
  const lastTab = S.get('lastTab', 'today');
  if (lastTab !== 'today') goTab(lastTab);

  /* Register SW */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

init();

