/**
 * Pagination Module
 * Handles page navigation for the blog
 */
window.BlogApp = window.BlogApp || {};

BlogApp.pagination = {
    POSTS_PER_PAGE: 10,

    /**
     * Get the current page number from pagination data attribute
     */
    getCurrentPage: function() {
        const pagination = document.querySelector('.pagination');
        if (pagination && pagination.dataset.currentPage) {
            return parseInt(pagination.dataset.currentPage, 10);
        }
        // Fallback: parse from URL
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 1;
        const match = path.match(/^\/(\d+)\/?$/);
        return match ? parseInt(match[1], 10) : 1;
    },

    /**
     * Get total number of pages from pagination data attribute
     */
    getTotalPages: function() {
        const pagination = document.querySelector('.pagination');
        if (pagination && pagination.dataset.totalPages) {
            return parseInt(pagination.dataset.totalPages, 10);
        }
        // Fallback: estimate from search index
        if (BlogApp.state.searchIndex.length > 0) {
            return Math.ceil(BlogApp.state.searchIndex.length / this.POSTS_PER_PAGE);
        }
        return 1;
    },

    /**
     * Navigate to a specific page
     * Note: 11ty pagination URLs are 0-indexed (/1/ is page 2, /2/ is page 3, etc.)
     */
    goToPage: function(pageNum) {
        const total = this.getTotalPages();

        // Invalid page - go home
        if (isNaN(pageNum) || pageNum < 1 || pageNum > total) {
            window.location.href = '/';
            return;
        }

        // Page 1 is home, others are /(pageNum-1)/
        if (pageNum === 1) {
            window.location.href = '/';
        } else {
            window.location.href = `/${pageNum - 1}/`;
        }
    },

    /**
     * Go to first page
     */
    goFirst: function() {
        this.goToPage(1);
    },

    /**
     * Go to last page
     */
    goLast: function() {
        this.goToPage(this.getTotalPages());
    },

    /**
     * Go to next page (loops to first if on last)
     */
    goNext: function() {
        const nextPage = this.getCurrentPage() + 1;
        this.goToPage(nextPage > this.getTotalPages() ? 1 : nextPage);
    },

    /**
     * Go to previous page (loops to last if on first)
     */
    goPrev: function() {
        const prevPage = this.getCurrentPage() - 1;
        this.goToPage(prevPage < 1 ? this.getTotalPages() : prevPage);
    }
};
