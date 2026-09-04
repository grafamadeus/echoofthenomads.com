// ════════════════════════════════════
// Echo of Nomads — public voting (self-hosted API, replaces Firebase)
// ════════════════════════════════════
const API_BASE        = "https://api.echoofthenomads.com";
const GOOGLE_CLIENT_ID = "946233553017-h64ou08icrjua955hl8esmgpe49959ll.apps.googleusercontent.com";
const POLL_MS         = 4000;

// Client-clock fallback used only until /api/results is first reached.
const VOTE_OPEN  = new Date("2026-09-02T12:00:00+06:00");
const VOTE_CLOSE = new Date("2026-09-04T23:59:00+06:00");

// Display roster: names / country / flag code / photo / draw number.
// Live vote counts, ordering and the open/closed state come from the API
// (matched by `slug` — keep slugs in sync with server/data/participants.json).
const PARTICIPANTS = [
  { slug: "elif",          name: "Avcı Dişbudak Elif",   country: "Турция",               code: "tr", number: null, photo: "./assets/media/members/elif.webp" },
  { slug: "batista",       name: "Annys Batista",        country: "Куба",                 code: "cu", number: null, photo: "./assets/media/members/batista.webp" },
  { slug: "villegas",      name: "Rodrigo Villegas",     country: "Мексика",              code: "mx", number: null, photo: "./assets/media/members/villegas.webp" },
  { slug: "roger-ricco",   name: "Roger Ricco",          country: "Бразилия",             code: "br", number: null, photo: "./assets/media/members/Roger Ricco.webp" },
  { slug: "angelov-vasil", name: "Vasil Angelov",        country: "Македония",            code: "mk", number: null, photo: "./assets/media/members/Angelov Vasil.webp" },
  { slug: "lva",           name: "LVA",                  country: "Болгария",             code: "bg", number: null, photo: "./assets/media/members/lva.webp" },
  { slug: "vika",          name: "Vika Adamyan",         country: "Армения",              code: "am", number: null, photo: "./assets/media/members/vika.webp" },
  { slug: "hodaya",        name: "Hodaya",               country: "США",                  code: "us", number: null, photo: "./assets/media/members/hodaya.webp" },
  { slug: "buga",          name: "Elena Buga",           country: "Молдова",              code: "md", number: null, photo: "./assets/media/members/buga.webp" },
  { slug: "naumenko",      name: "Tina Notte",           country: "Латвия",               code: "lv", number: null, photo: "./assets/media/members/naumenko.webp" },
  { slug: "hasanic",       name: "Benjamin Hasanić",     country: "Босния и Герцеговина",  code: "ba", number: null, photo: "./assets/media/members/hasanic.webp" },
  { slug: "leal",          name: "Dany Leal",            country: "Испания",              code: "es", number: null, photo: "./assets/media/members/leal.webp" },
  { slug: "thami",         name: "Thami Mbatha",         country: "Южная Африка",          code: "za", number: null, photo: "./assets/media/members/thami.webp" },
  { slug: "odmandakh",     name: "Odmandakh Bayaraa",    country: "Монголия",             code: "mn", number: null, photo: "./assets/media/members/odmandakh.jpeg" },
  { slug: "ngo-chau",      name: "Ngo Chau Anh",         country: "Вьетнам",              code: "vn", number: null, photo: "./assets/media/members/ngo chau.webp" },
  { slug: "zhasmin",       name: "Tleumbetova Zhasmin",  country: "Казахстан",            code: "kz", number: null, photo: "./assets/media/members/zhasmin.webp" },
  { slug: "danial",        name: "Zhumakanov Danial",    country: "Россия",               code: "ru", number: null, photo: "./assets/media/members/danial.webp" },
  { slug: "lee",           name: "Listen",               country: "Южная Корея",           code: "kr", number: null, photo: "./assets/media/members/lee.webp" },
  { slug: "derkembaev",    name: "Деркембаев Нурдөөлөт", country: "Кыргызстан",           code: "kg", number: null, photo: "./assets/media/members/derkembaev.webp" },
  { slug: "starbekov",     name: "Старбеков Рыскелди",   country: "Кыргызстан",           code: "kg", number: null, photo: "./assets/media/members/starbekov.webp" },
];

