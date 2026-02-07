/**
 * Shared State Module
 * Central state management for the blog application
 */
window.BlogApp = window.BlogApp || {};

BlogApp.state = {
    searchIndex: [],
    randomTheme: null
};

BlogApp.dom = {
    searchInput: null,
    contentWrapper: null,
    resultsWrapper: null,
    resultsList: null
};

/**
 * Initialize DOM references
 */
BlogApp.initDOM = function() {
    this.dom.searchInput = document.getElementById('search-input');
    this.dom.contentWrapper = document.getElementById('content-wrapper');
    this.dom.resultsWrapper = document.getElementById('search-results-wrapper');
    this.dom.resultsList = document.getElementById('search-results-list');
};

/**
 * Check if we're on a page with search functionality
 */
BlogApp.isSearchPage = function() {
    return !!(this.dom.searchInput && this.dom.contentWrapper &&
              this.dom.resultsWrapper && this.dom.resultsList);
};

/**
 * Clear search and restore content
 */
BlogApp.clearSearch = function() {
    if (this.dom.searchInput) this.dom.searchInput.value = '';
    if (this.dom.contentWrapper) this.dom.contentWrapper.style.display = 'block';
    if (this.dom.resultsWrapper) this.dom.resultsWrapper.style.display = 'none';
};

/**
 * Show results panel
 */
BlogApp.showResults = function() {
    if (this.dom.contentWrapper) this.dom.contentWrapper.style.display = 'none';
    if (this.dom.resultsWrapper) this.dom.resultsWrapper.style.display = 'block';
};

/**
 * Fetch and store the search index
 */
BlogApp.loadSearchIndex = function() {
    return fetch('/search.json')
        .then(response => response.json())
        .then(data => {
            this.state.searchIndex = data;
            return data;
        })
        .catch(error => {
            console.error('Error loading search index:', error);
            return [];
        });
};
