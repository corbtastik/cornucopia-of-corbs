/* =========================================
   SEARCH LOGIC (Theming moved to base.njk)
   ========================================= */
let searchIndex = [];

// Fetch the JSON index
fetch('/search.json')
    .then(response => response.json())
    .then(data => {
        searchIndex = data;
    })
    .catch(error => console.error('Error loading search index:', error));

// DOM Elements
const searchInput = document.getElementById('search-input');
const contentWrapper = document.getElementById('content-wrapper');
const resultsWrapper = document.getElementById('search-results-wrapper');
const resultsList = document.getElementById('search-results-list');

// Listen for typing
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();

        // A: If search is empty, restore original state
        if (!term) {
            contentWrapper.style.display = 'block';
            resultsWrapper.style.display = 'none';
            return;
        }

        // B: If searching, hide content and show results
        contentWrapper.style.display = 'none';
        resultsWrapper.style.display = 'block';
        
        // Filter the data
        const matches = searchIndex.filter(post => {
            const title = post.title ? post.title.toLowerCase() : '';
            const desc = post.description ? post.description.toLowerCase() : '';
            const tags = post.tags ? post.tags.join(' ').toLowerCase() : '';
            // Also search date if you want
            const date = post.date ? post.date : '';
            
            return title.includes(term) || desc.includes(term) || tags.includes(term) || date.includes(term);
        });

        displayResults(matches);
    });
}

function displayResults(matches) {
    resultsList.innerHTML = ''; // Clear previous results

    if (matches.length === 0) {
        resultsList.innerHTML = '<li class="post-item"><p>No matches found.</p></li>';
        return;
    }

    matches.forEach(post => {
        // Create List Item
        const li = document.createElement('li');
        li.className = 'post-item';
        
        // Format Tags (if any)
        const tagsHtml = post.tags.length 
            ? `<br><div class="post-tags" style="margin-top:0.5rem; font-size: 0.8em;">${post.tags.map(tag => `<span class="tag" style="pointer-events:none;">#${tag}</span>`).join('')}</div>` 
            : '';

        // Safe Date
        const dateStr = post.date || '';

        // Insert HTML with new Header Structure
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