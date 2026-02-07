/* =========================================
   SEARCH LOGIC (Theming moved to base.njk)
   ========================================= */
let searchIndex = [];

/* =========================================
   FUNCTION CODES - Commands starting with /
   ========================================= */
const FUNCTION_CODES = {
    '/home': { url: '/', description: 'Go to home page' },
    '/sort old': { action: 'sortOld', description: 'Sort posts oldest first' },
    '/sort new': { action: 'sortNew', description: 'Sort posts newest first' },
    '/tag': { action: 'filterTag', description: 'Filter by tag (e.g., /tag photos)', hasParam: true },
    '/first': { action: 'goFirst', description: 'Go to first page' },
    '/last': { action: 'goLast', description: 'Go to last page' },
    '/next': { action: 'goNext', description: 'Go to next page' },
    '/prev': { action: 'goPrev', description: 'Go to previous page' },
    '/page': { action: 'goPage', description: 'Go to page N (e.g., /page 2)', hasParam: true },
    '/dark': { action: 'setDark', description: 'Enable dark mode' },
    '/light': { action: 'setLight', description: 'Enable light mode' },
    '/egg': { action: 'randomTheme', description: 'Generate random color theme' }
};

/**
 * Check if input is a function code and execute it
 * @returns {boolean} true if a function code was executed
 */
function handleFunctionCode(input) {
    const code = input.toLowerCase().trim();

    // Check for exact match first
    if (FUNCTION_CODES.hasOwnProperty(code)) {
        const cmd = FUNCTION_CODES[code];

        if (cmd.url) {
            window.location.href = cmd.url;
            return true;
        }

        if (cmd.action && !cmd.hasParam) {
            executeAction(cmd.action);
            return true;
        }
    }

    // Check for parameterized commands (e.g., /tag photos)
    const parts = code.split(' ');
    const baseCmd = parts[0];
    const param = parts.slice(1).join(' ');

    if (FUNCTION_CODES.hasOwnProperty(baseCmd)) {
        const cmd = FUNCTION_CODES[baseCmd];

        if (cmd.hasParam && cmd.action && param) {
            executeAction(cmd.action, param);
            return true;
        }
    }

    return false;
}

// Pagination config (must match index.njk)
const POSTS_PER_PAGE = 10;

/**
 * Execute an action-based function code
 * @param {string} action - The action to execute
 * @param {string} param - Optional parameter for the action
 */
function executeAction(action, param) {
    switch (action) {
        case 'sortOld':
            sortAllPosts('asc');
            break;
        case 'sortNew':
            sortAllPosts('desc');
            break;
        case 'filterTag':
            filterByTag(param);
            break;
        case 'goFirst':
            goToPage(1);
            break;
        case 'goLast':
            goToPage(getTotalPages());
            break;
        case 'goNext':
            const nextPage = getCurrentPage() + 1;
            goToPage(nextPage > getTotalPages() ? 1 : nextPage);
            break;
        case 'goPrev':
            const prevPage = getCurrentPage() - 1;
            goToPage(prevPage < 1 ? getTotalPages() : prevPage);
            break;
        case 'goPage':
            goToPage(parseInt(param, 10));
            break;
        case 'setDark':
            setThemeMode('dark');
            break;
        case 'setLight':
            setThemeMode('light');
            break;
        case 'randomTheme':
            generateRandomTheme();
            break;
    }
}

