(function () {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



            /* TERMINAL LOADER */
            const loader = document.querySelector('.terminal-loader');
            const termLines = loader.querySelectorAll('.term span');
            let d = 0;
            termLines.forEach((line, i) => {
                d += 400 + i * 300;
                setTimeout(() => { line.style.opacity = '1'; line.style.transition = 'opacity .3s' }, d);
            });
            setTimeout(() => { loader.classList.add('done'); document.body.style.overflow = 'auto'; initReveals() }, d + 800);

            /* TEXT SCRAMBLE */
            class Scrambler {
                constructor(el) { this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#_01'; this.og = el.textContent; this.queue = []; this.frame = 0; this.running = false }
                setText(t) { const l = Math.max(this.og.length, t.length); this.queue = []; for (let i = 0; i < l; i++) { const from = this.og[i] || ''; const to = t[i] || ''; const s = Math.floor(Math.random() * 30); const e = s + Math.floor(Math.random() * 30); this.queue.push({ from, to, s, e }) } cancelAnimationFrame(this.raf); this.frame = 0; this.running = true; this.update() }
                update() { let o = ''; let done = true; for (let i = 0; i < this.queue.length; i++) { let { from, to, s, e, c } = this.queue[i]; if (this.frame >= e) { o += to } else if (this.frame >= s) { done = false; if (!c || Math.random() < .28) { c = this.chars[Math.floor(Math.random() * this.chars.length)]; this.queue[i].c = c } o += `<span style="color:var(--accent);opacity:.7">${c}</span>` } else { done = false; o += from } } this.el.innerHTML = o; if (!done) { this.frame++; this.raf = requestAnimationFrame(() => this.update()) } else { this.running = false } }
            }
            setTimeout(() => { document.querySelectorAll('.scramble').forEach(el => { const s = new Scrambler(el); s.setText(el.textContent) }) }, d + 400);

            /* TYPEWRITER */
            const roles = ['Cybersecurity Developer', 'Python Engineer', 'Problem Solver', 'Network Analyst'];
            const tw = document.querySelector('.typewriter');
            let ri = 0, ci = 0, del = false;
            function typewrite() {
                if (!tw) return;
                const word = roles[ri];
                if (!del) { tw.textContent = word.slice(0, ci + 1); ci++; if (ci >= word.length) { setTimeout(() => { del = true; typewrite() }, 2000); return } }
                else { tw.textContent = word.slice(0, ci - 1); ci--; if (ci <= 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(() => typewrite(), 400); return } }
                setTimeout(typewrite, del ? 40 : 80);
            }
            setTimeout(typewrite, d + 1000);

            /* SCROLL PROGRESS */
            const prog = document.querySelector('.scroll-progress');
            window.addEventListener('scroll', () => { const h = document.documentElement; const pct = h.scrollTop / (h.scrollHeight - h.clientHeight); prog.style.transform = `scaleX(${pct})` }, { passive: true });

            /* NAV SCROLL */
            const nav = document.querySelector('nav');
            window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 50) }, { passive: true });

            /* MOBILE MENU */
            const menuBtn = document.querySelector('.menu-btn');
            const navLinks = document.querySelector('.nav-links');
            menuBtn.addEventListener('click', () => { navLinks.classList.toggle('open'); const spans = menuBtn.querySelectorAll('span'); if (navLinks.classList.contains('open')) { spans[0].style.transform = 'rotate(45deg) translate(5px,5px)'; spans[1].style.opacity = '0'; spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)' } else { spans.forEach(s => { s.style.transform = ''; s.style.opacity = '' }) } });
            navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { navLinks.classList.remove('open'); menuBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '' }) }));

            /* SMOOTH SCROLL */
            function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 1) * (2 * t - 1) + 1 }
            document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', e => { e.preventDefault(); const id = a.getAttribute('href'); const target = document.querySelector(id); if (!target) return; const start = window.scrollY; const end = target.offsetTop - 70; const dist = end - start; const dur = 800; let startTime; function step(time) { if (!startTime) startTime = time; const t = Math.min((time - startTime) / dur, 1); window.scrollTo(0, start + dist * easeInOutCubic(t)); if (t < 1) requestAnimationFrame(step) } requestAnimationFrame(step) }) });

            /* ACTIVE NAV */
            const sections = document.querySelectorAll('section[id]');
            const navAs = document.querySelectorAll('.nav-links a');
            const navObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { navAs.forEach(a => a.classList.remove('active')); const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`); if (active) active.classList.add('active') } }) }, { threshold: .3, rootMargin: '-70px 0px -50% 0px' });
            sections.forEach(s => navObs.observe(s));

            /* REVEAL ON SCROLL */
            function initReveals() {
                const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
                if (prefersReduced) { reveals.forEach(r => r.classList.add('active')); return }
                const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active') } else { e.target.classList.remove('active') } }) }, { threshold: .15, rootMargin: '0px 0px -50px 0px' });
                reveals.forEach(r => obs.observe(r));
            }

            /* COUNTERS */
            const counterObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) return; const el = e.target; const target = parseFloat(el.dataset.target); const decimal = parseInt(el.dataset.decimal) || 0; const suffix = el.dataset.suffix || ''; const dur = 1500; let start = null;
                    function tick(time) { if (!start) start = time; const p = Math.min((time - start) / dur, 1); const eased = 1 - Math.pow(1 - p, 3); const v = eased * target; el.textContent = (decimal ? v.toFixed(decimal) : Math.floor(v)) + suffix; if (p < 1) requestAnimationFrame(tick) }
                    requestAnimationFrame(tick); counterObs.unobserve(el)
                })
            }, { threshold: .5 });
            document.querySelectorAll('.counter').forEach(c => counterObs.observe(c));

            /* PROJECTS HORIZONTAL SCROLL */
            const projTrack = document.getElementById('projectsTrack');
            const projPrev = document.querySelector('.proj-prev');
            const projNext = document.querySelector('.proj-next');
            if (projTrack) {
                const scrollAmt = 440;
                projPrev.addEventListener('click', () => { projTrack.scrollBy({ left: -scrollAmt, behavior: 'smooth' }) });
                projNext.addEventListener('click', () => { projTrack.scrollBy({ left: scrollAmt, behavior: 'smooth' }) });
                /* Drag to scroll */
                let isDown = false, startX, scrollLeft;
                projTrack.addEventListener('mousedown', e => { isDown = true; projTrack.classList.add('dragging'); startX = e.pageX - projTrack.offsetLeft; scrollLeft = projTrack.scrollLeft });
                projTrack.addEventListener('mouseleave', () => { isDown = false; projTrack.classList.remove('dragging') });
                projTrack.addEventListener('mouseup', () => { isDown = false; projTrack.classList.remove('dragging') });
                projTrack.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - projTrack.offsetLeft; const walk = (x - startX) * 1.5; projTrack.scrollLeft = scrollLeft - walk });
            }

            /* MAGNETIC BUTTONS */
            if (!prefersReduced) {
                document.querySelectorAll('.magnetic').forEach(btn => {
                    btn.addEventListener('mousemove', e => { const r = btn.getBoundingClientRect(); const x = e.clientX - r.left - r.width / 2; const y = e.clientY - r.top - r.height / 2; btn.style.transform = `translate(${x * .2}px,${y * .2}px)` });
                    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; btn.style.transition = 'transform .4s var(--ease)' })
                });
            }

            /* PARALLAX */
            if (!prefersReduced) {
                const heroGrad = document.querySelector('.hero-gradient');
                const heroGrid = document.querySelector('.hero-grid');
                window.addEventListener('scroll', () => { const y = window.scrollY; if (y < window.innerHeight) { heroGrad.style.transform = `translateY(${y * .3}px)`; heroGrid.style.transform = `translate(${(y * .1) % 80}px,${(y * .1) % 80}px)` } }, { passive: true });
            }

            /* CINEMATIC SMOOTH SCROLL */
            function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
            function smoothScroll(targetY, duration) {
                const startY = window.scrollY;
                const diff = targetY - startY;
                let start = null;
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    window.scrollTo(0, startY + diff * easeInOutCubic(progress));
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            }
            document.querySelectorAll('nav .nav-links a').forEach(a => {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    const targetEl = document.querySelector(a.getAttribute('href'));
                    if (targetEl) smoothScroll(targetEl.offsetTop - 72, 800);
                });
            });
            const scrollBtn = document.querySelector('.scroll-top');
            window.addEventListener('scroll', () => { scrollBtn.classList.toggle('visible', window.scrollY > 400) }, { passive: true });
            scrollBtn.addEventListener('click', () => smoothScroll(0, 800));


            /* THEME TOGGLE LOGIC */
            const themeBtn = document.getElementById('theme-toggle');
            const rootEl = document.documentElement;
            themeBtn.addEventListener('click', () => {
                if (rootEl.getAttribute('data-theme') === 'light') {
                    rootEl.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark');
                } else {
                    rootEl.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light');
                }
            });

            /* EMAILJS SUBMISSION LOGIC */
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                emailjs.init({ publicKey: "XXFPaQq2SRL2OsyeU" });
                contactForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const btn = contactForm.querySelector('.btn-submit span');
                    const originalText = btn.textContent;
                    btn.textContent = 'Sending...';

                    emailjs.sendForm('service_a5fymxc', 'template_gzx3o0h', this)
                        .then(() => {
                            btn.textContent = 'Sent Successfully!';
                            contactForm.reset();
                            setTimeout(() => btn.textContent = originalText, 3000);
                        }, (error) => {
                            btn.textContent = 'Failed to Send';
                            console.error('EmailJS Error:', error);
                            setTimeout(() => btn.textContent = originalText, 3000);
                        });
                });
            }

            /* INITIAL STATE */
            document.body.style.overflow = 'hidden';
        })();