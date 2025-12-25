---
title: "Markdown Style Guide"
date: 2025-12-24
tags: ["demo", "features", "css-testing"]
description: "A comprehensive guide showing how all markdown elements are rendered."
layout: base.njk
---

## Introduction

This page is a **style guide**. It exists to test the visual appearance of all standard Markdown elements. Below, you will find typography, lists, code, tables, and media.

---

## Typography

### Headings

# Heading Level 1
## Heading Level 2
### Heading Level 3
#### Heading Level 4
##### Heading Level 5
###### Heading Level 6

### Text Formatting

You can make text **bold**, *italic*, or ***bold and italic***. 

You can also use ~~strikethrough~~ to indicate deleted text.

### Blockquotes

> This is a blockquote. It is often used to highlight important information or quote external sources.
>
> > It can also be nested.

---

## Lists

### Unordered List
*   Item one
*   Item two
    *   Nested item A
    *   Nested item B
*   Item three

### Ordered List
1.  First step
2.  Second step
3.  Third step

### Task List
- [x] Create the blog
- [x] Write the first post
- [ ] Style the CSS

---

## Code

### Inline Code
You can format code appearing within a paragraph, like `npm install @11ty/eleventy`, using backticks.

### Code Blocks
Here is a block of JavaScript code:

```javascript
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};

greet('World');
```

Here is some CSS:

```css
body {
  background-color: #1a1a1a;
  color: #ffffff;
}
```

---

## Media

### Images
Here is a sample image with alt text and a title.

![A placeholder image of a mountain landscape](https://placehold.co/600x400/EEE/31343C?text=Sample+Image)
*Figure: This is a caption for the image above.*

### Standard Image
![A beautiful mountain landscape](https://placehold.co/600x400/2ecc71/ffffff?text=Mountain+View "Mountain View")

### Linked Image (Clickable)
[![Click to visit Google](https://placehold.co/600x100/3498db/ffffff?text=CLICK+ME+TO+GO+TO+GOOGLE)](https://www.google.com)

### Image with Caption
![Abstract Art](https://placehold.co/400x400/9b59b6/ffffff?text=Abstract+Art)
*Figure 1: An example of abstract placeholder art.*

### HTML Image (sized to 200px wide)
<img src="https://placehold.co/400x400/e74c3c/ffffff?text=HTML+Img" alt="Small Red Box" width="200" height="200" style="border-radius: 10px;">

---

## Media Gallery

### Fluid Image
![Wide banner image](https://placehold.co/800x300/1a1a1a/ffffff?text=Wide+Banner)

### Linked Image
[![Click this banner](https://placehold.co/600x150/007bff/ffffff?text=Clickable+Banner)](https://www.11ty.dev/)

### Image Grid (Using HTML)
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="https://placehold.co/150" alt="Square 1">
  <img src="https://placehold.co/150" alt="Square 2">
  <img src="https://placehold.co/150" alt="Square 3">
</div>

---

## Links
Here is a link to [Eleventy's Documentation](https://www.11ty.dev/).

---

## Tables

Tables are great for structured data.

| Feature | Support | Notes |
| :--- | :---: | ---: |
| Markdown | Yes | Standard content format |
| Nunjucks | Yes | Templating engine |
| SCSS | Optional | Requires build step |

---

## Other Elements

### Horizontal Rules
Separators can be created with three dashes:

---