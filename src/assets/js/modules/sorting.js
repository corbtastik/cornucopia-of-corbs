/**
 * Sorting Module
 * Handles post sorting functionality
 */
window.BlogApp = window.BlogApp || {};

BlogApp.sorting = {
    /**
     * Sort ALL posts using the search index and display them
     * @param {string} order - 'asc' for oldest first, 'desc' for newest first
     */
    sortAllPosts: function(order) {
        const searchIndex = BlogApp.state.searchIndex;

        if (searchIndex.length === 0) {
            BlogApp.dom.resultsList.innerHTML = '<li class="post-item"><p>Loading posts...</p></li>';
            return;
        }

        // Clone and sort the search index
        const sorted = [...searchIndex].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });

        // Clear search input
        if (BlogApp.dom.searchInput) {
            BlogApp.dom.searchInput.value = '';
        }

        // Show results
        BlogApp.showResults();

        // Update results header
        const sortLabel = order === 'asc' ? 'Oldest First' : 'Newest First';
        BlogApp.dom.resultsWrapper.querySelector('h2').textContent = `All Posts (${sortLabel})`;

        // Display sorted posts
        BlogApp.search.displayResults(sorted);
    },

    /**
     * Sort posts oldest first
     */
    sortOldest: function() {
        this.sortAllPosts('asc');
    },

    /**
     * Sort posts newest first
     */
    sortNewest: function() {
        this.sortAllPosts('desc');
    }
};
