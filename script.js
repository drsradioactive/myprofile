document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    var header = document.querySelector('.site-header');
    var progress = document.querySelector('.scroll-progress');
    function onScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 8);
        if (progress) {
            var doc = document.documentElement;
            var max = doc.scrollHeight - doc.clientHeight;
            var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            progress.style.width = pct + '%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        if (reduceMotion || !('IntersectionObserver' in window)) {
            revealEls.forEach(function (el) { el.classList.add('in-view'); });
        } else {
            var revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach(function (el) { revealObserver.observe(el); });
        }
    }

    var counters = document.querySelectorAll('[data-count-to]');
    if (counters.length) {
        function animateCounter(el) {
            var target = parseFloat(el.getAttribute('data-count-to'));
            var prefix = el.getAttribute('data-prefix') || '';
            var suffix = el.getAttribute('data-suffix') || '';
            var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
            if (reduceMotion || isNaN(target)) {
                el.textContent = prefix + target.toFixed(decimals) + suffix;
                return;
            }
            var duration = 1200;
            var start = null;
            function step(ts) {
                if (start === null) start = ts;
                var progressRatio = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progressRatio, 3);
                var current = target * eased;
                el.textContent = prefix + current.toFixed(decimals) + suffix;
                if (progressRatio < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });
            counters.forEach(function (el) { counterObserver.observe(el); });
        } else {
            counters.forEach(animateCounter);
        }
    }
});
