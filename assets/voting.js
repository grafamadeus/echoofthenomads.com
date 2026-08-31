
const VOTE_OPEN  = new Date("2026-09-02T12:00:00+06:00");
const VOTE_CLOSE = new Date("2026-09-04T23:59:00+06:00");

// Международный конкурс этнической песни — 21 участник из 20 стран.
// number — номер выступления. Назначается по итогам жеребьёвки 2 сентября:
// проставь число вместо null, порядок в массиве менять не нужно.
// code — ISO-код страны, флаг берётся из ./assets/media/flags/<code>.svg
const PARTICIPANTS = [
  { name: "Avcı Dişbudak Elif",                   country: "Турция",               code: "tr", number: null, photo: "./assets/media/members/Avci Disbudak Elif.webp" },
  { name: "Batista Gonzalez Annys Maria",         country: "Куба",                 code: "cu", number: null, photo: "./assets/media/members/Batista Gonzalez Annys Maria.webp" },
  { name: "Rodrigo Villegas Badillo",             country: "Мексика",              code: "mx", number: null, photo: "./assets/media/members/Rodrigo Villegas Badillo.webp" },
  { name: "Bukilić Milan",                        country: "Черногория",           code: "me", number: null, photo: "./assets/media/members/Bukilic Milan.webp" },
  { name: "Rogerio Pereira da Silva",             country: "Бразилия",             code: "br", number: null, photo: "./assets/media/members/Rogerio Pereira da Silva.webp" },
  { name: "Angelov Vasil",                        country: "Македония",            code: "mk", number: null, photo: "./assets/media/members/Angelov Vasil.webp" },
  { name: "Krasteva Preslava Koleva",             country: "Болгария",             code: "bg", number: null, photo: "./assets/media/members/Krasteva Preslava Koleva.webp" },
  { name: "Adamyan Vika",                         country: "Армения",              code: "am", number: null, photo: "./assets/media/members/Adamyan Vika.webp" },
  { name: "Ben Chimol Hodia",                     country: "США",                  code: "us", number: null, photo: "./assets/media/members/Ben Chimol Hodia.webp" },
  { name: "Buga Elena",                           country: "Молдова",              code: "md", number: null, photo: "./assets/media/members/Buga Elena.webp" },
  { name: "Naumenko Kristīna",                    country: "Латвия",               code: "lv", number: null, photo: "./assets/media/members/Naumenko Kristina.webp" },
  { name: "Hasanić Benjamin",                     country: "Босния и Герцеговина",  code: "ba", number: null, photo: "./assets/media/members/Hasanic Benjamin.webp" },
  { name: "Clavijo Leal Carlos Daniel",          country: "Испания",              code: "es", number: null, photo: "./assets/media/members/Clavijo Leal Carlos Daniel.webp" },
  { name: "Mbatha Thamsanqa Samukelo Righteous", country: "Южная Африка",          code: "za", number: null, photo: "./assets/media/members/Mbatha Thamsanqa Samukelo Righteous.webp" },
  { name: "Odmandakh Bayaraa",                    country: "Монголия",             code: "mn", number: null, photo: "./assets/media/members/Odmandakh Bayaraa.webp" },
  { name: "Ngo Chau Anh",                         country: "Вьетнам",              code: "vn", number: null, photo: "./assets/media/members/Ngo Chau Anh.webp" },
  { name: "Tleumbetova Zhasmin",                  country: "Казахстан",            code: "kz", number: null, photo: "./assets/media/members/Tleumbetova Zhasmin.webp" },
  { name: "Zhumakanov Danial",                    country: "Россия",               code: "ru", number: null, photo: "./assets/media/members/Zhumakanov Danial.webp" },
  { name: "Lee Seung Tae",                        country: "Южная Корея",           code: "kr", number: null, photo: "./assets/media/members/Lee Seung Tae.webp" },
  { name: "Деркембаев Нурдөөлөт",                 country: "Кыргызстан",           code: "kg", number: null, photo: "./assets/media/members/ДОКУ.webp" },
  { name: "Старбеков Рыскелди",                   country: "Кыргызстан",           code: "kg", number: null, photo: "./assets/media/members/Старбеков Рыскелди.webp" },
];

// Заглушка на случай отсутствующего фото участника (силуэт в цвете акцента).
const NO_PHOTO = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 56 56%22%3E%3Crect width=%2256%22 height=%2256%22 fill=%22%231a2540%22/%3E%3Ccircle cx=%2228%22 cy=%2223%22 r=%2210%22 fill=%22%23f0c040%22/%3E%3Cpath d=%22M9 52c1-11 9-17 19-17s18 6 19 17z%22 fill=%22%23f0c040%22/%3E%3C/svg%3E";


