/**
 * src/assets/js/toc.js
 * Generates Table of Contents for both Side Rail and Inline Dropdown
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Target the specific containers
    const sideTocList = document.getElementById('toc-list');
    const inlineTocList = document.getElementById('inline-toc-list');
    
    // Support either class or ID for content wrapper
    const contentArea = document.querySelector('.post-content') || document.getElementById('content-wrapper');

    if (!contentArea) return;

    // 2. Find Headers (H2 - H4)
    const headers = contentArea.querySelectorAll('h2, h3, h4');
    
    // Handle empty state: Hide wrappers if no headers found
    if (headers.length === 0) {
        const sideWrapper = document.querySelector('.toc-col');
        const inlineWrapper = document.querySelector('.inline-toc');
        if (sideWrapper) sideWrapper.style.display = 'none';
        if (inlineWrapper) inlineWrapper.style.display = 'none';
        return;
    }

    // 3. Build the Lists
    headers.forEach((header, index) => {
        // A. Ensure every header has an ID
        if (!header.id) {
            const slug = header.textContent
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-') 
                .replace(/(^-|-$)+/g, '');   
            
            header.id = slug || `section-${index}`;
        }

        // B. Define hierarchy class
        const tagName = header.tagName.toLowerCase();
        const className = `toc-${tagName}`;

        // C. Helper Function to create a list item
        const createItem = (isInline) => {
            const li = document.createElement('li');
            li.classList.add(className);
            
            const link = document.createElement('a');
            link.href = `#${header.id}`;
            link.textContent = header.textContent;

            // Click Handler for Smooth Scroll & UI interaction
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // If clicking from the Inline Dropdown, close the <details> element
                if (isInline) {
                    const details = document.getElementById('inline-toc-container');
                    if (details) details.removeAttribute('open');
                }

                // Smooth Scroll to target
                header.scrollIntoView({ behavior: 'smooth' });

                // Push history state without jumping
                history.pushState(null, null, `#${header.id}`);
            });

            li.appendChild(link);
            return li;
        };

        // D. Append to Side List (if exists)
        if (sideTocList) {
            sideTocList.appendChild(createItem(false));
        }

        // E. Append to Inline List (if exists)
        if (inlineTocList) {
            inlineTocList.appendChild(createItem(true));
        }
    });

    // 4. ScrollSpy (Only needed for the Side Rail to highlight active position)
    if (sideTocList) {
        const observerOptions = {
            root: null,
            // Top: -100px (Ignore sticky header area)
            // Bottom: -80% (Focus on top part of screen)
            rootMargin: '-100px 0px -80% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all links
                    sideTocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    
                    // Add active class to current link
                    const id = entry.target.getAttribute('id');
                    const activeLink = sideTocList.querySelector(`a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        headers.forEach(header => observer.observe(header));
    }
});