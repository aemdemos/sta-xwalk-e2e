/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  if (!element || !element.classList.contains('carousel')) return;

  // Block header row as specified
  const headerRow = ['Carousel (carousel17)'];

  // Find carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Build table rows for each slide
  const rows = items.map((item) => {
    // Find image element inside the slide
    let imgEl = item.querySelector('img');
    if (!imgEl) {
      const cmpImage = item.querySelector('.cmp-image');
      if (cmpImage) {
        imgEl = cmpImage;
      }
    }
    // Find text content inside the slide (less specific selector)
    let textContent = '';
    // Look for headings, paragraphs, links, etc. inside the item
    const textNodes = Array.from(item.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span'));
    if (textNodes.length > 0) {
      // Create a fragment to hold all text nodes
      const frag = document.createElement('div');
      textNodes.forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      textContent = frag;
    }
    // Only include second column if there is text content
    if (textContent && textContent.textContent && textContent.textContent.trim().length > 0) {
      return [imgEl ? imgEl : '', textContent];
    } else {
      return [imgEl ? imgEl : ''];
    }
  });

  // Compose the table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
