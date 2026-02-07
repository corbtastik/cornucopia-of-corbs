/**
 * Filtering Module
 * Handles post filtering by tag
 */
window.BlogApp = window.BlogApp || {};

BlogApp.filtering = {
    /**
     * Filter posts by tag
     * @param {string} tag - The tag to filter by
     */
    filterByTag: function(tag) {
        // Guard: Ensure we're on a search-enabled page
        if (!BlogApp.isSearchPage()) return;

        const searchIndex = BlogApp.state.searchIndex;

        if (searchIndex.length === 0) {
            BlogApp.dom.resultsList.innerHTML = '<li class="post-item"><p>Loading posts...</p></li>';
            return;
        }

        const tagLower = tag.toLowerCase();

        // Filter posts that have this tag
        const matches = searchIndex.filter(post => {
            if (!post.tags) return false;
            return post.tags.some(t => t.toLowerCase() === tagLower);
        });

        // No matches - go home
        if (matches.length === 0) {
            window.location.href = '/';
            return;
        }

        // Sort matches newest first
        matches.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });

        // Clear search input and show results
        BlogApp.clearSearch();
        BlogApp.showResults();

        // Update results header
        const resultsHeader = BlogApp.dom.resultsWrapper.querySelector('h2');
        if (resultsHeader) {
            resultsHeader.textContent = `Posts tagged #${tag}`;
        }

        // Display filtered posts
        BlogApp.search.displayResults(matches);
    }
};
