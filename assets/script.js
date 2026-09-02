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
    const hash = this.getAttribute('href');
    if (hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    // computed offset + window.scrollTo — reliable on mobile where
    // scrollIntoView can no-op depending on the scroll container
    const y = target.getBoundingClientRect().top + window.pageYOffset - 8;
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', hash);
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

// ── Ridge parallax — each layer drifts at its own rate, clipped inside the hero ──
const reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
function updateRidge() {
    if (reduceMotion) return;
    const y = Math.min(window.scrollY, 700);
    document.querySelectorAll('.ridge__layer').forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || '0.1');
        layer.style.setProperty('--px', (y * depth) + 'px');
    });
}
window.addEventListener('scroll', updateRidge, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
    window.observeReveals();
    updateRidge();
});