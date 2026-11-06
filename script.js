document.addEventListener('DOMContentLoaded', () => {
    /* ---------- Mobile menu ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const setMenu = (open) => {
        if (!menuToggle || !navLinks) return;
        navLinks.classList.toggle('is-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.textContent = open ? '✕' : '☰';
    };
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenu(!navLinks.classList.contains('is-open'));
        });
        navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('click', (e) => { if (!navLinks.contains(e.target)) setMenu(false); });
        window.addEventListener('resize', () => { if (window.innerWidth > 920) setMenu(false); });
    }

    /* ---------- Gallery lightbox (with prev / next, swipe, arrow keys) ---------- */
    const photos = Array.from(document.querySelectorAll('.gallery-item img'));
    if (photos.length) {
        const box = document.createElement('div');
        box.className = 'lightbox';
        box.innerHTML =
            '<button class="lb-close" aria-label="Close">×</button>' +
            '<button class="lb-nav lb-prev" aria-label="Previous">‹</button>' +
            '<button class="lb-nav lb-next" aria-label="Next">›</button>' +
            '<img alt=""><p></p>';
        document.body.appendChild(box);
        const boxImg = box.querySelector('img');
        const boxCap = box.querySelector('p');
        let idx = 0;

        const show = (i) => {
            idx = (i + photos.length) % photos.length;
            const img = photos[idx];
            boxImg.src = img.src;
            boxImg.alt = img.alt;
            const cap = img.closest('.gallery-item').querySelector('.caption');
            boxCap.textContent = cap ? cap.textContent : '';
        };
        const open = (i) => { show(i); box.classList.add('open'); document.body.style.overflow = 'hidden'; };
        const close = () => { box.classList.remove('open'); document.body.style.overflow = ''; };

        photos.forEach((img, i) => img.addEventListener('click', () => open(i)));
        box.querySelector('.lb-close').addEventListener('click', close);
        box.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
        box.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
        box.addEventListener('click', (e) => { if (e.target === box) close(); });
        document.addEventListener('keydown', (e) => {
            if (!box.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(idx - 1);
            if (e.key === 'ArrowRight') show(idx + 1);
        });
        let startX = null;
        box.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        box.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
            startX = null;
        });
    }

    /* ---------- Countdown to the memorial day ---------- */
    const cd = document.getElementById('countdown');
    if (cd) {
        const target = new Date(cd.dataset.date).getTime();
        const days = Math.ceil((target - Date.now()) / 86400000);
        if (isNaN(days) || days < 0) {
            cd.hidden = true;
        } else if (days === 0) {
            cd.textContent = 'Hôm nay là ngày Giỗ Tổ • Today is the day';
        } else {
            cd.textContent = `Còn ${days} ngày • ${days} day${days > 1 ? 's' : ''} to go`;
        }
    }

    /* ---------- Back-to-top button ---------- */
    const top = document.createElement('button');
    top.className = 'to-top';
    top.setAttribute('aria-label', 'Back to top');
    top.textContent = '↑';
    document.body.appendChild(top);
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => top.classList.toggle('show', window.scrollY > 600), { passive: true });
});