// Material Design 2014 Color Palette
const MATERIAL_PALETTE = {
    red:        { 900: '#B71C1C', 700: '#D32F2F', 500: '#F44336', 300: '#E57373', 100: '#FFCDD2', 50: '#FFEBEE', A200: '#FF5252', A400: '#FF1744' },
    pink:       { 900: '#880E4F', 700: '#C2185B', 500: '#E91E63', 300: '#F06292', 100: '#F8BBD0', 50: '#FCE4EC', A200: '#FF4081', A400: '#F50057' },
    purple:     { 900: '#4A148C', 700: '#7B1FA2', 500: '#9C27B0', 300: '#BA68C8', 100: '#E1BEE7', 50: '#F3E5F5', A200: '#E040FB', A400: '#D500F9' },
    deepPurple: { 900: '#311B92', 700: '#512DA8', 500: '#673AB7', 300: '#9575CD', 100: '#D1C4E9', 50: '#EDE7F6', A200: '#7C4DFF', A400: '#651FFF' },
    indigo:     { 900: '#1A237E', 700: '#303F9F', 500: '#3F51B5', 300: '#7986CB', 100: '#C5CAE9', 50: '#E8EAF6', A200: '#536DFE', A400: '#3D5AFE' },
    blue:       { 900: '#0D47A1', 700: '#1976D2', 500: '#2196F3', 300: '#64B5F6', 100: '#BBDEFB', 50: '#E3F2FD', A200: '#448AFF', A400: '#2979FF' },
    lightBlue:  { 900: '#01579B', 700: '#0288D1', 500: '#03A9F4', 300: '#4FC3F7', 100: '#B3E5FC', 50: '#E1F5FE', A200: '#40C4FF', A400: '#00B0FF' },
    cyan:       { 900: '#006064', 700: '#0097A7', 500: '#00BCD4', 300: '#4DD0E1', 100: '#B2EBF2', 50: '#E0F7FA', A200: '#18FFFF', A400: '#00E5FF' },
    teal:       { 900: '#004D40', 700: '#00796B', 500: '#009688', 300: '#4DB6AC', 100: '#B2DFDB', 50: '#E0F2F1', A200: '#64FFDA', A400: '#1DE9B6' },
    green:      { 900: '#1B5E20', 700: '#388E3C', 500: '#4CAF50', 300: '#81C784', 100: '#C8E6C9', 50: '#E8F5E9', A200: '#69F0AE', A400: '#00E676' },
    lightGreen: { 900: '#33691E', 700: '#689F38', 500: '#8BC34A', 300: '#AED581', 100: '#DCEDC8', 50: '#F1F8E9', A200: '#B2FF59', A400: '#76FF03' },
    lime:       { 900: '#827717', 700: '#AFB42B', 500: '#CDDC39', 300: '#DCE775', 100: '#F0F4C3', 50: '#F9FBE7', A200: '#EEFF41', A400: '#C6FF00' },
    yellow:     { 900: '#F57F17', 700: '#FBC02D', 500: '#FFEB3B', 300: '#FFF176', 100: '#FFF9C4', 50: '#FFFDE7', A200: '#FFFF00', A400: '#FFEA00' },
    amber:      { 900: '#FF6F00', 700: '#FFA000', 500: '#FFC107', 300: '#FFD54F', 100: '#FFECB3', 50: '#FFF8E1', A200: '#FFD740', A400: '#FFC400' },
    orange:     { 900: '#E65100', 700: '#F57C00', 500: '#FF9800', 300: '#FFB74D', 100: '#FFE0B2', 50: '#FFF3E0', A200: '#FFAB40', A400: '#FF9100' },
    deepOrange: { 900: '#BF360C', 700: '#E64A19', 500: '#FF5722', 300: '#FF8A65', 100: '#FFCCBC', 50: '#FBE9E7', A200: '#FF6E40', A400: '#FF3D00' },
    brown:      { 900: '#3E2723', 700: '#5D4037', 500: '#795548', 300: '#A1887F', 100: '#D7CCC8', 50: '#EFEBE9' },
    grey:       { 900: '#212121', 700: '#616161', 500: '#9E9E9E', 300: '#E0E0E0', 100: '#F5F5F5', 50: '#FAFAFA' },
    blueGrey:   { 900: '#263238', 700: '#455A64', 500: '#607D8B', 300: '#90A4AE', 100: '#CFD8DC', 50: '#ECEFF1' }
};

/**
 * Pick a random item from an array
 */
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get a random color from the Material palette
 */
function getRandomMaterialColor(shades) {
    const colorNames = Object.keys(MATERIAL_PALETTE);
    const colorName = pickRandom(colorNames);
    const color = MATERIAL_PALETTE[colorName];
    const shade = pickRandom(shades.filter(s => color[s]));
    return color[shade];
}

/**
 * Generate a random color theme using Material Design colors
 */
