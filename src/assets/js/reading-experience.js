/**
 * Reading Experience Enhancements
 * - Reading progress bar
 * - Back to top button
 * - Keyboard shortcuts
 */

(function() {
    'use strict';

    // =========================================
    // Reading Progress Bar
    // =========================================
    function initProgressBar() {
        const progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;

        const postContent = document.querySelector('.post-content');
        if (!postContent) {
            progressBar.style.display = 'none';
            return;
        }

        function updateProgress() {
            const contentRect = postContent.getBoundingClientRect();
            const contentTop = contentRect.top + window.scrollY;
            const contentHeight = contentRect.height;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            // Calculate progress based on how much of the post has been scrolled through
            const start = contentTop;
            const end = contentTop + contentHeight - windowHeight;
            const current = scrollY;

            let progress = 0;
            if (current >= start) {
                progress = Math.min(((current - start) / (end - start)) * 100, 100);
            }

            progressBar.style.width = `${Math.max(0, progress)}%`;
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    }

    // =========================================
    // Back to Top Button
    // =========================================
    function initBackToTop() {
        const button = document.querySelector('.back-to-top');
        if (!button) return;

        const showThreshold = 300;

        function toggleVisibility() {
            if (window.scrollY > showThreshold) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        }

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
    }

    // =========================================
    // Keyboard Shortcuts
    // =========================================
    function initKeyboardShortcuts() {
        const searchInput = document.getElementById('search-input');
        const hint = document.querySelector('.keyboard-hint');
        let hintTimeout;

        function showHint(message) {
            if (!hint) return;
            hint.textContent = message;
            hint.classList.add('visible');
            clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => {
                hint.classList.remove('visible');
            }, 2000);
        }

        function isInputFocused() {
            const active = document.activeElement;
            return active && (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable
            );
        }

        document.addEventListener('keydown', (e) => {
            // Ignore if user is typing in an input
            if (isInputFocused()) {
                // Escape to blur input
                if (e.key === 'Escape') {
                    document.activeElement.blur();
                }
                return;
            }

            switch (e.key) {
                case '/':
                    // Focus search
                    e.preventDefault();
                    if (searchInput) {
                        searchInput.focus();
                        searchInput.select();
                    }
                    break;

                case 'j':
                    // Scroll down
                    window.scrollBy({
                        top: 150,
                        behavior: 'smooth'
                    });
                    break;

                case 'k':
                    // Scroll up
                    window.scrollBy({
                        top: -150,
                        behavior: 'smooth'
                    });
                    break;

                case 'g':
                    // Go to top (press twice like vim)
                    if (e.repeat) return;
                    if (this.lastKey === 'g' && Date.now() - this.lastKeyTime < 500) {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                    this.lastKey = 'g';
                    this.lastKeyTime = Date.now();
                    break;

                case 'G':
                    // Go to bottom
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                    break;

                case '?':
                    // Show keyboard shortcuts help
                    showHint('/ search • j/k scroll • gg top • G bottom');
                    break;
            }
        });
    }

    // =========================================
    // Initialize on DOM Ready
    // =========================================
    function init() {
        initProgressBar();
        initBackToTop();
        initKeyboardShortcuts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
