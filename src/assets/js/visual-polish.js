/**
 * Visual Polish Enhancements
 * - Scroll-triggered animations for images and headings
 * - Intersection Observer for performance
 */

(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================
    // Scroll-Triggered Animations
    // =========================================
    function initScrollAnimations() {
        if (prefersReducedMotion) {
            // If user prefers reduced motion, make everything visible immediately
            document.querySelectorAll('.post-content img, .gallery-item img, .post-content h2, .post-content h3').forEach(el => {
                el.classList.add('no-animate');
            });
            return;
        }

        // Elements to animate
        const animatedElements = document.querySelectorAll(
            '.post-content img, .gallery-item img, .post-content h2, .post-content h3'
        );

        if (animatedElements.length === 0) return;

        // Intersection Observer options
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        // Observer callback
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Unobserve after animation (one-time animation)
                    observer.unobserve(entry.target);
                }
            });
        };

        // Create observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all animated elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        // Handle images that are already in viewport on page load
        // (above the fold images should be visible immediately)
        setTimeout(() => {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('in-view');
                }
            });
        }, 100);
    }

    // =========================================
    // Initialize on DOM Ready
    // =========================================
    function init() {
        initScrollAnimations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
