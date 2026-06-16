
const VOTE_OPEN  = new Date("2026-06-07T20:00:00+06:00");
const VOTE_CLOSE = new Date("2026-06-07T21:00:00+06:00");

const PARTICIPANTS = [
  { name: "Курманжан Абдыкалыкова <br> «12 Жамбы»",        photo: "./assets/media/members/1.webp" },
  { name: "Арзубек Вонама <br>«Падышалык мурас»",         photo: "./assets/media/members/2.webp" },
  { name: "Нурбекова А., Сүйөркул кызы Б., Муктарбек кызы А.<br>«Башат изи»",     photo: "./assets/media/members/3.webp" },
  { name: "Сара Машарипова<br>«Мурастын коду»",   photo: "./assets/media/members/4.webp" },
  { name: "Анипа Кадыракунова, Медина Нуркасым кызы<br>«Заман белгилери»",             photo: "./assets/media/members/5.webp" },
  { name: "Озодбек Дадабаев<br>«Алп Кара Куш»",      photo: "./assets/media/members/6.webp" },
  { name: "Аспандияр Жаныбеков<br>«Көрк»",      photo: "./assets/media/members/7.webp" },
  { name: "Альбина Дайырова<br>«Илбирстин изи менен»", photo: "./assets/media/members/8.webp" },
  { name: "Каныкей Батырова<br>«Жети облустун мурасы»",     photo: "./assets/media/members/9.webp" },
  { name: "Аяна Алымкулова<br>«Renaissance of KRSU»",     photo: "./assets/media/members/10.webp" },
  { name: "Элиза Шамшиева<br>«Аккула»",     photo: "./assets/media/members/11.webp" },
  { name: "Перизат Майрамбекова<br>«Асмандагы  кызгалдактар»",     photo: "./assets/media/members/12.webp" },
  { name: "Жанара Эсенбек кызы<br>«Сүт Ээси»",     photo: "./assets/media/members/13.webp" },
  { name: "Коллективная работа АИК<br>«Бугу Эне» ",     photo: "./assets/media/members/14.webp" },
  { name: "Заманбекова А., Сеиткулова Н., Пирматова З.<br>«Нео номад» ",     photo: "./assets/media/members/15.webp" },
];


// ════════════════════════════════════

