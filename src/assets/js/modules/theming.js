/**
 * Theming Module
 * Handles theme mode switching and random theme generation
 * Uses Material Design color theory: analogous, complementary, triadic relationships
 */
window.BlogApp = window.BlogApp || {};

BlogApp.theming = {
    // Material Design 2014 Color Palette
    MATERIAL_PALETTE: {
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
    },

    // Color wheel order (chromatic colors only, arranged by hue)
    COLOR_WHEEL: [
        'red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue',
        'lightBlue', 'cyan', 'teal', 'green', 'lightGreen', 'lime',
        'yellow', 'amber', 'orange', 'deepOrange'
    ],

    // Color relationship types per Material Design guidelines
    RELATIONSHIPS: ['analogous', 'complementary', 'triadic'],

    /**
     * Pick a random item from an array
     */
    pickRandom: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Get color position on the wheel (0-15)
     */
    getColorPosition: function(colorName) {
        return this.COLOR_WHEEL.indexOf(colorName);
    },

    /**
     * Get color at wheel position (wraps around)
     */
    getColorAtPosition: function(position) {
        const len = this.COLOR_WHEEL.length;
        const wrappedPos = ((position % len) + len) % len;
        return this.COLOR_WHEEL[wrappedPos];
    },

    /**
     * Get analogous colors (adjacent on wheel, +/- 1-2 positions)
     */
    getAnalogousColor: function(primaryPos) {
        const offset = this.pickRandom([1, 2, -1, -2]);
        return this.getColorAtPosition(primaryPos + offset);
    },

    /**
     * Get complementary color (opposite on wheel, +8 positions = 180°)
     */
    getComplementaryColor: function(primaryPos) {
        return this.getColorAtPosition(primaryPos + 8);
    },

    /**
     * Get triadic color (120° apart on wheel, +/- ~5 positions)
     */
    getTriadicColor: function(primaryPos) {
        const offset = this.pickRandom([5, -5, 6, -6]);
        return this.getColorAtPosition(primaryPos + offset);
    },

    /**
     * Generate a random color theme using Material Design color theory
     */
    generateRandomTheme: function() {
        const palette = this.MATERIAL_PALETTE;

        // Pick a random chromatic color as primary
        const primaryColorName = this.pickRandom(this.COLOR_WHEEL);
        const primaryPos = this.getColorPosition(primaryColorName);

        // Pick a random relationship type
        const relationship = this.pickRandom(this.RELATIONSHIPS);

        // Get secondary color based on relationship
        let accentColorName;
        switch (relationship) {
            case 'analogous':
                accentColorName = this.getAnalogousColor(primaryPos);
                break;
            case 'complementary':
                accentColorName = this.getComplementaryColor(primaryPos);
                break;
            case 'triadic':
                accentColorName = this.getTriadicColor(primaryPos);
                break;
        }

        const primaryColor = palette[primaryColorName];
        const accentColor = palette[accentColorName];

        const currentMode = document.documentElement.getAttribute('data-mode') || 'dark';

        // Generate dark mode colors
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

        // Generate light mode colors
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
            shComment: palette.grey[500]
        };

        // Store for mode toggling
        BlogApp.state.randomTheme = { dark: darkColors, light: lightColors };

        // Apply the random theme
        const colors = currentMode === 'dark' ? darkColors : lightColors;
        this.applyColors(colors, currentMode);

        BlogApp.clearSearch();
    },

    /**
     * Apply colors to CSS custom properties
     */
    applyColors: function(colors, mode) {
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

        // Update data attributes
        root.setAttribute('data-theme-set', 'random');
        root.setAttribute('data-mode', mode);

        // Update theme select
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = '';
        }
    },

    /**
     * Set theme mode (dark/light)
     */
    setMode: function(mode) {
        // Check if we're using a random theme
        if (BlogApp.state.randomTheme) {
            const colors = mode === 'dark' ? BlogApp.state.randomTheme.dark : BlogApp.state.randomTheme.light;
            this.applyColors(colors, mode);
        } else if (typeof ThemeManager !== 'undefined') {
            const { id } = ThemeManager.getCurrentTheme();
            ThemeManager.applyTheme(id, mode);
        }

        // Update the toggle button text
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerText = mode === 'dark' ? 'Light Mode' : 'Dark Mode';
        }

        BlogApp.clearSearch();
    }
};
