/**
 * Blog Application Entry Point
 * Initializes all modules and coordinates the application
 */
(function() {
    'use strict';

    /**
     * Initialize the application when DOM is ready
     */
    function init() {
        // Initialize DOM references
        BlogApp.initDOM();

        // Load search index
        BlogApp.loadSearchIndex();

        // Initialize search if on a search-enabled page
        if (BlogApp.isSearchPage()) {
            BlogApp.search.init();
        }
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
