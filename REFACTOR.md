# Refactoring Recommendations

Code review performed February 2026 to identify cleanup and refactoring opportunities for better software engineering design.

---

## High Priority Issues

### 1. search.js is Monolithic (556 lines, 6 concerns)

**File**: `src/assets/js/search.js`

**Problem**: Single file handles search, pagination, theme switching, tag filtering, sorting, and function codes.

**Why it matters**:
- Difficult to test individual features
- Hard to reuse components
- Changes to one feature might break another
- High cognitive load

**Fix**: Split into modules:
```
src/assets/js/modules/
├── search.js        (search/filter logic only)
├── pagination.js    (page navigation)
├── theming.js       (theme switching)
├── sorting.js       (post sorting)
└── commands.js      (slash command processing)
```

---

### 2. Duplicate Lightbox CSS

**Files**: `src/_includes/css/main.css` (lines 801-839) AND `src/_includes/css/gallery.css` (lines 83-204)

**Problem**: Lightbox styles defined in two places with conflicting/duplicate rules.

**Why it matters**:
- CSS bloat (~100+ duplicate lines)
- Changes needed in two places
- Specificity conflicts

**Fix**: Consolidate all lightbox styles into `gallery.css` or create dedicated `_lightbox.css`.

---

### 3. Global Transitions on ALL Elements

**File**: `src/_includes/css/visual-polish.css` (lines 10-51)

**Problem**:
```css
*, *::before, *::after {
    transition-property: background-color, border-color, color, fill, stroke, box-shadow;
    transition-duration: var(--transition-speed);
}
```

**Why it matters**:
- Performance hit on every DOM element
- Causes smooth scrolling issues
- Contradictory rules (exemptions then re-enabling)

**Fix**: Apply transitions only to interactive elements:
```css
a, button, .theme-btn, input, select {
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
```

---

### 4. Unguarded DOM Globals

**File**: `src/assets/js/search.js` (lines 468-471)

**Problem**: Global DOM elements used without null checks:
```javascript
const searchInput = document.getElementById('search-input');
const contentWrapper = document.getElementById('content-wrapper');
// ... used later without checking if they exist
```

**Why it matters**:
- Will crash on pages without search elements
- Silent failures
- Difficult debugging

**Fix**: Add guard function:
```javascript
function isSearchPage() {
    return !!(searchInput && contentWrapper && resultsWrapper && resultsList);
}
```

---

### 5. Missing URL Validation in Shortcodes

**File**: `.eleventy.js` (lines 60-73)

**Problem**: Gist shortcode doesn't validate URLs:
```javascript
eleventyConfig.addShortcode("gist", (url, file) => {
    // No validation that URL is actually a gist
    return `<script src="${embedUrl}"></script>`;
});
```

**Why it matters**:
- Security risk if user-controlled content is included
- Could break pages with bad URLs

**Fix**:
```javascript
if (!url.includes('gist.github.com')) {
    console.warn(`Invalid gist URL: ${url}`);
    return `<!-- Invalid gist URL -->`;
}
```

---

## Medium Priority Issues

### 6. Broken vim-style "gg" Navigation

**File**: `src/assets/js/reading-experience.js` (lines 149-150)

**Problem**: Uses `this.lastKey` inside IIFE where `this` doesn't persist state properly.

**Fix**: Move state to outer scope:
```javascript
const keyboardState = { lastKey: null, lastKeyTime: 0 };
// Access keyboardState.lastKey instead of this.lastKey
```

---

### 7. Magic Number Duplication

**Files**: `src/assets/js/search.js` (line 64) and `src/index.njk` (line 6)

**Problem**: `POSTS_PER_PAGE = 10` defined in both JS and template.

**Fix**: Use data attribute on pagination div that JS reads:
```html
<div class="pagination" data-posts-per-page="{{ pagination.size }}">
```

---

### 8. themes.js is 338 Lines

**File**: `src/_data/themes.js`

**Problem**: All 51 themes in one massive object literal.

**Why it matters**:
- Difficult to maintain
- High cognitive load to find specific theme
- Easy to make copy-paste mistakes

**Fix**: Split into separate files:
```
src/_data/themes/
├── index.js      (exports combined data)
├── material.js   (Material themes)
├── matrix.js     (Matrix themes)
├── chroma.js     (Chroma themes)
└── corbs.js      (Custom themes)
```

---

### 9. Date Format Inconsistency

**Files**: `src/_includes/components/post-item.njk` and `src/_includes/post.njk`

**Problem**:
- Post list uses ISO: `2025-02-07`
- Post page uses readable: `February 7, 2025`

**Fix**: Use `dateReadable` filter everywhere for consistency.

---

### 10. Dead Code in gallery.js

**File**: `src/_data/gallery.js` (lines 6-14)

**Problem**: Commented-out GCS/local photo source code with "for UI testing" comment.

**Fix**: Either remove dead code or complete the implementation with environment variable checks.

---

## Low Priority / Quick Wins

| Issue | File | Fix |
|-------|------|-----|
| Unused `hide_tags` parameter | `post-item.njk` line 12 | Remove or implement |
| Hard-coded 6-item stagger animation | `visual-polish.css` lines 181-186 | Extend to 25+ or use JS |
| Fragile slug generation (no Unicode) | `toc.js` lines 32-36 | Add `.normalize('NFKD')` |
| Duplicate animation init patterns | `reading-experience.js` + `visual-polish.js` | Create shared `dom-ready.js` utility |
| Inefficient selector overlap | `lightbox.js` line 10 | Deduplicate selectors |
| Missing null safety in theme loop | `base.njk` lines 59-67 | Add `{% if themes.groups %}` guard |
| Complex pseudo-element backgrounds | `main.css` lines 89-112 | Make optional via data attribute |
| Inconsistent scroll-margin-top | `main.css` lines 37-39 vs 1363-1370 | Use CSS calc with variable |

---

## Architecture Observations

### Global State Scattered Across Files
- `search.js`: global `searchIndex`
- `visual-polish.js`: `window._randomTheme`
- Multiple files use window for callbacks

**Recommendation**: Create centralized state management or use localStorage appropriately.

### Inconsistent Naming Conventions
- JS functions: camelCase (`openLightbox`)
- JS variables: mixed (`btnDownload` vs `searchInput`)
- CSS classes: mostly kebab-case but some inconsistency

**Recommendation**: Document conventions in CONTRIBUTING.md.

---

## Recommended Refactoring Order

1. **Split search.js into modules** - Biggest maintainability impact
2. **Consolidate lightbox CSS** - Reduces duplication and confusion
3. **Fix global transitions** - Performance improvement
4. **Add null guards to search.js** - Prevents crashes
5. **Split themes.js** - Easier theme management
6. **Remove dead code** - Cleaner codebase
7. **Fix date format inconsistency** - Better UX
8. **Add URL validation** - Security improvement

---

## Summary Table

| Issue | Severity | Type | Effort |
|-------|----------|------|--------|
| Monolithic search.js | High | Architecture | Medium |
| Duplicate lightbox CSS | High | Duplication | Low |
| Global transitions | High | Performance | Low |
| Unguarded DOM globals | High | Crash Risk | Low |
| Missing URL validation | High | Security | Low |
| Broken gg navigation | Medium | Logic Bug | Low |
| Magic number duplication | Medium | Configuration | Low |
| Large themes.js | Medium | Maintainability | Medium |
| Date format inconsistency | Low | UX | Low |
| Dead gallery.js code | Medium | Dead Code | Low |
