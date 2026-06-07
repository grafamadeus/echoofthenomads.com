// ═══════════════════════════════════════════════
// voting.js — Firebase + голосование + i18n
// ═══════════════════════════════════════════════

import { initializeApp }     from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup }
                             from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, serverTimestamp }
                             from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ════════════════════════════════════
// 🔧 НАСТРОЙКИ
// ════════════════════════════════════
const VOTE_OPEN  = new Date("2026-06-07T20:00:00+06:00");
const VOTE_CLOSE = new Date("2026-06-07T23:00:00+06:00");

const PARTICIPANTS = [
  { name: "Осмоналиева Алтынай ",        photo: "./assets/media/members/1.webp" },
  { name: "Алжанов Руслан ",         photo: "./assets/media/members/2.webp" },
  { name: "Асанбеков Өмүр и Эмир",     photo: "./assets/media/members/3.webp" },
  { name: "Хажиева Наргиза ",   photo: "./assets/media/members/4.webp" },
  { name: "Кийизбаев Тилек ",             photo: "./assets/media/members/5.webp" },
  { name: "Белоус Екатерина ",      photo: "./assets/media/members/6.webp" },
  { name: "Иманкулов Саади ",      photo: "./assets/media/members/7.webp" },
  { name: "Токтосунов Тынчтыкбек ", photo: "./assets/media/members/8.webp" },
];

const firebaseConfig = {
  apiKey: "AIzaSyBLA3dWcxxvNrXlfMtVOwWC1n3cUHORils",
  authDomain: "national-selection.firebaseapp.com",
  projectId: "national-selection",
  storageBucket: "national-selection.firebasestorage.app",
  messagingSenderId: "753183678536",
  appId: "1:753183678536:web:cbab2779087c0b8e73f87d"
};
// ════════════════════════════════════

// ════════════════════════════════════
// 🌐 ПЕРЕВОДЫ
// ════════════════════════════════════
const i18n = {
  ru: {
    logo:            "./assets/media/ru-08.webp",
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
    logo:            "./assets/media/kg-08.webp",
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
    logo:            "./assets/media/eng-08.webp",
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

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

let currentCandidate = null;
let voteCounts = {};
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
onSnapshot(collection(db, 'votes_dance'), (snapshot) => {
  voteCounts = {};
  PARTICIPANTS.forEach(p => { voteCounts[p.name] = 0; });
  snapshot.forEach(d => {
    const p = d.data().participant;
    if (voteCounts[p] !== undefined) voteCounts[p]++;
  });
  renderMembers();
});

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
onSnapshot(collection(db, 'jury_votes_dance'), (snapshot) => {
  const juryTotals = {};
  PARTICIPANTS.forEach(p => { juryTotals[p.name] = 0; });
  snapshot.forEach(d => {
    const scores = d.data().scores || {};
    Object.entries(scores).forEach(([name, score]) => {
      if (juryTotals[name] !== undefined) juryTotals[name] += score;
    });
  });
  renderJuryScores(juryTotals);
});

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

// ── Обработка после входа ──
async function handleAuth(user) {
  const t = i18n[currentLang];
  const errEl = document.getElementById('loginError');
  try {
    const voteDoc = await getDoc(doc(db, 'votes_dance', user.uid));
    if (voteDoc.exists()) {
      document.getElementById('alreadyName').textContent = voteDoc.data().participant;
      showStep('modal-already');
      return;
    }
    await setDoc(doc(db, 'votes_dance', user.uid), {
      participant: currentCandidate,
      ts:    serverTimestamp(),
      email: user.email || '',
      name:  user.displayName || ''
    });
    document.getElementById('successName').textContent = currentCandidate;
    showStep('modal-success');
  } catch (e) {
    errEl.textContent = t.error_general;
    console.error(e);
  }
}

// ── Google ──
window.signInWithGoogle = async () => {
  const btn = document.getElementById('googleBtn');
  const t = i18n[currentLang];
  btn.disabled = true;
  document.getElementById('loginError').textContent = '';
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    await handleAuth(result.user);
  } catch (e) {
    if (e.code !== 'auth/popup-closed-by-user')
      document.getElementById('loginError').textContent = t.error_auth;
  }
  btn.disabled = false;
};

// ── Инициализация ──
window.addEventListener('DOMContentLoaded', () => {
  setLang('ky');
});