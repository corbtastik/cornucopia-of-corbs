// .eleventy.js
const { DateTime } = require("luxon"); // Optional: helper for dates if needed later
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    // DRAFTS LOGIC
    // If in production mode, ignore the drafts folder.
    if (process.env.ELEVENTY_ENV === "production") {
        eleventyConfig.ignores.add("src/drafts");
    }

    eleventyConfig.addPlugin(syntaxHighlight);
    // --- NEW DATE FILTERS START ---
    // 1. Human Readable (e.g., "October 4, 2023")
    eleventyConfig.addFilter("dateReadable", (dateObj) => {
        // We use 'utc' to prevent the date shifting by one day due to timezone offsets
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("LLLL d, yyyy");
    });

    // 2. Machine Readable (e.g., "2023-10-04") for <time datetime=""> attributes
    eleventyConfig.addFilter("dateIso", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISODate();
    });

    // 2b. RFC 822 format for RSS feeds
    eleventyConfig.addFilter("dateRfc822", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toRFC2822();
    });

    // 3. Reading Time (e.g., "5 min read")
    eleventyConfig.addFilter("readingTime", (content) => {
        if (!content) return "1 min read";
        // Strip HTML tags and count words
        const text = content.replace(/<[^>]*>/g, '');
        const words = text.trim().split(/\s+/).length;
        const wordsPerMinute = 200;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    });

    // Absolute URL helper (for sitemap/feed)
    eleventyConfig.addFilter("absoluteUrl", (url, siteUrl) => {
        if (!siteUrl) return url;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return `${siteUrl.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
    });

    // Copy the `favicon.ico` to the output folder
    eleventyConfig.addPassthroughCopy("favicon.ico");
    // --- NEW DATE FILTERS END ---
    // Copy the `assets` folder to the output
    eleventyConfig.addPassthroughCopy("src/assets");
    
    // Create a collection for search
    eleventyConfig.addCollection("posts", function(collection) {
        return collection.getFilteredByGlob("src/posts/*.md");
    });

    // GITHUB GIST SHORTCODE
    eleventyConfig.addShortcode("gist", (url, file) => {
        // Ensure the URL ends in .js for the embed script
        let embedUrl = url;
        if (!embedUrl.endsWith(".js")) {
        embedUrl += ".js";
        }
        
        // If a specific file is requested, append it
        if (file) {
        embedUrl += `?file=${file}`;
        }

        return `<div class="gist-wrapper"><script src="${embedUrl}"></script></div>`;
    });

    // GOOGLE SLIDES SHORTCODE
    eleventyConfig.addShortcode("slide", (url, title) => {
        return `
        <div class="slide-container">
            <iframe 
            src="${url}" 
            title="${title || 'Google Slides presentation'}"
            frameborder="0" 
            allowfullscreen="true" 
            mozallowfullscreen="true" 
            webkitallowfullscreen="true">
            </iframe>
        </div>
        `;
    });

    // YOUTUBE SHORTCODE
    eleventyConfig.addShortcode("youtube", (videoURL, title) => {
        // Regex to extract video ID from various YouTube URL formats
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = videoURL.match(regExp);
        const videoId = (match && match[7].length == 11) ? match[7] : false;

        if (!videoId) {
        return `<p style="color: red">Error: Invalid YouTube URL provided</p>`;
        }

        // Return the HTML (Wrapped in a responsive container)
        return `
        <div class="video-container">
            <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            title="${title || 'YouTube video player'}"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
            </iframe>
        </div>
        `;
    });

    // GALLERY SHORTCODE
    // Usage: {% gallery myDataArray %}
    eleventyConfig.addShortcode("gallery", function(photos) {
        if (!photos || !Array.isArray(photos)) {
        return ""; // Fail silently if data is missing
        }

        // Generate the HTML string
        let html = '<div class="masonry-grid">';
        
        photos.forEach(photo => {
        // Handle fallbacks if some fields are missing in the Front Matter
        const src = photo.src;
        const thumb = photo.thumb || photo.src; // Use full src if no thumb provided
        const caption = photo.caption || "";
        const alt = photo.alt || caption || " ";
        
        html += `
            <div class="gallery-item">
            <img 
                src="${thumb}" 
                data-full-src="${src}" 
                alt="${alt}" 
                loading="lazy" 
                class="lightbox-trigger"
                data-caption="${caption}"
            />
            ${caption ? `<div class="overlay"><span>${caption}</span></div>` : ''}
            </div>
        `;
        });

        html += '</div>';
        return html;
    });

    return {
        dir: {
            input: "src",
            output: "_site", // The folder where plain HTML lands
            includes: "_includes"
        }
    };
};
