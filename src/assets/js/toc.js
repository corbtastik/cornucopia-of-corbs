/**
 * src/assets/js/toc.js
 * Generates Table of Contents for the Sidebar with H1-H4 support
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Target the specific container
    const tocList = document.getElementById('toc-list');
    const contentArea = document.querySelector('.post-content'); 

    if (!tocList || !contentArea) return;

    // 2. Find Headers (Updated to include H1 - H4)
    const headers = contentArea.querySelectorAll('h1, h2, h3, h4');
    
    if (headers.length === 0) {
        const container = document.getElementById('toc-container');
        if (container) container.style.display = 'none';
        return;
    }

    // 3. Build the List
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

        // B. Create List Item
        const li = document.createElement('li');
        const link = document.createElement('a');
        
        link.href = `#${header.id}`;
        link.textContent = header.textContent;
        
        // C. Apply Indentation Classes Dynamically
        // This will create classes: toc-h1, toc-h2, toc-h3, toc-h4
        const tagName = header.tagName.toLowerCase();
        li.classList.add(`toc-${tagName}`);

        li.appendChild(link);
        tocList.appendChild(li);
    });

    // 4. ScrollSpy
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -70% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const allLinks = tocList.querySelectorAll('a');
                allLinks.forEach(a => a.classList.remove('active'));
                
                const id = entry.target.getAttribute('id');
                const activeLink = tocList.querySelector(`a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    // Optional: keep active link in view
                    // activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        });
    }, observerOptions);

    headers.forEach(header => observer.observe(header));
});