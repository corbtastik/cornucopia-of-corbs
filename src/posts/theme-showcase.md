---
title: "Theme Showcase"
date: 2025-12-25
tags: ["demo", "features", "theme"]
description: "A live visualization of the currently selected theme's color palette, typography, and code syntax."
layout: base.njk
---

This page is **live**. Use the **Theme Dropdown** in the header to change the theme, and watch the colors and fonts below update instantly to match.

---

## 1. Color Palette

Here are the core variables defining the current theme.

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; margin-bottom: 30px;">

  <!-- Primary Color -->
  <div style="background-color: var(--primary-color); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="background: rgba(0,0,0,0.5); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-bottom: 5px;">--primary</span>
    <span style="color: #fff; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">Primary</span>
  </div>

  <!-- Background Color -->
  <div style="background-color: var(--bg-color); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--text-color); font-weight: bold;">Background</span>
    <span style="color: var(--text-color); font-size: 0.8em; opacity: 0.7;">--bg-color</span>
  </div>

  <!-- Card Background -->
  <div style="background-color: var(--card-bg); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--text-color); font-weight: bold;">Card Bg</span>
    <span style="color: var(--text-color); font-size: 0.8em; opacity: 0.7;">--card-bg</span>
  </div>

  <!-- Text Color -->
  <div style="background-color: var(--bg-color); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--text-color); font-weight: bold; border-bottom: 2px solid var(--text-color);">Text Color</span>
    <span style="color: var(--text-color); font-size: 0.8em; opacity: 0.7;">--text-color</span>
  </div>

  <!-- Border Color -->
  <div style="background-color: var(--bg-color); padding: 20px; border-radius: 8px; border: 4px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--text-color); font-weight: bold;">Border</span>
    <span style="color: var(--text-color); font-size: 0.8em; opacity: 0.7;">--border-color</span>
  </div>

</div>

---

## 2. Typography

The fonts below are pulled from `src/_data/fonts.json` and assigned to CSS variables.

<div style="background: var(--card-bg); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color);">

<p style="font-family: var(--font-family-primary); font-size: 1.2rem; margin-bottom: 1rem;">
  <strong>Primary Font:</strong> <br>
  The quick brown fox jumps over the lazy dog. (1234567890)
</p>

<hr>

<h3 style="font-family: var(--font-family-secondary); margin-top: 1rem;">
  Secondary Font (Headings)
</h3>
<p style="font-family: var(--font-family-secondary);">
  ABCDEFGHIJKLMNOPQRSTUVWXYZ <br>
  abcdefghijklmnopqrstuvwxyz
</p>

<hr>

<p style="font-family: var(--font-family-monospace); margin-top: 1rem;">
  <strong>Monospace Font:</strong> <br>
  <code>const code = "looks like this";</code>
</p>

</div>

---

## 3. Syntax Highlighting

This section tests the **token colors** of your currently selected Syntax Highlight theme (e.g., Atom Dark, Dracula).

### JavaScript
```javascript
// This is a comment
import React, { useState } from 'react';

const SyntaxTest = ({ name, count = 0 }) => {
  const [isActive, setIsActive] = useState(false);

  // Function definition
  function calculateScore(points) {
    if (points > 100) return "High";
    return `Score: ${points}`;
  }

  return (
    <div className="container">
      <h1 id="title">Hello, {name}!</h1>
      <p>Count is: <span className="highlight">{count}</span></p>
      {/* Boolean and String test */}
      <button onClick={() => setIsActive(!isActive)}>
        Toggle {isActive ? "On" : "Off"}
      </button>
    </div>
  );
};

export default SyntaxTest;
```

```css
@import url('https://fonts.googleapis.com/css2');

/* Selector and properties */
body {
  background-color: #1a1a1a;
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
}

#header .logo {
  font-size: 2rem;
  color: #ff79c6; /* Hex value */
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
    display: block !important;
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Theme Test</title>
</head>
<body>
    <!-- Main Container -->
    <div id="app" data-theme="dark">
        <h1 class="title">Welcome</h1>
        <a href="https://example.com" target="_blank">Click Here</a>
        <button disabled>Disabled</button>
    </div>
</body>
</html>
```