/* global WebImporter */
export default function parse(element, { document }) {
  // Find all carousels in the given element
  const carousels = Array.from(element.querySelectorAll(':scope > div.cmp-carousel, :scope > div > div.cmp-carousel'));

  // Prepare table header
  const headerRow = ['Carousel (carousel15)'];
  const rows = [headerRow];

  carousels.forEach((carousel) => {
    // Find all slides/items
    const items = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));
    items.forEach((item) => {
      // Find image (mandatory)
      let imgEl = item.querySelector('img');
      if (!imgEl) return; // skip if no image

      // Find text content (optional)
      let textCell = '';
      const children = Array.from(item.children).filter(child => !child.classList.contains('image'));
      if (children.length > 0) {
        const frag = document.createDocumentFragment();
        children.forEach(child => frag.appendChild(child.cloneNode(true)));
        textCell = frag;
      }
      // Always push two columns: image and text (empty string if no text)
      rows.push([imgEl, textCell]);
    });
  });

  // Ensure all rows (except header) have two columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) {
      rows[i].push('');
    }
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
