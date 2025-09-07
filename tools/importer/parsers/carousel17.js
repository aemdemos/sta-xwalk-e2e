/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Defensive: find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides (items)
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // Find image element inside each slide
    const imageContainer = item.querySelector('.cmp-image');
    let imgEl = null;
    if (imageContainer) {
      imgEl = imageContainer.querySelector('img');
    }

    // Find possible text content (title, description, CTA) in the slide
    // Try to get all text content except the image
    const textNodes = Array.from(item.children).filter(child => !child.classList.contains('image'));
    let textContent = null;
    if (textNodes.length > 0) {
      // Create a fragment to hold all text content
      const frag = document.createElement('div');
      textNodes.forEach(node => frag.appendChild(node.cloneNode(true)));
      textContent = frag;
    }

    // Only add a second column if there is actual text content
    if (imgEl && textContent) {
      rows.push([imgEl, textContent]);
    } else if (imgEl) {
      rows.push([imgEl]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
