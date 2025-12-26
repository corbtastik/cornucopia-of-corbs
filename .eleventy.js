// .eleventy.js
const { DateTime } = require("luxon"); // Optional: helper for dates if needed later
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);
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

    return {
        dir: {
            input: "src",
            output: "_site", // The folder where plain HTML lands
            includes: "_includes"
        }
    };
};