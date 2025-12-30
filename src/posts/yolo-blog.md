---
title: "Yolo Blog"
date: 2025-12-25 12:00:00
tags: ["meta", "11ty", "guide", "features"]
description: "A comprehensive guide to the features, architecture, and developer workflow of this blog engine."
---

Welcome to **Corbs Blog v2.0**. This isn't just a static site; it's a feature-rich content engine built on [Eleventy](https://www.11ty.dev/). Over the last few sessions, we have transformed a basic template into a fully responsive, theme-able, and interactive platform.

Here is a breakdown of what makes this blog tick and how to use it.

## 🚀 Key Features

### 1. The "Vibe" Coding System (Advanced Theming)
We moved away from hardcoded CSS. This site uses a **CSS Variable system** that supports:
*   **Dark/Light Mode:** Persisted via `localStorage`.
*   **25+ Theme Presets:** From *Dracula* and *Synthwave '84* to *Nord* and *Monokai*.
*   **Custom Themes:** Includes custom palettes like "Corbs", "Bleu", and "Yolo".

### 2. Interactive Code Blocks
As a developer blog, code needs to be treated like a first-class citizen. We implemented a "Gemini-style" toolbar for every code block.

**Try interacting with this block:**
```javascript
function helloWorld() {
  console.log("I have a toolbar!");
  console.log("Try Copying, Downloading, or Collapsing me.");
}
```
*Features: Syntax Highlighting (PrismJS), Copy to Clipboard, Download Snippet, and Collapse.*

### 3. Image Lightbox & Grids
Images are responsive by default. We also added a **Lightbox** feature. Click any image in a grid to expand it to full screen.

<div class="image-grid">
  <img src="https://placehold.co/600x600/282a36/f8f8f2?text=Themes" alt="Theme System">
  <img src="https://placehold.co/600x600/ff79c6/282a36?text=Syntax" alt="Syntax Highlighting">
  <img src="https://placehold.co/600x600/bd93f9/282a36?text=Responsive" alt="Mobile Ready">
</div>

### 4. Navigation & Search
*   **Instant Search:** A client-side typeahead search (SPA feel) that filters posts by title, description, tags, and date.
*   **Off-Canvas Sidebar:** A smooth mobile-friendly sidebar for navigating Pages (About, Tags, Archive).
*   **Sticky Header:** The navigation bar stays with you as you scroll.

---

## 🛠️ Architecture & Development

We refactored the CSS to be modular and maintainable. Instead of one giant file, we use Nunjucks to combine partials at build time.

### CSS Structure
*   `src/_includes/css/themes.css`: Contains all color variables for the 25+ themes.
*   `src/_includes/css/main.css`: Layout, typography, and component styles.
*   `src/_includes/css/syntax/*.css`: Independent syntax highlighting themes (Atom, Dracula, etc.).
*   `src/assets/css/style.njk`: The combiner file that merges them into `style.css`.

### Configuration
You can configure global settings in `src/_data/site.json`:

```json
{
  "syntax_theme": "dracula"
}
```
*Changing "dracula" to "github-light" will instantly rebuild the site with the new code coloring.*

---

## 🏁 Getting Started

If you are cloning this repo for the first time, here is how to spin it up.

### 1. Installation
```bash
# Clone the repo
git clone https://github.com/corbtastik/corbs-blog.git

# Install dependencies (11ty, syntax plugins, etc)
npm install
```

### 2. Run Local Server
This starts the development server at `http://localhost:8080` with hot-reloading.
```bash
npm start
```

### 3. Creating a Post
Create a new Markdown file in `src/posts/`. You can use the standard frontmatter:

```yaml
---
title: "My Awesome Post"
date: 2025-12-26
tags: ["coding", "life"]
description: "This shows up in the search results."
layout: base.njk
---
```

## 📚 What's Next?

The foundation is solid. Future improvements could include:
*   **RSS Feed:** For syndication.
*   **SEO Meta Tags:** Automating OpenGraph images.
*   **Comments:** Integrating a privacy-focused comment system like Giscus.

Enjoy writing!