const bySlug = (slug) => PARTICIPANTS.find(p => p.slug === slug) || null;
const nameOf = (slug) => bySlug(slug)?.name || slug || "—";

// Заглушка на случай отсутствующего фото участника (силуэт в цвете акцента).
const NO_PHOTO = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 56 56%22%3E%3Crect width=%2256%22 height=%2256%22 fill=%22%231a2540%22/%3E%3Ccircle cx=%2228%22 cy=%2223%22 r=%2210%22 fill=%22%23f0c040%22/%3E%3Cpath d=%22M9 52c1-11 9-17 19-17s18 6 19 17z%22 fill=%22%23f0c040%22/%3E%3C/svg%3E";


// ════════════════════════════════════
// 🌐 ПЕРЕВОДЫ
// ════════════════════════════════════
const i18n = {
  ru: {
    logo:            "./assets/media/echo-nomad-ru.webp",
    subtitle:        "Международный конкурс",
    date_label:      "Дата:",
    date_text:       "1-6 сентября",
    place_label:     "Место:",
    place_text:      "г. Чолпон-Ата, Ипподром",
    cta_btn:         "Проголосовать",
    cd_day:          "день",
    cd_hour:         "час",
    cd_min:          "мин",
    cd_sec:          "сек",
    about_kicker:    "Echo of Nomads · 2026",
    about_title:     "О ФЕСТИВАЛЕ",
    about_text:      `Echo of Nomads станет одной из основных музыкальных площадок Всемирных игр кочевников. Фестиваль откроется 1 сентября на ипподроме в Чолпон-Ате. Помимо концертной программы, в его рамках пройдёт международный конкурс этнической песни.<br><br>В конкурсе заявлен 21 исполнитель из 20 стран. Участники представят национальные этнохиты и мировые композиции в современной интерпретации.`,
    stat_artists:    "участник",
    stat_countries:  "стран",
    stat_days:       "дня фестиваля",
    stat_categories: "категории",
    winners_kicker:  "Национальный отбор",
    sched_kicker:    "1–4 сентября · Ипподром",
    members_kicker:  "Международный конкурс",
    jurors_kicker:   "Международное жюри",
    jurors_title:    "Жюри",
    juror_chair:     "Председатель жюри",
    juror_member:    "Член жюри",
    jury_kicker:     "Оценки",
    sched_title:     "Программа фестиваля",
    sched_sub:       "Ипподром, Чолпон-Ата · 1–4 сентября 2026",
    day1_date:       "1 сентября",
    day1_title:      "Церемония открытия",
    day1_desc:       "Торжественный въезд Великого кочевья на ипподром и праздничный концерт.",
    day2_date:       "2 сентября · 18:00–23:00",
    day2_title:      "День этно-хита",
    day2_desc:       "Конкурсные выступления артистов, театрализованное представление и сеты от DJ.",
    day3_date:       "3 сентября · 18:00–23:00",
    day3_title:      "День мирового хита",
    day3_desc:       "Конкурсная программа в этой категории и выступления приглашённых гостей.",
    day4_date:       "4 сентября · 18:00–22:15",
    day4_title:      "Финал фестиваля",
    day4_desc:       "Торжественное награждение победителей и большой гала-концерт закрытия.",
    draw_note:       "2 сентября проходит жеребьёвка участников — она определяет, кто под каким номером выступает.",
    members_title:   "Участники",
    vote_time:       "Голосование открыто со 2 по 4 сентября",
    votes_label:     "Всего голосов:",
    vote_btn:        "Голосовать",
    modal_title:     "Голосование",
    modal_for:       "Голосуете за:",
    modal_hint:      "Войдите чтобы отдать голос.<br>Один аккаунт = один голос.",
    google_btn:      "Войти через Google",
    success_title:   "Голос принят!",
    success_for:     "Вы проголосовали за:",
    success_note:    "Результаты обновляются в реальном времени",
    already_title:   "Вы уже голосовали!",
    already_for:     "Ваш голос учтён за:",
    already_note:    "Повторное голосование невозможно",
    close_btn:       "Закрыть",
    alert_not_yet:   "Голосование ещё не началось. Оно откроется 2 сентября 2026 года в 12:00.",
    alert_closed:    "Голосование завершено. Спасибо за участие!",
    error_auth:      "Ошибка входа. Попробуйте снова.",
    error_general:   "Ошибка. Попробуйте снова.",
    jury_title:      "Баллы жюри",
    winners_title:   "Победители национального отбора",
    winner_audience: "Победитель приза зрительских симпатий",
    winner_jury:     "Победитель по голосованию жюри",

  },
  ky: {
    logo:            "./assets/media/echo-nomad-kg.webp",
    subtitle:        "Эл аралык сынак",
    date_label:      "Дата:",
    date_text:       "1-6-сентябрь",
    place_label:     "Өтүүчү жери:",
    place_text:      "Чолпон-Ата ш., Ипподром",
    cta_btn:         "Добуш берүү",
    cd_day:          "күн",
    cd_hour:         "саат",
    cd_min:          "мүн",
    cd_sec:          "сек",
    about_kicker:    "Echo of Nomads · 2026",
    about_title:     "ФЕСТИВАЛЬ ЖӨНҮНДӨ",
    about_text:      `Echo of Nomads Дүйнөлүк көчмөндөр оюндарынын негизги музыкалык аянтчаларынын бири болот. Фестиваль 1-сентябрда Чолпон-Ата шаарындагы ипподромдо ачылат. Концерттик программадан тышкары, анын алкагында этникалык ырдын эл аралык сынагы өткөрүлөт.<br><br>Сынакка 20 өлкөдөн 21 аткаруучу катышат. Катышуучулар улуттук этнохиттерди жана дүйнөлүк композицияларды заманбап интерпретацияда аткарышат.`,
    stat_artists:    "катышуучу",
    stat_countries:  "өлкө",
    stat_days:       "фестиваль күнү",
    stat_categories: "категория",
    winners_kicker:  "Улуттук тандоо",
    sched_kicker:    "1–4-сентябрь · Ипподром",
    members_kicker:  "Эл аралык сынак",
    jurors_kicker:   "Эл аралык калыстар тобу",
    jurors_title:    "Калыстар тобу",
    juror_chair:     "Калыстар тобунун төрагасы",
    juror_member:    "Калыстар тобунун мүчөсү",
    jury_kicker:     "Баалар",
    sched_title:     "Фестивалдын программасы",
    sched_sub:       "Ипподром, Чолпон-Ата · 2026-жылдын 1–4-сентябры",
    day1_date:       "1-сентябрь",
    day1_title:      "Ачылыш аземи",
    day1_desc:       "Улуу көчтүн ипподромго салтанаттуу кириши жана майрамдык концерт.",
    day2_date:       "2-сентябрь · 18:00–23:00",
    day2_title:      "Этно-хит күнү",
    day2_desc:       "Артисттердин сынактык чыгышы, театрлаштырылган көрсөтүү жана DJ сеттери.",
    day3_date:       "3-сентябрь · 18:00–23:00",
    day3_title:      "Дүйнөлүк хит күнү",
    day3_desc:       "Бул категориядагы сынактык программа жана чакырылган коноктордун чыгышы.",
    day4_date:       "4-сентябрь · 18:00–22:15",
    day4_title:      "Фестивалдын финалы",
    day4_desc:       "Жеңүүчүлөрдү салтанаттуу сыйлоо жана жабылуунун чоң гала-концерти.",
    draw_note:       "2-сентябрда катышуучулардын ортосунда чүчүкулак өткөрүлөт — ким кайсы номур менен чыгаары ошондо аныкталат.",
    members_title:   "Катышуучулар",
    vote_time:       "Добуш берүү 2–4-сентябрда ачык",
    votes_label:     "Жалпы добуштар:",
    vote_btn:        "Добуш берүү",
    modal_title:     "Добуш берүү",
    modal_for:       "Добушум:",
    modal_hint:      "Добуш берүү үчүн кириңиз.<br>Бир эсеп = бир добуш.",
    google_btn:      "Google менен кириңиз",
    success_title:   "Добуш кабыл алынды!",
    success_for:     "Сиз добуш бердиниз:",
    success_note:    "Жыйынтыктар реалдуу убакытта жаңыртылат",
    already_title:   "Сиз буга чейин добуш бергенсиз!",
    already_for:     "Сиздин добушуңуз эске алынды:",
    already_note:    "Кайра добуш берүү мүмкүн эмес",
    close_btn:       "Жабуу",
    alert_not_yet:   "Добуш берүү азырынча баштала элек. 2026-жылдын 1-сентябрь саат 12:00дө башталат.",
    alert_closed:    "Добуш берүү аяктады. Катышканыңыз үчүн рахмат!",
    error_auth:      "Ката. Кайра аракет кылыңыз.",
    error_general:   "Ката. Кайра аракет кылыңыз.",
    jury_title:      "Калыстар тобунун добуштары",
    winners_title:   "Улуттук тандоонун жеңүүчүлөрү",
    winner_audience: "Көрүүчүлөрдүн симпатия сыйлыгынын ээси",
    winner_jury:     "Калыстар тобунун добушу боюнча жеңүүчү",
  },
  en: {
    logo:            "./assets/media/echo-nomad-en.webp",
    subtitle:        "International Competition",
    date_label:      "Date:",
    date_text:       "September 1-6",
    place_label:     "Location:",
    place_text:      "Cholpon-Ata, Hippodrome",
    cta_btn:         "Voting",
    cd_day:          "day",
    cd_hour:         "hour",
    cd_min:          "min",
    cd_sec:          "sec",
    about_kicker:    "Echo of Nomads · 2026",
    about_title:     "ABOUT THE FESTIVAL",
    about_text:      `Echo of Nomads will become one of the main music venues of the World Nomad Games. The festival opens on September 1 at the hippodrome in Cholpon-Ata. Alongside the concert programme, it hosts an international ethnic-song competition.<br><br>21 performers from 20 countries are entered in the competition. They will present national ethno-hits and world compositions in a modern interpretation.`,
    stat_artists:    "artists",
    stat_countries:  "countries",
    stat_days:       "festival days",
    stat_categories: "categories",
    winners_kicker:  "National Selection",
    sched_kicker:    "Sept 1–4 · Hippodrome",
    members_kicker:  "International Competition",
    jurors_kicker:   "International Jury",
    jurors_title:    "The Jury",
    juror_chair:     "Jury Chair",
    juror_member:    "Jury Member",
    jury_kicker:     "Scores",
    sched_title:     "Festival Programme",
    sched_sub:       "Hippodrome, Cholpon-Ata · September 1–4, 2026",
    day1_date:       "September 1",
    day1_title:      "Opening Ceremony",
    day1_desc:       "Ceremonial entry of the Great Nomad Camp into the hippodrome and a festive concert.",
    day2_date:       "September 2 · 18:00–23:00",
    day2_title:      "Ethno-Hit Day",
    day2_desc:       "Competitive performances, a theatrical show and DJ sets.",
    day3_date:       "September 3 · 18:00–23:00",
    day3_title:      "World-Hit Day",
    day3_desc:       "Competition programme in this category and performances by invited guests.",
    day4_date:       "September 4 · 18:00–22:15",
    day4_title:      "Festival Final",
    day4_desc:       "Award ceremony for the winners and a grand closing gala concert.",
    draw_note:       "On September 2 the participants' draw takes place — it determines each performer's running order.",
    members_title:   "Participants",
    vote_time:       "Voting is open September 2–4",
    votes_label:     "Total votes:",
    vote_btn:        "Vote",
    modal_title:     "Voting",
    modal_for:       "Voting for:",
    modal_hint:      "Sign in to cast your vote.<br>One account = one vote.",
    google_btn:      "Sign in with Google",
    success_title:   "Vote accepted!",
    success_for:     "You voted for:",
    success_note:    "Results update in real time",
    already_title:   "You have already voted!",
    already_for:     "Your vote was counted for:",
    already_note:    "Re-voting is not possible",
    close_btn:       "Close",
    alert_not_yet:   "Voting has not started yet. It opens on September 1, 2026 at 12:00.",
    alert_closed:    "Voting is closed. Thank you for participating!",
    error_auth:      "Sign-in error. Please try again.",
    error_general:   "Error. Please try again.",
    jury_title:      "Jury Scores",
    winners_title:   "National Selection Winners",
    winner_audience: "Audience Choice Award Winner",
    winner_jury:     "Jury Vote Winner",

  }
};
// ════════════════════════════════════

