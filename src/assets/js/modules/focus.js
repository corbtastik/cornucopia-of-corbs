/**
 * Focus Module
 * Handles distraction-free reading mode
 */
window.BlogApp = window.BlogApp || {};

BlogApp.focus = {
    STORAGE_KEY: 'focus-mode',

    /**
     * Initialize focus mode from saved state
     */
    init: function() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved === 'true') {
            this.enable(false); // Don't save again
        }
    },

    /**
     * Enable focus mode
     */
    enable: function(save = true) {
        document.body.classList.add('focus-mode');

        // Close sidebar if open
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');

        if (save) {
            localStorage.setItem(this.STORAGE_KEY, 'true');
        }

        // Clear search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    },

    /**
     * Disable focus mode
     */
    disable: function() {
        document.body.classList.remove('focus-mode');
        localStorage.setItem(this.STORAGE_KEY, 'false');

        // Clear search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    },

    /**
     * Toggle focus mode
     */
    toggle: function() {
        if (document.body.classList.contains('focus-mode')) {
            this.disable();
        } else {
            this.enable();
        }
    },

    /**
     * Check if focus mode is active
     */
    isActive: function() {
        return document.body.classList.contains('focus-mode');
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BlogApp.focus.init());
} else {
    BlogApp.focus.init();
}
