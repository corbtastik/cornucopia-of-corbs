---
title: "Gallery Component Demo"
date: 2025-12-27
tags: ["photography", "demo"]
description: "A demonstration of the custom gallery shortcode using 25 sample images."
layout: base.njk
# We define the data array right here in the Front Matter
# The shortcode {% gallery post_images %} will read this list.
post_images:
  - src: "https://picsum.photos/id/1015/800/600"
    thumb: "https://picsum.photos/id/1015/400/300"
    caption: "Winter River Valley"
    alt: "River valley"
    
  - src: "https://picsum.photos/id/1016/600/800"
    thumb: "https://picsum.photos/id/1016/300/400"
    caption: "Canyon Depths"
    alt: "Canyon cliffs"

  - src: "https://picsum.photos/id/1018/800/800"
    thumb: "https://picsum.photos/id/1018/400/400"
    caption: "High Altitude"
    alt: "Mountain range"

  - src: "https://picsum.photos/id/1019/800/500"
    thumb: "https://picsum.photos/id/1019/400/250"
    caption: "Morning Walk"
    alt: "Forest path"

  - src: "https://picsum.photos/id/1020/600/900"
    thumb: "https://picsum.photos/id/1020/300/450"
    caption: "Wildlife Encounter"
    alt: "Bear in woods"

  - src: "https://picsum.photos/id/1021/800/600"
    thumb: "https://picsum.photos/id/1021/400/300"
    caption: "Foggy Morning"
    alt: "Misty forest"

  - src: "https://picsum.photos/id/1022/900/600"
    thumb: "https://picsum.photos/id/1022/450/300"
    caption: "Stargazing"
    alt: "Night sky stars"

  - src: "https://picsum.photos/id/1023/600/600"
    thumb: "https://picsum.photos/id/1023/300/300"
    caption: "Urban Commute"
    alt: "Red bicycle"

  - src: "https://picsum.photos/id/1024/800/400"
    thumb: "https://picsum.photos/id/1024/400/200"
    caption: "Bird of Prey"
    alt: "Vulture flying"

  - src: "https://picsum.photos/id/1025/600/800"
    thumb: "https://picsum.photos/id/1025/300/400"
    caption: "Cozy Dog"
    alt: "Pug in blanket"

  - src: "https://picsum.photos/id/1035/800/600"
    thumb: "https://picsum.photos/id/1035/400/300"
    caption: "Hidden Falls"
    alt: "Waterfall"

  - src: "https://picsum.photos/id/1036/900/500"
    thumb: "https://picsum.photos/id/1036/450/250"
    caption: "Alpine Ridge"
    alt: "Snowy mountains"

  - src: "https://picsum.photos/id/1037/600/600"
    thumb: "https://picsum.photos/id/1037/300/300"
    caption: "Camp Vibes"
    alt: "Forest campfire"

  - src: "https://picsum.photos/id/1038/500/800"
    thumb: "https://picsum.photos/id/1038/250/400"
    caption: "Into the Unknown"
    alt: "Road tunnel"

  - src: "https://picsum.photos/id/1039/800/500"
    thumb: "https://picsum.photos/id/1039/400/250"
    caption: "Power of Water"
    alt: "Waterfall close up"

  - src: "https://picsum.photos/id/1040/800/600"
    thumb: "https://picsum.photos/id/1040/400/300"
    caption: "Historic Sites"
    alt: "Castle view"

  - src: "https://picsum.photos/id/1041/600/800"
    thumb: "https://picsum.photos/id/1041/300/400"
    caption: "Ocean Fury"
    alt: "Waves crashing"

  - src: "https://picsum.photos/id/1042/800/800"
    thumb: "https://picsum.photos/id/1042/400/400"
    caption: "Garden Blooms"
    alt: "Red flowers"

  - src: "https://picsum.photos/id/1043/900/400"
    thumb: "https://picsum.photos/id/1043/450/200"
    caption: "Coding Late"
    alt: "Keyboard close up"

  - src: "https://picsum.photos/id/1044/600/900"
    thumb: "https://picsum.photos/id/1044/300/450"
    caption: "Blue Calm"
    alt: "Ocean horizon"

  - src: "https://picsum.photos/id/1045/800/600"
    thumb: "https://picsum.photos/id/1045/400/300"
    caption: "Sand Waves"
    alt: "Desert dunes"

  - src: "https://picsum.photos/id/1049/800/500"
    thumb: "https://picsum.photos/id/1049/400/250"
    caption: "Departure"
    alt: "Train station"

  - src: "https://picsum.photos/id/1050/600/800"
    thumb: "https://picsum.photos/id/1050/300/400"
    caption: "Industrial Sunset"
    alt: "Factory smoke"

  - src: "https://picsum.photos/id/1051/800/800"
    thumb: "https://picsum.photos/id/1051/400/400"
    caption: "Over Troubled Water"
    alt: "Bridge view"

  - src: "https://picsum.photos/id/1052/900/600"
    thumb: "https://picsum.photos/id/1052/450/300"
    caption: "Where Land Meets Sea"
    alt: "Forest coast"
---

# Gallery Shortcode Demo

This post demonstrates how to embed a Masonry Gallery directly inside a markdown file using the custom Shortcode.

The images are defined in the **YAML Front Matter** of this file (see `post_images`), which gives you full control over captions and order per post.

---

{% gallery post_images %}

---

## How it works

1.  **Define Data:** Add a list of images (src, thumb, caption) to the Front Matter.
2.  **Use Shortcode:** pass the variable name to the shortcode `{% raw %}{% gallery post_images %}{% endraw %}`.
3.  **Result:** A responsive masonry grid that uses your existing `lightbox.js` and CSS variables.