---
title: "Theming & The Theme Builder"
date: 2026-02-07
tags: ["features", "theme", "tutorial", "design"]
description: "Discover 50+ color themes, slash commands for quick switching, and the interactive Theme Builder for creating your own custom palettes."
---

This blog takes theming seriously. 🎨 With over **50 built-in themes**, dark/light mode support, and an interactive **Theme Builder**, you can customize your reading experience exactly how you like it.

---

## 🎭 Switching Themes

### The Theme Dropdown

The easiest way to switch themes is the **dropdown menu** in the header. Themes are organized into groups:

- **Material Themes** — Based on [Material Design](https://m2.material.io/design/color/the-color-system.html) color palettes
- **Matrix Themes** — Terminal-inspired neon colors on black
- **Chroma Themes** — Vibrant, saturated color families
- **Corbs Themes** — Custom creations like Star Lord, Abyssal, and Vice (80s)

### Dark & Light Modes

Every theme has both a **dark** and **light** variant. Toggle between them using the **Light Mode / Dark Mode** button in the header. Your preference is saved to localStorage.

---

## ⌨️ Slash Commands

Power users can switch themes using slash commands in the search bar:

| Command | Action |
|---------|--------|
| `/dark` | Switch to dark mode |
| `/light` | Switch to light mode |
| `/egg` | 🥚 Generate a random theme using Material Design color theory |

The `/egg` command is fun — it picks a random primary color from the [Material Design 2014 palette](https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors), then selects a secondary color using one of three color relationships:

- **Analogous** — Adjacent colors on the wheel (harmonious)
- **Complementary** — Opposite colors (high contrast)
- **Triadic** — Colors 120° apart (balanced)

Try it a few times to discover unexpected color combinations! 🎲

---

## 🛠️ The Theme Builder

Want full control? Head to the [Theme Builder](/themes/) to create your own custom theme.

### Features

- **12 Color Properties** — Background, text, heading, link, primary, surface, border, plus 5 syntax highlighting colors
- **Live Preview** — See changes instantly in the preview panel
- **Dark & Light Editing** — Design both variants of your theme
- **Random Button** — Generate a random palette using Material Design color theory
- **Apply Theme** — Use your creation site-wide
- **Export JSON** — Get the theme definition to add to the codebase

### How It Works

1. Pick colors using the color pickers or type hex values directly
2. Watch the preview update in real-time
3. Switch between **Dark** and **Light** modes to design both variants
4. Click **Random** for inspiration (uses the same algorithm as `/egg`)
5. When happy, click **Apply Theme** to use it
6. Click **Export JSON** to save your theme definition

The exported JSON can be added to the site's theme configuration if you want to make it permanent.

---

## 🔍 Command Palette

Press **⌘K** (Mac) or **Ctrl+K** (Windows/Linux) to open the Command Palette — a spotlight-style search that lets you:

- Search all blog posts by title, description, or tags
- Run commands (dark mode, light mode, random theme, sorting)
- Navigate to any page quickly

Use **↑↓** to navigate, **Enter** to select, and **Esc** to close.

---

## 🏗️ Technical Details

For the curious, here's how the theming system works under the hood:

### CSS Custom Properties

All colors are defined as CSS custom properties (variables) on the `:root` element:

```css
:root {
  --bg-color: #0A0D24;
  --text-color: #F3E9FF;
  --heading-color: #7FD7FF;
  --link-color: #FF5DA2;
  --primary-color: #FF5DA2;
  /* ... and more */
}
```

### Runtime Injection

Themes are defined in JavaScript and applied at runtime using `style.setProperty()`. This allows instant switching without page reload.

### Persistence

Your theme choice and mode preference are saved to `localStorage`:

```javascript
localStorage.setItem('theme-set', 'star-lord');
localStorage.setItem('theme-mode', 'dark');
```

On page load, these values are read and applied before the first paint to prevent flash of unstyled content.

---

## 🎨 Go Explore

- Try the [Theme Dropdown](#) in the header
- Type `/egg` in the search bar for a random theme
- Build your own at [/themes/](/themes/)
- Press **⌘K** to open the Command Palette

Happy theming! ✨