// ════════════════════════════════════

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

let currentCandidate = null;
let currentLang = 'ru';

// ── Применить язык ──
window.setLang = (lang) => {
  currentLang = lang;
  const t = i18n[lang];

  // Логотип hero
  const logo = document.getElementById('heroLogo');
  if (logo) logo.src = t.logo;

  // Все data-i18n элементы
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    if (['about_text', 'modal_hint'].includes(key)) {
      el.innerHTML = t[key];
    } else {
      el.textContent = t[key];
    }
  });

  // Активная кнопка языка
  document.querySelectorAll('.header__lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Перерисовать участников с новым языком
  renderMembers();
};

// ── Реальное время голосов ──
// Обнулено к международному конкурсу. Голосование открывается 2 сентября.
// Формат: "Имя участника": число голосов.
const voteCounts = {};

// ── Рендер списка участников ──
function renderMembers() {
  const list = document.getElementById('membersList');
  if (!list) return;
  const t = i18n[currentLang];

  const sorted = [...PARTICIPANTS].sort((a, b) =>
    (voteCounts[b.name] || 0) - (voteCounts[a.name] || 0)
  );

  const maxVotes = Math.max(1, ...Object.values(voteCounts).map(Number));

  list.innerHTML = '';
  sorted.forEach((p, i) => {
    const votes  = voteCounts[p.name] || 0;
    const medals = ['🥇', '🥈', '🥉'];
    const rankEl = (i < 3 && votes > 0)
      ? `<div class="member-medal">${medals[i]}</div>`
      : `<div class="member-rank">${i + 1}</div>`;
    const num    = (p.number != null && p.number !== '')
      ? `<span class="member-num">№${p.number}</span>` : '';
    const pct    = Math.round((votes / maxVotes) * 100);

    const row = document.createElement('div');
    row.className = 'member-row';
    row.style.animationDelay = `${i * 0.05}s`;
    row.innerHTML = `
      ${rankEl}
      <img class="member-photo" src="${p.photo}" alt="${p.name}" onerror="this.onerror=null;this.src='${NO_PHOTO}'">
      <div class="member-info">
        <div class="member-name">${num}<img class="member-flag" src="./assets/media/flags/${p.code}.svg" alt="${p.country || ''}" width="26" height="18">${p.name}</div>
        <div class="member-country">${p.country || ''}</div>
        <div class="member-votes">${t.votes_label} <span>${votes}</span></div>
        <div class="member-bar"><i style="--pct:${pct}%"></i></div>
      </div>
      <button class="member-vote-btn" onclick="openVoteModal('${p.name}')">${t.vote_btn}</button>
    `;
    list.appendChild(row);
  });

  if (window.observeReveals) window.observeReveals();
}

// ── Жюри баллары ──
// Обнулено к международному конкурсу. Формат: "Имя участника": сумма баллов.
const juryTotals = {};

function renderJuryScores(juryTotals) {
  const list = document.getElementById('juryScoresList');
  if (!list) return;
  list.innerHTML = '';
  PARTICIPANTS.forEach(p => {
    const row = document.createElement('div');
    row.className = 'jury-score-row';
    row.innerHTML = `
      <img class="member-photo" src="${p.photo}" alt="${p.name}" onerror="this.onerror=null;this.src='${NO_PHOTO}'">
      <div class="member-name"><img class="member-flag" src="./assets/media/flags/${p.code}.svg" alt="${p.country || ''}" width="26" height="18">${p.name}</div>
      <div class="jury-score-val">${juryTotals[p.name] || 0}</div>
    `;
    list.appendChild(row);
  });
}

// ── Шаги модалки ──
function showStep(id) {
  document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Открыть модалку ──
window.openVoteModal = (candidate) => {
  const now = new Date();
  const t = i18n[currentLang];
  if (now < VOTE_OPEN)  { alert(t.alert_not_yet); return; }
  if (now > VOTE_CLOSE) { alert(t.alert_closed);  return; }
  currentCandidate = candidate;
  document.getElementById('candidateName').textContent = candidate;
  document.getElementById('loginError').textContent = '';
  showStep('modal-login');
  document.getElementById('voteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
};

// ── Закрыть модалку ──
window.closeModal = () => {
  document.getElementById('voteModal').classList.remove('open');
  document.body.style.overflow = '';
};

window.handleOverlayClick = (e) => {
  if (e.target.id === 'voteModal') window.closeModal();
};



// ── Инициализация ──
window.addEventListener('DOMContentLoaded', () => {
  setLang('ky');
  renderMembers();
  renderJuryScores(juryTotals);
});