# Corbs Blog

A high-performance, customizable personal blog built with [Eleventy (11ty)](https://www.11ty.dev/). This project features a robust theming system, instant client-side search, and a clean Markdown-first writing workflow.

## 🚀 Features

*   **Markdown-First Workflow:** Write posts in standard Markdown (`.md`) with Front Matter.
*   **Advanced Theming System:**
    *   **Dark/Light Mode:** Instant toggle with persistence (localStorage).
    *   **25+ Color Themes:** Includes Synthwave '84, Dracula, Nord, Monokai, and a custom "Corbs" theme.
    *   **CSS Variables:** Efficient styling with no heavy CSS frameworks.
*   **Instant Search:** Typeahead search that filters content instantly without reloading the page (SPA-feel).
*   **Configurable Typography:** Fonts are managed centrally via `src/_data/fonts.json`.
*   **Style Guide:** Includes a "Kitchen Sink" page to test typography, tables, and code blocks.
*   **Responsive Design:** Sticky header, mobile-friendly layouts, and responsive tables.
*   **Test Data Generator:** Includes a Bash script to generate dummy content for stress testing.

## 🛠️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v14 or higher recommended)
*   npm

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/corbs-blog.git
cd corbs-blog
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
This will start the local server (usually at `http://localhost:8080`) and watch for changes.
```bash
npm start
```

### 4. Build for Production
To generate the static site into the `_site` folder without running a server:
```bash
npm run build
```

## 📂 Project Structure

```text
corbs-blog/
├── src/
│   ├── _data/          # Global data files (fonts.json, etc.)
│   ├── _includes/      # Layouts (base.njk)
│   ├── assets/         # CSS and JS files
│   ├── posts/          # Your blog posts (.md files)
│   ├── index.njk       # Homepage template
│   └── search.njk      # Generates the search.json index
├── .gitignore
├── .eleventy.js        # 11ty Configuration
├── generate_posts.sh   # Script to generate dummy content
├── package.json
└── README.md
```

## 🎨 Customization

### Adding/Editing Posts
Create a new Markdown file in `src/posts/`. Ensure it has the required Front Matter:

```yaml
---
title: "My New Post"
date: 2025-12-24
tags: ["coding", "life"]
description: "A short summary of the post."
layout: base.njk
---

Your content goes here...
```

### Changing Fonts
Edit `src/_data/fonts.json`. You can update the Google Fonts URL and the CSS stack strings for Primary (Space Mono), Secondary (Montserrat), and Monospace (Source Code Pro) fonts.

### Modifying Themes
Themes are defined in `src/assets/css/style.css`.
To add a new theme, add a new block following this pattern:

```css
html[data-theme-set="my-new-theme"][data-mode="dark"] {
    --bg-color: #...;
    --text-color: #...;
    /* ... other variables */
}
```
Then add the option to the `<select>` dropdown in `src/_includes/base.njk`.

## 🧪 Testing

### Generating Dummy Content
To test search performance or pagination with a large number of posts, run the included Bash script. This will generate 50 Markdown files in `src/posts/`.

```bash
chmod +x generate_posts.sh
./generate_posts.sh
```

*Note: To clean up, simply delete the `generated-post-*.md` files.*

## 📚 References & Tech Stack

*   **Static Site Generator:** [Eleventy](https://www.11ty.dev/)
*   **Templating:** [Nunjucks](https://mozilla.github.io/nunjucks/)
*   **Styling:** CSS3 (Variables & Flexbox)
*   **Icons:** None (Text-based UI for performance)
*   **Fonts:** [Google Fonts](https://fonts.google.com/)

## Font pairings to try

### The Enhanced Classic (Montserrat + Open Sans)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Open+Sans:wght@400;700&family=Source+Code+Pro:wght@400;700&display=swap",
  "primary": "'Montserrat', sans-serif",
  "secondary": "'Open Sans', sans-serif",
  "monospace": "'Source Code Pro', monospace"
}
```

### The Modern Minimalist (Inter + Roboto)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Roboto:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap",
  "primary": "'Inter', sans-serif",
  "secondary": "'Roboto', sans-serif",
  "monospace": "'JetBrains Mono', monospace"
}
```

### The Geometric Edge (Space Grotesk + Plus Jakarta Sans)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Plus+Jakarta+Sans:wght@400;700&family=Fira+Code:wght@400;700&display=swap",
  "primary": "'Space Grotesk', sans-serif",
  "secondary": "'Plus Jakarta Sans', sans-serif",
  "monospace": "'Fira Code', monospace"
}
```

### The Developer First (Monospace Primary)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap",
  "primary": "'Space Mono', monospace",
  "secondary": "'Inter', sans-serif",
  "monospace": "'JetBrains Mono', monospace"
}
```

### The Modern Editorial (Syne + Archivo)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Archivo:wght@400;700&family=IBM+Plex+Mono:wght@400;700&display=swap",
  "primary": "'Syne', sans-serif",
  "secondary": "'Archivo', sans-serif",
  "monospace": "'IBM Plex Mono', monospace"
}
```

### The Approachable (Work Sans + Quicksand)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&family=Quicksand:wght@400;700&family=Ubuntu+Mono:wght@400;700&display=swap",
  "primary": "'Work Sans', sans-serif",
  "secondary": "'Quicksand', sans-serif",
  "monospace": "'Ubuntu Mono', monospace"
}
```

### The High-Performance Minimalist (Manrope + Public Sans)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Public+Sans:wght@400;700&family=Source+Code+Pro:wght@400;700&display=swap",
  "primary": "'Manrope', sans-serif",
  "secondary": "'Public Sans', sans-serif",
  "monospace": "'Source Code Pro', monospace"
}
```

### The Sharp Future (Sora + Red Hat Display)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Red+Hat+Display:wght@400;700&family=Space+Mono:wght@400;700&display=swap",
  "primary": "'Sora', sans-serif",
  "secondary": "'Red Hat Display', sans-serif",
  "monospace": "'Space Mono', monospace"
}
```

### The Reader’s Choice (Lexend + Lato)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&family=Lato:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap",
  "primary": "'Lexend', sans-serif",
  "secondary": "'Lato', sans-serif",
  "monospace": "'Roboto Mono', monospace"
}
```

### The Structural Industrial (B612 + Heebo)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=B612:wght@400;700&family=Heebo:wght@400;700&family=Inconsolata:wght@400;700&display=swap",
  "primary": "'B612', sans-serif",
  "secondary": "'Heebo', sans-serif",
  "monospace": "'Inconsolata', monospace"
}
```

### The IBM Aesthetic (IBM Plex Serif + IBM Plex Sans)

```json
{
  "url": "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;700&family=IBM+Plex+Sans:wght@400;700&family=IBM+Plex+Mono:wght@400;700&display=swap",
  "primary": "'IBM Plex Serif', serif",
  "secondary": "'IBM Plex Sans', sans-serif",
  "monospace": "'IBM Plex Mono', monospace"
}
```

### The Red Hatter

```json
{
  "url": "https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;700;900&family=Red+Hat+Mono:wght@400;700&family=Red+Hat+Text:ital,wght@0,400;0,700;1,400&display=swap",
  "primary": "'Red Hat Display', sans-serif",
  "secondary": "'Red Hat Text', sans-serif",
  "monospace": "'Red Hat Mono', monospace"
}
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

