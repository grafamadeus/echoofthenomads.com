// ════════════════════════════════════
// ПЕРЕВОДЫ
// ════════════════════════════════════
const i18n = {
    ky: {
    tag:            "Дүйнөлүк көчмөндөр оюндары 2026",
    title_line1:    "Улуттук",
    title_line2:    "тандоо",
    subtitle:       "Echo of Nomads",
    date_label:     "Дата:",
    date_text:       "1-июнь",
    place_label:     "Өтүүчү жери:",
    place_text:      "УТРК",
    contests_label: "Конкурстар",
    contests_title: "Конкурсту тандаңыз",
    national_sub:   "Улуттук тандоо",
    },
    ru: {
    tag:            "Всемирные игры кочевников 2026",
    title_line1:    "Национальный",
    title_line2:    "отбор",
    subtitle:       "Echo of Nomads",
    date_label:     "Дата",
    date_text:       "1-июнь",
    place_label:    "Место:",
    place_text:      "НТРК",
    contests_label: "Конкурсы",
    contests_title: "Выберите конкурс",
    national_sub:   "Национальный отбор",
    },
    en: {
    tag:            "World Nomad Games 2026",
    title_line1:    "National",
    title_line2:    "Selection",
    subtitle:       "Echo of Nomads",
    date_label:     "Date:",
    date_text:       "June 1",
    place_label:    "Location:",
    place_text:      "UTRK",
    contests_label: "Contests",
    contests_title: "Choose a contest",
    national_sub:   "National Selection",
    }
};

// ════════════════════════════════════
// КОНКУРСЫ
// ════════════════════════════════════
const contests = [
    {
    ky: "КӨЧМӨНДӨР ЖАҢЫРЫГЫ",
    ru: "ЭХО КОЧЕВНИКОВ",
    en: "ECHO OF NOMADS",
    url: "./echo-nomad/index.html",
    emoji: "1<br>июнь"
    },
    {
    ky: "АВАЗДЫК-АСПАПЧЫЛЫК БАГЫТЫ",
    ru: "ВОКАЛЬНО-ИНСТРУМЕНТАЛЬНОЕ ИСКУССТВО",
    en: "VOCAL-INSTRUMENTAL PERFORMANCE",
    url: "./voc-ins-per/index.html",
    emoji: "2<br>июнь"
    },
    {
    ky: "АСПАПЧЫЛЫК БАГЫТЫ",
    ru: "ИНСТРУМЕНТАЛЬНОЕ ИСКУССТВО",
    en: "INSTRUMENTAL PERFORMANCE",
    url: "./instrument/index.html",
    emoji: "3<br>июнь"
    },
    {
    ky: "АЙТУУЧУЛУК БАГЫТЫ",
    ru: "СКАЗИТЕЛЬСКОЕ ИСКУССТВО",
    en: "EPIC STORYTELLING",
    url: "./story/index.html",
    emoji: "4<br>июнь"
    },
    {
    ky: "УРБАН НОМАД",
    ru: "УРБАН НОМАД",
    en: "URBAN NOMAD",
    url: "./urban",
    emoji: "5<br>июнь"
    },
    {
    ky: "КӨЧМӨН ЖЫЛДЫЗДАРЫ",
    ru: "НОМАД СТАРС",
    en: "NOMAD STARS",
    url: "#",
    emoji: "6<br>июнь"
    },
    {
    ky: "ЭТНО-БИЙ",
    ru: "ЭТНО-ТАНЕЦ",
    en: "ETHNIC DANCE",
    url: "#",
    emoji: "7<br>июнь"
    },
    
];

let currentLang = 'ky';

function renderContests() {
    const grid = document.getElementById('contestsGrid');
    const t = i18n[currentLang];
    grid.innerHTML = '';
    contests.forEach((c, i) => {
    const a = document.createElement('a');
    a.href = c.url;
    a.className = 'contest-card';
    a.innerHTML = `
        <div class="contest-card__num">${c.emoji}</div>
        <div class="contest-card__info">
        <div class="contest-card__name">${c[currentLang]}</div>
        <div class="contest-card__sub">${t.national_sub}</div>
        </div>
        <div class="contest-card__arrow">→</div>
    `;
    grid.appendChild(a);
    });
}

window.setLang = (lang) => {
    currentLang = lang;
    const t = i18n[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('.header__lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    renderContests();
};

// Инициализация
setLang('ky');