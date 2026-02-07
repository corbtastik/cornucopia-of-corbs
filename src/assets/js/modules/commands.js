/**
 * Commands Module
 * Handles function codes (slash commands) in the search bar
 */
window.BlogApp = window.BlogApp || {};

BlogApp.commands = {
    // Function code definitions
    CODES: {
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
    },

    /**
     * Check if input is a function code and execute it
     * @returns {boolean} true if a function code was executed
     */
    handle: function(input) {
        const code = input.toLowerCase().trim();

        // Check for exact match first
        if (this.CODES.hasOwnProperty(code)) {
            const cmd = this.CODES[code];

            if (cmd.url) {
                window.location.href = cmd.url;
                return true;
            }

            if (cmd.action && !cmd.hasParam) {
                this.executeAction(cmd.action);
                return true;
            }
        }

        // Check for parameterized commands (e.g., /tag photos)
        const parts = code.split(' ');
        const baseCmd = parts[0];
        const param = parts.slice(1).join(' ');

        if (this.CODES.hasOwnProperty(baseCmd)) {
            const cmd = this.CODES[baseCmd];

            if (cmd.hasParam && cmd.action && param) {
                this.executeAction(cmd.action, param);
                return true;
            }
        }

        return false;
    },

    /**
     * Execute an action-based function code
     */
    executeAction: function(action, param) {
        switch (action) {
            case 'sortOld':
                BlogApp.sorting.sortOldest();
                break;
            case 'sortNew':
                BlogApp.sorting.sortNewest();
                break;
            case 'filterTag':
                BlogApp.filtering.filterByTag(param);
                break;
            case 'goFirst':
                BlogApp.pagination.goFirst();
                break;
            case 'goLast':
                BlogApp.pagination.goLast();
                break;
            case 'goNext':
                BlogApp.pagination.goNext();
                break;
            case 'goPrev':
                BlogApp.pagination.goPrev();
                break;
            case 'goPage':
                BlogApp.pagination.goToPage(parseInt(param, 10));
                break;
            case 'setDark':
                BlogApp.theming.setMode('dark');
                break;
            case 'setLight':
                BlogApp.theming.setMode('light');
                break;
            case 'randomTheme':
                BlogApp.theming.generateRandomTheme();
                break;
        }
    },

    /**
     * Display all available function codes
     */
    displayCodes: function(currentInput) {
        const code = currentInput.toLowerCase().trim();

        // Check if it's a valid executable command
        const isExactMatch = this.CODES.hasOwnProperty(code) && !this.CODES[code].hasParam;
        const isParamMatch = this.isParameterizedMatch(code);

        let html = '<li class="post-item function-codes-list">';
        html += '<p><strong>Function Codes</strong></p>';
        html += '<ul style="list-style: none; padding: 0; margin: 0.5rem 0 0 0;">';

        for (const [cmd, info] of Object.entries(this.CODES)) {
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
    },

    /**
     * Check if input matches a parameterized command with a value
     */
    isParameterizedMatch: function(code) {
        const parts = code.split(' ');
        const baseCmd = parts[0];
        const param = parts.slice(1).join(' ');

        if (this.CODES.hasOwnProperty(baseCmd)) {
            const cmd = this.CODES[baseCmd];
            return cmd.hasParam && param.length > 0;
        }

        return false;
    }
};