let currentLang = 'ru';
let currentSlug = null;

// Live state from GET /api/results
const live = { ready: false, open: null, opensAt: null, closesAt: null, total: 0, counts: {} };

let myVote = null;
try { myVote = localStorage.getItem('echo_vote') || null; } catch { /* private mode */ }

// ── Применить язык ──
window.setLang = (lang) => {
  currentLang = lang;
  const t = i18n[lang];

  const logo = document.getElementById('heroLogo');
  if (logo) logo.src = t.logo;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    if (['about_text', 'modal_hint'].includes(key)) {
      el.innerHTML = t[key];
    } else {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll('.header__lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  renderMembers();
};

// ════════════════════════════════════
// API polling
// ════════════════════════════════════
async function fetchResults() {
  if (document.hidden) return;
  try {
    const res = await fetch(`${API_BASE}/api/results`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    live.open     = !!data.open;
    live.opensAt  = data.opensAt || null;
    live.closesAt = data.closesAt || null;
    live.total    = data.total || 0;
    live.counts   = {};
    for (const p of data.participants || []) {
      live.counts[p.slug] = p.votes || 0;
      const local = bySlug(p.slug);
      if (local) {
        local.id = p.id;
        if (p.number != null) local.number = p.number;
      }
    }
    live.ready = true;

    // Server has zero votes on record (e.g. after an admin reset) → drop the
    // stale local "I voted" hint so the ✓ clears itself for everyone.
    if (live.total === 0 && myVote) {
      myVote = null;
      try { localStorage.removeItem('echo_vote'); } catch { /* ignore */ }
    }

    renderMembers();
  } catch { /* keep last-known snapshot; UI stays up */ }
}

function votingOpen() {
  if (live.ready) return live.open === true;
  const now = Date.now();
  return now >= VOTE_OPEN.getTime() && now <= VOTE_CLOSE.getTime();
}
function beforeOpen() {
  const opens = live.ready && live.opensAt ? Date.parse(live.opensAt) : VOTE_OPEN.getTime();
  return Date.now() < opens;
}

// ════════════════════════════════════
// Рендер списка участников
// ════════════════════════════════════
function renderMembers() {
  const list = document.getElementById('membersList');
  if (!list) return;
  const t = i18n[currentLang];

  const rows = PARTICIPANTS.map(p => ({ ...p, votes: live.counts[p.slug] || 0 }));
  const anyVotes = rows.some(r => r.votes > 0);
  if (anyVotes) rows.sort((a, b) => b.votes - a.votes);
  const maxVotes = Math.max(1, ...rows.map(r => r.votes));
  const medals = ['🥇', '🥈', '🥉'];

  list.innerHTML = '';
  rows.forEach((p, i) => {
    const rankEl = (i < 3 && p.votes > 0)
      ? `<div class="member-medal">${medals[i]}</div>`
      : `<div class="member-rank">${i + 1}</div>`;
    const num = (p.number != null && p.number !== '')
      ? `<span class="member-num">№${p.number}</span>` : '';
    const pct = live.ready ? Math.round((p.votes / maxVotes) * 100) : 0;
    const votesLine = live.ready
      ? `${t.votes_label} <span>${p.votes}</span>`
      : `<span style="opacity:.55">…</span>`;
    // localStorage is only a hint — the server is authoritative, so the button
    // stays active (lets testers re-vote after an admin reset).
    const voted = myVote && myVote === p.slug;
    const btn = `<button class="member-vote-btn" data-slug="${p.slug}"${voted ? ' style="opacity:.7"' : ''}>${voted ? '✓ ' + t.vote_btn : t.vote_btn}</button>`;

    const row = document.createElement('div');
    row.className = 'member-row';
    row.style.animationDelay = `${i * 0.04}s`;
    row.innerHTML = `
      ${rankEl}
      <img class="member-photo" src="${p.photo}" alt="${p.name}" onerror="this.onerror=null;this.src='${NO_PHOTO}'">
      <div class="member-info">
        <div class="member-name">${num}<img class="member-flag" src="./assets/media/flags/${p.code}.svg" alt="${p.country || ''}" width="26" height="18">${p.name}</div>
        <div class="member-country">${p.country || ''}</div>
        <div class="member-votes">${votesLine}</div>
        <div class="member-bar"><i style="--pct:${pct}%"></i></div>
      </div>
      ${btn}
    `;
    list.appendChild(row);
  });

  list.querySelectorAll('.member-vote-btn[data-slug]').forEach(b => {
    b.addEventListener('click', () => window.openVoteModal(b.dataset.slug));
  });

  if (window.observeReveals) window.observeReveals();
}

// ── Баллы жюри ──
let juryTotals = {}; // slug -> { ethno, world, sum }
let juryHidden = false;

// Итоговый протокол жюри — ручной порядок призёров. Идут первыми в списке,
// вместо суммы баллов — звание. Остальные — ниже, по своим баллам.
const JURY_PROTOCOL = [
  { slug: 'derkembaev',    label: 'Гран-при' },
  { slug: 'angelov-vasil', label: 'I-место' },
  { slug: 'zhasmin',       label: 'II-место' },
  { slug: 'thami',         label: 'III-место' },
  { slug: 'ngo-chau',      label: 'III-место' },
];
const PROTOCOL_SLUGS = new Set(JURY_PROTOCOL.map(x => x.slug));

async function fetchJuryResults() {
  if (document.hidden) return;
  try {
    const res = await fetch(`${API_BASE}/api/jury/results`, { cache: 'no-store' });
    if (!res.ok) return;
    const d = await res.json();
    juryHidden = d.hidden === true;
    const e = (d.totals && d.totals.ethno) || {};
    const w = (d.totals && d.totals.world) || {};
    const next = {};
    PARTICIPANTS.forEach(p => {
      if (p.id == null) return;
      const et = (e[p.id] && e[p.id].total) || 0;
      const wt = (w[p.id] && w[p.id].total) || 0;
      next[p.slug] = { ethno: et, world: wt, sum: et + wt };
    });
    juryTotals = next;
    renderJuryScores();
  } catch { /* keep last-known */ }
}

function renderJuryScores() {
  const list = document.getElementById('juryScoresList');
  if (!list) return;

  let ordered;
  if (juryHidden) {
    ordered = PARTICIPANTS.map(p => ({ p, label: null }));
  } else {
    const proto = JURY_PROTOCOL
      .map(a => ({ p: bySlug(a.slug), label: a.label }))
      .filter(r => r.p);
    const rest = PARTICIPANTS
      .filter(p => !PROTOCOL_SLUGS.has(p.slug))
      .map(p => ({ p, label: null, sum: (juryTotals[p.slug] || {}).sum || 0 }))
      .sort((a, b) => b.sum - a.sum);
    ordered = [...proto, ...rest];
  }

  list.innerHTML = '';
  ordered.forEach(({ p, label, sum }) => {
    const row = document.createElement('div');
    row.className = 'jury-score-row';
    const isAward = !juryHidden && label != null;
    const val = juryHidden ? '<span style="opacity:.5">—</span>' : (label != null ? label : (sum ?? 0));
    row.innerHTML = `
      <img class="member-photo" src="${p.photo}" alt="${p.name}" onerror="this.onerror=null;this.src='${NO_PHOTO}'">
      <div class="member-info">
        <div class="member-name"><img class="member-flag" src="./assets/media/flags/${p.code}.svg" alt="${p.country || ''}" width="26" height="18">${p.name}</div>
      </div>
      <div class="jury-score-val${isAward ? ' jury-score-val--award' : ''}">${val}</div>
    `;
    list.appendChild(row);
  });
}

// ════════════════════════════════════
// Google Identity Services
// ════════════════════════════════════
let gsiReady = false;

function initGsi() {
  if (!window.google || !google.accounts || !google.accounts.id) {
    return void setTimeout(initGsi, 150);
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: onGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  gsiReady = true;
}

function renderGsiButton() {
  const el = document.getElementById('gsiButton');
  if (!el) return;
  if (!gsiReady) { el.textContent = '…'; return void setTimeout(renderGsiButton, 200); }
  el.innerHTML = '';
  google.accounts.id.renderButton(el, {
    theme: 'filled_blue',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    locale: currentLang,
    width: 260,
  });
}

async function onGoogleCredential(resp) {
  const t = i18n[currentLang];
  const credential = resp && resp.credential;
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  if (!credential || !currentSlug) return;

  try {
    const res = await fetch(`${API_BASE}/api/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant: currentSlug, credential }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      setMyVote(currentSlug);
      document.getElementById('successName').textContent = nameOf(currentSlug);
      showStep('modal-success');
      fetchResults();
    } else if (res.status === 409 && data.error === 'already_voted') {
      if (data.participant) setMyVote(data.participant);
      document.getElementById('alreadyName').textContent = nameOf(data.participant || currentSlug);
      showStep('modal-already');
      fetchResults();
    } else if (res.status === 403) {
      alert(data.error === 'not_open' ? t.alert_not_yet : t.alert_closed);
      closeModal();
      fetchResults();
    } else if (res.status === 400 || res.status === 401) {
      if (errEl) errEl.textContent = t.error_auth;
    } else {
      if (errEl) errEl.textContent = t.error_general;
    }
  } catch {
    if (errEl) errEl.textContent = t.error_general;
  }
}

function setMyVote(slug) {
  myVote = slug;
  try { localStorage.setItem('echo_vote', slug); } catch { /* ignore */ }
  renderMembers();
}

// ════════════════════════════════════
// Модалка
// ════════════════════════════════════
function showStep(id) {
  document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function openModal() {
  document.getElementById('voteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.closeModal = () => {
  document.getElementById('voteModal').classList.remove('open');
  document.body.style.overflow = '';
};

window.handleOverlayClick = (e) => {
  if (e.target.id === 'voteModal') window.closeModal();
};

window.openVoteModal = (slug) => {
  const t = i18n[currentLang];

  if (!votingOpen()) {
    alert(beforeOpen() ? t.alert_not_yet : t.alert_closed);
    return;
  }

  // Always go through sign-in — the server decides if this identity has
  // already voted (returns 409 with the real prior choice). Not gating on
  // localStorage means an admin reset lets people vote again cleanly.
  openModal();
  currentSlug = slug;
  document.getElementById('candidateName').textContent = nameOf(slug);
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  showStep('modal-login');
  renderGsiButton();
};

// legacy hook (old inline onclick referenced this) — no-op guard
window.signInWithGoogle = () => {};

// ── Инициализация ──
window.addEventListener('DOMContentLoaded', () => {
  setLang('ky');
  renderJuryScores();
  fetchResults().then(fetchJuryResults);   // /api/results first — it fills participant ids
  setInterval(fetchResults, POLL_MS);
  setInterval(fetchJuryResults, POLL_MS);
  initGsi();
});
