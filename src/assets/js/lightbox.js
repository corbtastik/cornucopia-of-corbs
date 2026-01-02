/**
 * src/assets/js/lightbox.js
 * Handles the full-screen gallery overlay with navigation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Selectors
  // Select explicit triggers OR any image inside .gallery-item OR .image-grid
  const triggers = document.querySelectorAll('.lightbox-trigger, .gallery-item img, .image-grid img');
  const lightbox = document.getElementById('lightbox');

  // If no lightbox container or no images found, exit
  if (!lightbox || triggers.length === 0) return;

  // 2. Inject HTML Structure (Robust Check)
  // We check if the required '.lightbox-image' class is missing. 
  // If it is missing, we wipe the container and rebuild it to ensure it matches our JS logic.
  if (!lightbox.querySelector('.lightbox-image')) {
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav prev" aria-label="Previous">&#10094;</button>
      <div class="lightbox-content">
        <img src="" alt="" class="lightbox-image">
        <div class="lightbox-caption"></div>
      </div>
      <button class="lightbox-nav next" aria-label="Next">&#10095;</button>
    `;
  }

  // 3. State & Elements
  let currentIndex = 0;
  const galleryItems = Array.from(triggers);
  
  // These are now guaranteed to exist because of step 2
  const imgElement = lightbox.querySelector('.lightbox-image');
  const captionElement = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  // 4. Functions
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    
    // Focus for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const currentTrigger = galleryItems[currentIndex];
    
    // Logic: Use 'data-full-src' (Portfolio) -> Fallback to 'src' (Style Guide)
    const fullSrc = currentTrigger.dataset.fullSrc || currentTrigger.src;
    const caption = currentTrigger.dataset.caption || currentTrigger.alt || '';
    const alt = currentTrigger.alt || '';

    if (imgElement) {
      imgElement.src = fullSrc;
      imgElement.alt = alt;
    }

    if (captionElement) {
      captionElement.textContent = caption;
      // Hide caption box if text is empty to keep UI clean
      captionElement.style.display = caption ? 'inline-block' : 'none';
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }

  // 5. Event Listeners
  
  // Add click to all detected images
  galleryItems.forEach((item, index) => {
    item.style.cursor = 'zoom-in'; // Visual hint
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Click handler for the Lightbox overlay
  lightbox.addEventListener('click', (e) => {
    // Close if clicking:
    // 1. The background overlay (lightbox)
    // 2. The Close 'X' button
    // 3. The Image itself (NEW)
    if (e.target === lightbox || 
        e.target.classList.contains('lightbox-close') || 
        e.target.classList.contains('lightbox-image')) {
      closeLightbox();
    }
    
    // Navigation clicks
    if (e.target.classList.contains('next')) showNext();
    if (e.target.classList.contains('prev')) showPrev();
  });

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

});