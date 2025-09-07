/* global WebImporter */
export default function parse(element, { document }) {
  // Get all carousel containers directly under the element
  const carousels = Array.from(element.querySelectorAll(':scope > div'));

  // Prepare the header row as required
  const headerRow = ['Carousel (carousel31)'];
  const rows = [headerRow];

  carousels.forEach((carousel) => {
    // Find the carousel content wrapper
    const content = carousel.querySelector('.cmp-carousel__content');
    if (!content) return;
    // Each slide is a .cmp-carousel__item
    const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
    slides.forEach((slide) => {
      // Find image (first cell)
      let imageCell = null;
      const imageWrapper = slide.querySelector('.image');
      if (imageWrapper) {
        // Find the actual <img> inside
        const img = imageWrapper.querySelector('img');
        if (img) {
          imageCell = img;
        } else {
          imageCell = imageWrapper;
        }
      }
      // Find text content (second cell)
      let textCell = '';
      // We'll grab all text nodes and elements except the image wrapper
      const textNodes = [];
      Array.from(slide.childNodes).forEach((node) => {
        if (node !== imageWrapper && node.nodeType === Node.ELEMENT_NODE) {
          textNodes.push(node.cloneNode(true));
        } else if (node !== imageWrapper && node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) {
            textNodes.push(document.createTextNode(node.textContent));
          }
        }
      });
      if (textNodes.length > 0) {
        textCell = textNodes;
      }
      // Always push two columns per row, with second cell empty if no text content
      rows.push([imageCell, textCell]);
    });
  });

  // Ensure all rows (except header) have exactly two columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1) rows[i].push('');
    if (rows[i].length === 0) rows[i] = ['', ''];
    if (rows[i].length > 2) rows[i] = [rows[i][0], rows[i][1]];
  }

  // Ensure all rows after the header have two columns, but remove unnecessary empty columns
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][1] || (Array.isArray(rows[i][1]) && rows[i][1].length === 0)) {
      rows[i][1] = undefined;
      rows[i] = [rows[i][0]];
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