function generateRandomTheme() {
    // Pick two random color families for variety
    const colorNames = Object.keys(MATERIAL_PALETTE);
    const primaryColorName = pickRandom(colorNames);
    const accentColorName = pickRandom(colorNames.filter(c => c !== primaryColorName));

    const primaryColor = MATERIAL_PALETTE[primaryColorName];
    const accentColor = MATERIAL_PALETTE[accentColorName];

    // Get current mode
    const currentMode = document.documentElement.getAttribute('data-mode') || 'dark';

    // Generate dark mode colors from Material palette
    const darkColors = {
        bg: primaryColor[900],
        text: primaryColor[50],
        heading: accentColor[300] || accentColor[100],
        link: accentColor.A200 || accentColor[300],
        primary: accentColor.A400 || accentColor[500],
        surface: primaryColor[700] || primaryColor[900],
        border: primaryColor[500] || primaryColor[700],
        shKeyword: accentColor.A200 || accentColor[300],
        shString: accentColor[100] || accentColor[300],
        shFunction: accentColor[300] || accentColor[500],
        shVariable: primaryColor[100],
        shComment: primaryColor[500] || primaryColor[300]
    };

    // Generate light mode colors from Material palette
    const lightColors = {
        bg: primaryColor[50],
        text: primaryColor[900],
        heading: accentColor[700] || accentColor[900],
        link: accentColor[700] || accentColor[500],
        primary: accentColor[500],
        surface: '#FFFFFF',
        border: primaryColor[100],
        shKeyword: accentColor[700] || accentColor[500],
        shString: accentColor[900] || accentColor[700],
        shFunction: accentColor[500],
        shVariable: primaryColor[700],
        shComment: MATERIAL_PALETTE.grey[500]
    };

    // Apply the random theme
    const colors = currentMode === 'dark' ? darkColors : lightColors;
    applyRandomColors(colors, currentMode, darkColors, lightColors);

    // Clear search
    searchInput.value = '';
    contentWrapper.style.display = 'block';
    resultsWrapper.style.display = 'none';
}

/**
 * Apply random colors to CSS custom properties
 */
function applyRandomColors(colors, mode, darkColors, lightColors) {
    const root = document.documentElement;

    // Core colors
    root.style.setProperty('--bg-color', colors.bg);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--heading-color', colors.heading);
    root.style.setProperty('--link-color', colors.link);
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--card-bg', colors.surface);
    root.style.setProperty('--search-bg', colors.bg);
    root.style.setProperty('--border-color', colors.border);

    // Derived colors
    root.style.setProperty('--tertiary-color', `color-mix(in srgb, ${colors.text} 70%, ${colors.bg})`);

    // Container colors
    root.style.setProperty('--primary-container-bg', colors.surface);
    root.style.setProperty('--on-primary-container-color', colors.text);
    root.style.setProperty('--secondary-container-bg', colors.border);
    root.style.setProperty('--on-secondary-container-color', colors.text);

    // Syntax highlighting
    root.style.setProperty('--sh-bg', colors.surface);
    root.style.setProperty('--sh-text', colors.text);
    root.style.setProperty('--sh-border', colors.border);
    root.style.setProperty('--sh-keyword', colors.shKeyword);
    root.style.setProperty('--sh-string', colors.shString);
    root.style.setProperty('--sh-function', colors.shFunction);
    root.style.setProperty('--sh-variable', colors.shVariable);
    root.style.setProperty('--sh-comment', colors.shComment);
    root.style.setProperty('--sh-punctuation', colors.text);

    // Store random theme for mode toggling
    window._randomTheme = { dark: darkColors, light: lightColors };

    // Update data attributes
    root.setAttribute('data-theme-set', 'random');
    root.setAttribute('data-mode', mode);

    // Update theme select to show random
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = '';
    }
}

/**
 * Set theme mode (dark/light)
 */
function setThemeMode(mode) {
    // Check if we're using a random theme
    if (window._randomTheme) {
        const colors = mode === 'dark' ? window._randomTheme.dark : window._randomTheme.light;
        applyRandomColors(colors, mode, window._randomTheme.dark, window._randomTheme.light);
    } else if (typeof ThemeManager !== 'undefined') {
        const { id } = ThemeManager.getCurrentTheme();
        ThemeManager.applyTheme(id, mode);
    }

    // Update the toggle button text
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerText = mode === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    // Clear search
    searchInput.value = '';
    contentWrapper.style.display = 'block';
    resultsWrapper.style.display = 'none';
}

/**
 * Get the current page number from pagination data attribute
 */
function getCurrentPage() {
    const pagination = document.querySelector('.pagination');
    if (pagination && pagination.dataset.currentPage) {
        return parseInt(pagination.dataset.currentPage, 10);
    }
    // Fallback: parse from URL
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 1;
    const match = path.match(/^\/(\d+)\/?$/);
    return match ? parseInt(match[1], 10) : 1;
}

