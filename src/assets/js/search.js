/* =========================================
   1. ADVANCED THEMING LOGIC
   ========================================= */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeSelect = document.getElementById('theme-select');
const rootElement = document.documentElement;

// 1. Load saved settings or defaults
const savedMode = localStorage.getItem('mode') || 'dark';
const savedThemeSet = localStorage.getItem('theme-set') || 'default';

// 2. Apply settings immediately
rootElement.setAttribute('data-mode', savedMode);
rootElement.setAttribute('data-theme-set', savedThemeSet);

// 3. Update UI controls to match state
themeToggleBtn.textContent = savedMode === 'light' ? 'Dark Mode' : 'Light Mode';
if (themeSelect) {
    themeSelect.value = savedThemeSet;
}

// 4. Toggle Mode (Dark/Light)
themeToggleBtn.addEventListener('click', () => {
    const currentMode = rootElement.getAttribute('data-mode');
    const newMode = currentMode === 'light' ? 'dark' : 'light';

    rootElement.setAttribute('data-mode', newMode);
    localStorage.setItem('mode', newMode);
    
    // Update Button Text
    themeToggleBtn.textContent = newMode === 'light' ? 'Dark Mode' : 'Light Mode';
});

// 5. Change Theme Set (Default/Ocean/Forest)
if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
        const newSet = e.target.value;
        rootElement.setAttribute('data-theme-set', newSet);
        localStorage.setItem('theme-set', newSet);
    });
}


/* =========================================
   2. INSTANT SEARCH LOGIC
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
            ? `<br><small style="opacity: 0.7;">Tags: ${post.tags.join(', ')}</small>` 
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