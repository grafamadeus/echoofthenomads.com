const target = new Date('2026-09-01T20:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    document.getElementById('cd-days').textContent  = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent  = pad(mins);
    document.getElementById('cd-secs').textContent  = pad(secs);
}

tick();
setInterval(tick, 1000);

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
        behavior: 'smooth'
        });
    }
    });
});

// ── Scroll reveal ──
const revealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 })
    : null;

// exposed so voting.js can re-scan after it renders participant/jury rows
window.observeReveals = function () {
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!revealObserver) {
        els.forEach(el => el.classList.add('is-visible'));
        return;
    }
    els.forEach(el => revealObserver.observe(el));
};

// ── Ridge parallax (subtle, clipped inside the hero) ──
function updateRidge() {
    const y = Math.min(window.scrollY, 500);
    document.querySelectorAll('.ridge').forEach(ridge => {
        const k = parseFloat(ridge.dataset.parallax || '0.15');
        ridge.style.transform = 'translateY(' + (y * k) + 'px)';
    });
}
window.addEventListener('scroll', updateRidge, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    window.observeReveals();
    updateRidge();
});