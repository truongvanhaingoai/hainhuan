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
        navLinks.querySelectorAll('a').forEach((a) =>
            a.addEventListener('click', () => setMenu(false))
        );
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target)) setMenu(false);
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenu(false);
        });
    }

    /* ---------- Gallery lightbox ---------- */
    const photos = document.querySelectorAll('.gallery-item img');
    if (photos.length) {
        const box = document.createElement('div');
        box.className = 'lightbox';
        box.innerHTML = '<button aria-label="Close">×</button><img alt=""><p></p>';
        document.body.appendChild(box);
        const boxImg = box.querySelector('img');
        const boxCap = box.querySelector('p');
        const close = () => box.classList.remove('open');

        photos.forEach((img) =>
            img.addEventListener('click', () => {
                boxImg.src = img.src;
                boxImg.alt = img.alt;
                const cap = img.closest('.gallery-item').querySelector('.caption');
                boxCap.textContent = cap ? cap.textContent : '';
                box.classList.add('open');
            })
        );
        box.addEventListener('click', close);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
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
});
