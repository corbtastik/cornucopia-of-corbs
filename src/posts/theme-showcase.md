---
title: "Theme Showcase"
date: 2025-12-25
tags: ["demo", "features", "theme"]
description: "A live visualization of the currently selected theme's palette, typography, and UI components."
---

This page is **live**. Use the **Theme Dropdown** in the header to change the theme. Watch how the specific Corbs-theme variables (like Containers and Tertiary colors) update instantly.

---

## 1. Color Palette

### Base Colors
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; margin-bottom: 30px;">

  <!-- Background -->
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

### Accents & Typography
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; margin-bottom: 30px;">

  <!-- Heading Color -->
  <div style="background-color: var(--bg-color); padding: 20px; border-radius: 8px; border: 1px solid var(--heading-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--heading-color); font-weight: bold;">Heading</span>
    <span style="color: var(--text-color); font-size: 0.8em; opacity: 0.7;">--heading-color</span>
  </div>

  <!-- Link Color -->
  <div style="background-color: var(--bg-color); padding: 20px; border-radius: 8px; border: 1px solid var(--link-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--link-color); font-weight: bold; text-decoration: underline;">Link</span>
    <span style="color: var(--text-color); font-size: 0.8em; opacity: 0.7;">--link-color</span>
  </div>

  <!-- Tertiary Color -->
  <div style="background-color: var(--bg-color); padding: 20px; border-radius: 8px; border: 1px solid var(--tertiary-color); display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--tertiary-color); font-weight: bold;">Tertiary</span>
    <span style="color: var(--text-color); font-size: 0.8em; opacity: 0.7;">--tertiary-color</span>
  </div>

</div>

### Containers
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">

  <!-- Primary Container -->
  <div style="background-color: var(--primary-container-bg); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--on-primary-container-color); font-weight: bold;">Primary Container</span>
    <span style="color: var(--on-primary-container-color); font-size: 0.8em; opacity: 0.8;">(Sidebar BG)</span>
  </div>

  <!-- Secondary Container -->
  <div style="background-color: var(--secondary-container-bg); padding: 20px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; text-align: center;">
    <span style="color: var(--on-secondary-container-color); font-weight: bold;">Secondary Container</span>
    <span style="color: var(--on-secondary-container-color); font-size: 0.8em; opacity: 0.8;">(Blockquotes/Tags)</span>
  </div>

</div>

---

## 2. Typography

<div style="background: var(--card-bg); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color);">

<p style="font-family: var(--font-family-primary); font-size: 1.2rem; margin-bottom: 1rem;">
  <strong>Primary Font:</strong> <br>
  The quick brown fox jumps over the lazy dog. (1234567890)
</p>

<hr>

<h3 style="font-family: var(--font-family-secondary); margin-top: 1rem; color: var(--heading-color);">
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

## 3. UI Components

Testing the specific element styles we implemented.

### Blockquotes
> This is a blockquote. In the Corbs theme, this uses `secondary-container-bg` for the background, `tertiary-color` for the border, and `on-secondary-container-color` for text.

### Tags (Pills)
These use the new Pill styling:
<div class="tag-list">
  <a href="#" class="tag">#database</a>
  <a href="#" class="tag">#css</a>
  <a href="#" class="tag">#design</a>
  <a href="#" class="tag">#11ty</a>
</div>

### Data Tables
The custom grid styling for data.

| Player | Average | HR |
| :--- | :--- | :--- |
| **Hank Aaron** | .305 | 755 |
| **Babe Ruth** | .342 | 714 |
| **Mookie Wilson** | .274 | 67 |

---

## 4. Syntax Highlighting

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