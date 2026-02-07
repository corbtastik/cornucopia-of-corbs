/**
 * Search Module
 * Core search functionality for filtering posts
 */
window.BlogApp = window.BlogApp || {};

BlogApp.search = {
    /**
     * Initialize search event listeners
     */
    init: function() {
        const searchInput = BlogApp.dom.searchInput;

        if (!searchInput) return;

        // Handle Enter key for function codes
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = e.target.value;
                if (input.startsWith('/')) {
                    e.preventDefault();
                    BlogApp.commands.handle(input);
                }
            }
        });

        // Handle input for search and function codes
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();

            // If search is empty, restore original state
            if (!term) {
                BlogApp.clearSearch();
                return;
            }

            // Function code mode - show available codes
            if (term.startsWith('/')) {
                BlogApp.showResults();
                BlogApp.dom.resultsList.innerHTML = BlogApp.commands.displayCodes(term);
                return;
            }

            // Normal search - filter posts
            BlogApp.showResults();
            this.filterPosts(term);
        });
    },

    /**
     * Filter posts by search term
     */
    filterPosts: function(term) {
        const searchIndex = BlogApp.state.searchIndex;

        const matches = searchIndex.filter(post => {
            const title = post.title ? post.title.toLowerCase() : '';
            const desc = post.description ? post.description.toLowerCase() : '';
            const tags = post.tags ? post.tags.join(' ').toLowerCase() : '';
            const date = post.date ? post.date : '';

            return title.includes(term) || desc.includes(term) || tags.includes(term) || date.includes(term);
        });

        this.displayResults(matches);
    },

    /**
     * Display search results
     */
    displayResults: function(matches) {
        const resultsList = BlogApp.dom.resultsList;

        resultsList.innerHTML = ''; // Clear previous results

        if (matches.length === 0) {
            resultsList.innerHTML = '<li class="post-item"><p>No matches found.</p></li>';
            return;
        }

        matches.forEach(post => {
            const li = document.createElement('li');
            li.className = 'post-item';

            // Format Tags (if any)
            const tagsHtml = post.tags && post.tags.length
                ? `<br><div class="post-tags" style="margin-top:0.5rem; font-size: 0.8em;">${post.tags.map(tag => `<span class="tag" style="pointer-events:none;">#${tag}</span>`).join('')}</div>`
                : '';

            // Safe Date
            const dateStr = post.date || '';

            // Insert HTML
            li.innerHTML = `
                <div class="post-header">
                    <h2 style="font-size: 1.5rem; margin:0; line-height: 1.3;">
                        <a href="${post.url}">${post.title}</a>
                    </h2>
                    <span class="post-date">${dateStr}</span>
                </div>
                <p>${post.description || 'No description available.'}</p>
                ${tagsHtml}
            `;
            resultsList.appendChild(li);
        });
    }
};