// ════════════════════════════════════
// 🌐 ПЕРЕВОДЫ
// ════════════════════════════════════
const i18n = {
  ru: {
    logo:            "./assets/media/ru-05.webp",
    subtitle:        "Национальный отбор",
    date_label:      "Дата:",
    date_text:       "7-июнь",
    place_label:     "Место:",
    place_text:      "НТРК",
    cta_btn:         "Проголосовать",
    cd_day:          "день",
    cd_hour:         "час",
    cd_min:          "мин",
    cd_sec:          "сек",
    vote_time:       "Голосование доступно с 20:00 до конца мероприятия",
    about_title:     "О ФЕСТИВАЛЕ",
    about_text:      `Конкурс проводится в два этапа и в сроки, установленные Организатором:<br><br>
                     <span class="bold">I этап</span> – отборочный (национальный уровень):<br>
                     Уполномоченный государственный орган номинирует одного участника для участия в Конкурсе.<br><br>
                     <span class="bold">II этап</span> – финальный тур и награждение:<br>
                     Участники получают официальное именное приглашение и подают документы согласно Приложению №1.`,
    nation_title:    "Национальный отбор",
    nation_sub:      "Национальный отбор проводится в три этапа:",
    stage1_title:    "Приём заявок",
    stage1_desc:     "Заявки принимаются до 25-мая 2026 г.",
    stage2_title:    "Отборочный тур",
    stage2_desc:     "Проводится на основании видеоматериалов участников.",
    stage3_title:    "Финальный этап",
    stage3_desc:     "Финальное прослушивание и определение победителей (1-7-июня 2026 г.)",
    members_title:   "Участники",
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
    alert_not_yet:   "Голосование ещё не началось. Оно откроется 7 июня 2026 года в 20:00.",
    alert_closed:    "Голосование завершено. Спасибо за участие!",
    error_auth:      "Ошибка входа. Попробуйте снова.",
    error_general:   "Ошибка. Попробуйте снова.",
    jury_title:      "Баллы жюри",
    
  },
  ky: {
    logo:            "./assets/media/kg-05.webp",
    subtitle:        "Улуттук тандоо",
    date_label:      "Дата:",
    date_text:       "7-июнь",
    place_label:     "Өтүүчү жери:",
    place_text:      "УТРК",
    cta_btn:         "Добуш берүү",
    cd_day:          "күн",
    cd_hour:         "саат",
    cd_min:          "мүн",
    cd_sec:          "сек",
    vote_time:       "Добуш берүү 20:00дөн сынактын аягына чейин жүрөт",
    about_title:     "ФЕСТИВАЛЬ ЖӨНҮНДӨ",
    about_text:      `Конкурс эки этапта, уюштуруучу тарабынан белгиленген мөөнөттө өткөрүлөт:<br><br>
                     <span class="bold">I этап</span> – Квалификациялык раунд (Улуттук деңгээл):<br>
                     Ыйгарым укуктуу мамлекеттик орган Сынакка катышуу үчүн бир катышуучуну тандайт.<br><br>
                     <span class="bold">II этап</span> – Финалдык раунд жана сыйлыктарды тапшыруу аземи:<br>
                     Катышуучулар финалдык турга расмий жеке чакыруу алышат жана №1 тиркемеге ылайык документтерди тапшырышат.`,
    nation_title:    "Улуттук тандоо",
    nation_sub:      "Улуттук тандоо үч этап менен өткөрүлөт:",
    stage1_title:    "Арыз берүү",
    stage1_desc:     "Арыздар 2026-жылдын 25-майына чейин кабыл алынат.",
    stage2_title:    "Тандоо туру",
    stage2_desc:     "Катышуучулардын видеоматериалдарынын негизинде өткөрүлдү.",
    stage3_title:    "Финалдык этап",
    stage3_desc:     "Акыркы аудит жана жеңүүчүлөрдү тандоо (2026-жылдын 1-7-июну)",
    members_title:   "Катышуучулар",
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
    alert_not_yet:   "Добуш берүү азырынча баштала элек. 2026-жылдын 7-июнунда саат 20:00дө башталат.",
    alert_closed:    "Добуш берүү аяктады. Катышканыңыз үчүн рахмат!",
    error_auth:      "Ката. Кайра аракет кылыңыз.",
    error_general:   "Ката. Кайра аракет кылыңыз.",
    jury_title:      "Калыстар тобунун добуштары",
  },
  en: {
    logo:            "./assets/media/eng-05.webp",
    subtitle:        "National Selection",
    date_label:      "Date:",
    date_text:       "June 7",
    place_label:     "Location:",
    place_text:      "UTRK",
    cta_btn:         "Voting",
    cd_day:          "day",
    cd_hour:         "hour",
    cd_min:          "min",
    cd_sec:          "sec",
    vote_time:       "Voting is available from 20:00 till the end of competition",
    about_title:     "ABOUT THE FESTIVAL",
    about_text:      `The competition is held in two stages within the deadlines set by the Organizer:<br><br>
                     <span class="bold">Stage I</span> – Qualifying Round (National Level):<br>
                     The authorized state body nominates one participant to take part in the Competition.<br><br>
                     <span class="bold">Stage II</span> – Final Round and Award Ceremony:<br>
                     Participants receive an official personal invitation to the final round and submit documents according to Appendix No.1.`,
    nation_title:    "National Selection",
    nation_sub:      "The national selection is held in three stages:",
    stage1_title:    "Applications",
    stage1_desc:     "Applications are accepted until May 25, 2026.",
    stage2_title:    "Qualifying Round",
    stage2_desc:     "Conducted based on video materials submitted by participants.",
    stage3_title:    "Final Stage",
    stage3_desc:     "Final audition and winner selection (June 1-7, 2026)",
    members_title:   "Participants",
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
    alert_not_yet:   "Voting has not started yet. It opens on June 7, 2026 at 20:00.",
    alert_closed:    "Voting is closed. Thank you for participating!",
    error_auth:      "Sign-in error. Please try again.",
    error_general:   "Error. Please try again.",
    jury_title:      "Jury Scores",

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
const voteCounts = {
  "Курманжан Абдыкалыкова <br> «12 Жамбы»": 316,
  "Арзубек Вонама <br>«Падышалык мурас»": 59,
  "Нурбекова А., Сүйөркул кызы Б., Муктарбек кызы А.<br>«Башат изи»": 112,
  "Сара Машарипова<br>«Мурастын коду»": 184,
  "Анипа Кадыракунова, Медина Нуркасым кызы<br>«Заман белгилери»": 68,
  "Озодбек Дадабаев<br>«Алп Кара Куш»": 46,
  "Аспандияр Жаныбеков<br>«Көрк»": 339,
  "Альбина Дайырова<br>«Илбирстин изи менен»": 106,
  "Каныкей Батырова<br>«Жети облустун мурасы»": 343,
  "Аяна Алымкулова<br>«Renaissance of KRSU»": 779,
  "Элиза Шамшиева<br>«Аккула»": 44,
  "Перизат Майрамбекова<br>«Асмандагы  кызгалдактар»": 254,
  "Жанара Эсенбек кызы<br>«Сүт Ээси»": 34,
  "Коллективная работа АИК<br>«Бугу Эне» ": 795,
  "Заманбекова А., Сеиткулова Н., Пирматова З.<br>«Нео номад» ": 494,
};

// ── Рендер списка участников ──
function renderMembers() {
  const list = document.getElementById('membersList');
  if (!list) return;
  const t = i18n[currentLang];

  const sorted = [...PARTICIPANTS].sort((a, b) =>
    (voteCounts[b.name] || 0) - (voteCounts[a.name] || 0)
  );

  list.innerHTML = '';
  sorted.forEach((p, i) => {
    const votes  = voteCounts[p.name] || 0;
    const medals = ['🥇', '🥈', '🥉'];
    const rank   = i < 3 ? medals[i] : `${i + 1}`;

    const row = document.createElement('div');
    row.className = 'member-row';
    row.style.animationDelay = `${i * 0.05}s`;
    row.innerHTML = `
      <div class="member-rank">${rank}</div>
      <img class="member-photo" src="${p.photo}" alt="${p.name}">
      <div class="member-info">
        <div class="member-name">${p.name}</div>
        <div class="member-votes">${t.votes_label} <span>${votes}</span></div>
      </div>
      <button class="member-vote-btn" onclick="openVoteModal('${p.name}')">${t.vote_btn}</button>
    `;
    list.appendChild(row);
  });
}

// ── Жюри баллары ──
const juryTotals = {
  "Курманжан Абдыкалыкова <br> «12 Жамбы»": 17,
  "Арзубек Вонама <br>«Падышалык мурас»": 20,
  "Нурбекова А., Сүйөркул кызы Б., Муктарбек кызы А.<br>«Башат изи»": 18,
  "Сара Машарипова<br>«Мурастын коду»": 20,
  "Анипа Кадыракунова, Медина Нуркасым кызы<br>«Заман белгилери»": 23,
  "Озодбек Дадабаев<br>«Алп Кара Куш»": 29,
  "Аспандияр Жаныбеков<br>«Көрк»": 28,
  "Альбина Дайырова<br>«Илбирстин изи менен»": 22,
  "Каныкей Батырова<br>«Жети облустун мурасы»": 15,
  "Аяна Алымкулова<br>«Renaissance of KRSU»": 22,
  "Элиза Шамшиева<br>«Аккула»": 21,
  "Перизат Майрамбекова<br>«Асмандагы  кызгалдактар»": 17,
  "Жанара Эсенбек кызы<br>«Сүт Ээси»": 20,
  "Коллективная работа АИК<br>«Бугу Эне» ": 20,
  "Заманбекова А., Сеиткулова Н., Пирматова З.<br>«Нео номад» ": 19,
};

function renderJuryScores(juryTotals) {
  const list = document.getElementById('juryScoresList');
  if (!list) return;
  list.innerHTML = '';
  PARTICIPANTS.forEach(p => {
    const row = document.createElement('div');
    row.className = 'jury-score-row';
    row.innerHTML = `
      <img class="member-photo" src="${p.photo}" alt="${p.name}">
      <div class="member-name">${p.name}</div>
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