/**
 * Get total number of pages from pagination data attribute
 */
function getTotalPages() {
    const pagination = document.querySelector('.pagination');
    if (pagination && pagination.dataset.totalPages) {
        return parseInt(pagination.dataset.totalPages, 10);
    }
    // Fallback: estimate from search index
    if (searchIndex.length > 0) {
        return Math.ceil(searchIndex.length / POSTS_PER_PAGE);
    }
    return 1;
}

/**
 * Navigate to a specific page
 * Note: 11ty pagination URLs are 0-indexed (/1/ is page 2, /2/ is page 3, etc.)
 */
function goToPage(pageNum) {
    const total = getTotalPages();

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
}

/**
 * Filter posts by tag
 * @param {string} tag - The tag to filter by
 */
function filterByTag(tag) {
    if (searchIndex.length === 0) {
        resultsList.innerHTML = '<li class="post-item"><p>Loading posts...</p></li>';
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

    // Clear search input
    searchInput.value = '';

    // Hide original content, show results
    contentWrapper.style.display = 'none';
    resultsWrapper.style.display = 'block';

    // Update results header
    resultsWrapper.querySelector('h2').textContent = `Posts tagged #${tag}`;

    // Display filtered posts
    displayResults(matches);
}

/**
 * Sort ALL posts using the search index and display them
 * @param {string} order - 'asc' for oldest first, 'desc' for newest first
 */
function sortAllPosts(order) {
    if (searchIndex.length === 0) {
        resultsList.innerHTML = '<li class="post-item"><p>Loading posts...</p></li>';
        return;
    }

    // Clone and sort the search index
    const sorted = [...searchIndex].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Clear search input
    searchInput.value = '';

    // Hide original content, show results
    contentWrapper.style.display = 'none';
    resultsWrapper.style.display = 'block';

    // Update results header
    const sortLabel = order === 'asc' ? 'Oldest First' : 'Newest First';
    resultsWrapper.querySelector('h2').textContent = `All Posts (${sortLabel})`;

    // Display sorted posts
    displayResults(sorted);
}

/**
 * Display all available function codes
 */
function displayFunctionCodes(currentInput) {
    const code = currentInput.toLowerCase().trim();

    // Check if it's a valid executable command
    const isExactMatch = FUNCTION_CODES.hasOwnProperty(code) && !FUNCTION_CODES[code].hasParam;
    const isParamMatch = isParameterizedMatch(code);

    let html = '<li class="post-item function-codes-list">';
    html += '<p><strong>Function Codes</strong></p>';
    html += '<ul style="list-style: none; padding: 0; margin: 0.5rem 0 0 0;">';

    for (const [cmd, info] of Object.entries(FUNCTION_CODES)) {
        const isCurrentCmd = code === cmd || code.startsWith(cmd + ' ');
        const highlight = isCurrentCmd ? 'style="color: var(--primary-color);"' : '';
        const cmdDisplay = info.hasParam ? `${cmd} &lt;value&gt;` : cmd;
        html += `<li ${highlight}><code>${cmdDisplay}</code> — ${info.description}</li>`;
    }

    html += '</ul>';

    if (isExactMatch || isParamMatch) {
        html += `<p style="margin-top: 0.75rem;">Press <strong>Enter</strong> to execute <code>${code}</code></p>`;
    }

    html += '</li>';
    return html;
}

/**
 * Check if input matches a parameterized command with a value
 */
function isParameterizedMatch(code) {
    const parts = code.split(' ');
    const baseCmd = parts[0];
    const param = parts.slice(1).join(' ');

    if (FUNCTION_CODES.hasOwnProperty(baseCmd)) {
        const cmd = FUNCTION_CODES[baseCmd];
        return cmd.hasParam && param.length > 0;
    }

    return false;
}

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
    // Handle Enter key for function codes
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = e.target.value;
            if (input.startsWith('/')) {
                e.preventDefault();
                handleFunctionCode(input);
            }
        }
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();

        // A: If search is empty, restore original state
        if (!term) {
            contentWrapper.style.display = 'block';
            resultsWrapper.style.display = 'none';
            return;
        }

        // B: Function code mode - show available codes
        if (term.startsWith('/')) {
            contentWrapper.style.display = 'none';
            resultsWrapper.style.display = 'block';
            resultsList.innerHTML = displayFunctionCodes(term);
            return;
        }

        // C: Normal search - hide content and show results
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