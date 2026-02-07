/**
 * Command Palette Module
 * Spotlight-style search across posts, commands, and navigation
 * Opens with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
 */
window.BlogApp = window.BlogApp || {};

BlogApp.commandPalette = {
    isOpen: false,
    selectedIndex: 0,
    results: [],

    // Navigation items
    NAV_ITEMS: [
        { type: 'nav', title: 'Home', url: '/', icon: 'home' },
        { type: 'nav', title: 'Archive', url: '/archive/', icon: 'archive' },
        { type: 'nav', title: 'Tags', url: '/tags/', icon: 'tag' },
        { type: 'nav', title: 'Gallery', url: '/gallery/', icon: 'image' },
        { type: 'nav', title: 'Designs', url: '/designs/', icon: 'palette' },
        { type: 'nav', title: 'Themes', url: '/themes/', icon: 'brush' },
        { type: 'nav', title: 'About', url: '/about/', icon: 'user' }
    ],

    // Command items (from existing slash commands)
    COMMAND_ITEMS: [
        { type: 'cmd', title: 'Dark Mode', action: () => BlogApp.theming.setMode('dark'), icon: 'moon' },
        { type: 'cmd', title: 'Light Mode', action: () => BlogApp.theming.setMode('light'), icon: 'sun' },
        { type: 'cmd', title: 'Random Theme', action: () => BlogApp.theming.generateRandomTheme(), icon: 'shuffle' },
        { type: 'cmd', title: 'Sort: Newest First', action: () => BlogApp.sorting.sortNewest(), icon: 'sort-desc' },
        { type: 'cmd', title: 'Sort: Oldest First', action: () => BlogApp.sorting.sortOldest(), icon: 'sort-asc' },
        { type: 'cmd', title: 'First Page', action: () => BlogApp.pagination.goToPage(1), icon: 'chevrons-left' },
        { type: 'cmd', title: 'Last Page', action: () => BlogApp.pagination.goToPage(BlogApp.pagination.getTotalPages()), icon: 'chevrons-right' }
    ],

    /**
     * Initialize the command palette
     */
    init: function() {
        this.createDOM();
        this.bindEvents();
    },

    /**
     * Create the palette DOM structure
     */
    createDOM: function() {
        // Check if already exists
        if (document.getElementById('command-palette')) return;

        const palette = document.createElement('div');
        palette.id = 'command-palette';
        palette.className = 'command-palette';
        palette.innerHTML = `
            <div class="palette-backdrop"></div>
            <div class="palette-container">
                <div class="palette-input-wrapper">
                    <svg class="palette-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" id="palette-input" class="palette-input" placeholder="Search posts, commands, pages..." autocomplete="off">
                    <kbd class="palette-shortcut">esc</kbd>
                </div>
                <div class="palette-results" id="palette-results"></div>
                <div class="palette-footer">
                    <span><kbd>↑↓</kbd> navigate</span>
                    <span><kbd>↵</kbd> select</span>
                    <span><kbd>esc</kbd> close</span>
                </div>
            </div>
        `;

        document.body.appendChild(palette);

        // Store refs
        this.dom = {
            palette: palette,
            backdrop: palette.querySelector('.palette-backdrop'),
            container: palette.querySelector('.palette-container'),
            input: palette.querySelector('#palette-input'),
            results: palette.querySelector('#palette-results')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
        // Global keyboard shortcut (Cmd+K or Ctrl+K)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }

            // Also open on "/" when not in input
            if (e.key === '/' && !this.isInputFocused() && !this.isOpen) {
                e.preventDefault();
                this.open();
            }
        });

        // Input events
        this.dom.input?.addEventListener('input', (e) => {
            this.search(e.target.value);
        });

        this.dom.input?.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveSelection(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveSelection(-1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.executeSelected();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;
            }
        });

        // Backdrop click to close
        this.dom.backdrop?.addEventListener('click', () => this.close());

        // Result click
        this.dom.results?.addEventListener('click', (e) => {
            const item = e.target.closest('.palette-item');
            if (item) {
                const index = parseInt(item.dataset.index, 10);
                this.selectedIndex = index;
                this.executeSelected();
            }
        });

        // Mouse hover to select
        this.dom.results?.addEventListener('mousemove', (e) => {
            const item = e.target.closest('.palette-item');
            if (item) {
                const index = parseInt(item.dataset.index, 10);
                if (index !== this.selectedIndex) {
                    this.selectedIndex = index;
                    this.updateSelection();
                }
            }
        });
    },

    /**
     * Check if an input element is focused
     */
    isInputFocused: function() {
        const active = document.activeElement;
        return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
    },

    /**
     * Toggle palette open/close
     */
    toggle: function() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    /**
     * Open the palette
     */
    open: function() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.dom.palette.classList.add('active');
        this.dom.input.value = '';
        this.dom.input.focus();
        this.search(''); // Show default results
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close the palette
     */
    close: function() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.dom.palette.classList.remove('active');
        this.dom.input.blur();
        document.body.style.overflow = '';
    },

    /**
     * Search for matching items
     */
    search: function(query) {
        const term = query.toLowerCase().trim();
        let results = [];

        // Get posts from search index
        const posts = (BlogApp.state?.searchIndex || []).map(post => ({
            type: 'post',
            title: post.title,
            description: post.description,
            url: post.url,
            date: post.date,
            tags: post.tags,
            icon: 'file-text'
        }));

        // Combine all searchable items
        const allItems = [
            ...this.COMMAND_ITEMS,
            ...this.NAV_ITEMS,
            ...posts
        ];

        if (!term) {
            // Show commands and nav when empty
            results = [
                ...this.COMMAND_ITEMS.slice(0, 5),
                ...this.NAV_ITEMS
            ];
        } else {
            // Fuzzy match
            results = allItems.filter(item => {
                const title = (item.title || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();
                const tags = (item.tags || []).join(' ').toLowerCase();

                return this.fuzzyMatch(term, title) ||
                       this.fuzzyMatch(term, desc) ||
                       tags.includes(term);
            });

            // Sort by relevance (exact matches first)
            results.sort((a, b) => {
                const aTitle = (a.title || '').toLowerCase();
                const bTitle = (b.title || '').toLowerCase();
                const aExact = aTitle.startsWith(term) ? 0 : 1;
                const bExact = bTitle.startsWith(term) ? 0 : 1;
                return aExact - bExact;
            });

            // Limit results
            results = results.slice(0, 10);
        }

        this.results = results;
        this.selectedIndex = 0;
        this.renderResults();
    },

    /**
     * Simple fuzzy matching
     */
    fuzzyMatch: function(query, text) {
        if (!query || !text) return false;

        // Simple contains check for now
        if (text.includes(query)) return true;

        // Character-by-character fuzzy match
        let qi = 0;
        for (let i = 0; i < text.length && qi < query.length; i++) {
            if (text[i] === query[qi]) qi++;
        }
        return qi === query.length;
    },

    /**
     * Render search results
     */
    renderResults: function() {
        if (!this.dom.results) return;

        if (this.results.length === 0) {
            this.dom.results.innerHTML = `
                <div class="palette-empty">No results found</div>
            `;
            return;
        }

        const html = this.results.map((item, index) => {
            const selected = index === this.selectedIndex ? 'selected' : '';
            const icon = this.getIcon(item.icon);
            const typeLabel = this.getTypeLabel(item.type);
            const subtitle = item.type === 'post' ? (item.date || '') : '';

            return `
                <div class="palette-item ${selected}" data-index="${index}">
                    <span class="palette-item-icon">${icon}</span>
                    <div class="palette-item-content">
                        <span class="palette-item-title">${this.escapeHtml(item.title)}</span>
                        ${subtitle ? `<span class="palette-item-subtitle">${subtitle}</span>` : ''}
                    </div>
                    <span class="palette-item-type">${typeLabel}</span>
                </div>
            `;
        }).join('');

        this.dom.results.innerHTML = html;
    },

    /**
     * Get type label for display
     */
    getTypeLabel: function(type) {
        const labels = {
            'cmd': 'Command',
            'nav': 'Page',
            'post': 'Post'
        };
        return labels[type] || type;
    },

    /**
     * Get SVG icon
     */
    getIcon: function(name) {
        const icons = {
            'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
            'archive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>',
            'tag': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>',
            'image': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
            'palette': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"></path></svg>',
            'brush': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',
            'user': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
            'moon': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
            'sun': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
            'shuffle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>',
            'sort-desc': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path><path d="M11 12h4"></path><path d="M11 16h7"></path><path d="M11 20h10"></path></svg>',
            'sort-asc': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="M11 4h10"></path><path d="M11 8h7"></path><path d="M11 12h4"></path></svg>',
            'chevrons-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>',
            'chevrons-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>',
            'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
        };
        return icons[name] || icons['file-text'];
    },

    /**
     * Escape HTML
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Move selection up/down
     */
    moveSelection: function(delta) {
        const len = this.results.length;
        if (len === 0) return;

        this.selectedIndex = (this.selectedIndex + delta + len) % len;
        this.updateSelection();
    },

    /**
     * Update visual selection
     */
    updateSelection: function() {
        const items = this.dom.results.querySelectorAll('.palette-item');
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === this.selectedIndex);
        });

        // Scroll into view
        const selected = items[this.selectedIndex];
        if (selected) {
            selected.scrollIntoView({ block: 'nearest' });
        }
    },

    /**
     * Execute the selected item
     */
    executeSelected: function() {
        const item = this.results[this.selectedIndex];
        if (!item) return;

        this.close();

        if (item.url) {
            window.location.href = item.url;
        } else if (item.action) {
            item.action();
        }
    }
};
