/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  if (!element || !element.classList.contains('carousel')) return;

  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slide items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header as per block guidelines
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // For each slide
  items.forEach((item) => {
    // Find image (mandatory)
    let imgEl = null;
    const imgDiv = item.querySelector('.cmp-image');
    if (imgDiv) {
      imgEl = imgDiv.querySelector('img');
    }
    // Defensive: skip if no image
    if (!imgEl) return;

    // Find text content (optional)
    let textCell = '';
    // Try to find a heading or caption
    let caption = '';
    // Try meta[itemprop="caption"] first
    const metaCaption = imgDiv ? imgDiv.querySelector('meta[itemprop="caption"]') : null;
    if (metaCaption && metaCaption.content) {
      caption = metaCaption.content;
    } else if (imgEl && imgEl.title) {
      caption = imgEl.title;
    } else if (imgEl && imgEl.alt) {
      caption = imgEl.alt;
    }
    // If caption exists, create a heading
    if (caption) {
      const heading = document.createElement('h2');
      heading.textContent = caption;
      textCell = heading;
    }

    // Check for additional text content in the slide (not just caption)
    // Look for any text nodes or elements after the image
    // We'll collect all non-image content inside the slide
    const slideTextParts = [];
    // Get all direct children of the slide item
    Array.from(item.childNodes).forEach((child) => {
      // Skip the image container
      if (child.classList && child.classList.contains('image')) return;
      // If it's an element and not empty, or a text node with non-whitespace
      if (child.nodeType === 1 && child.textContent.trim()) {
        slideTextParts.push(child.cloneNode(true));
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        slideTextParts.push(document.createTextNode(child.textContent));
      }
    });
    // If we found extra text, append it after the heading (if any)
    if (slideTextParts.length) {
      const wrapper = document.createElement('div');
      if (textCell) wrapper.appendChild(textCell);
      slideTextParts.forEach((el) => wrapper.appendChild(el));
      textCell = wrapper;
    }

    rows.push([
      imgEl,
      textCell || ''
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
