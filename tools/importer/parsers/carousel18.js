/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  if (!element || !element.classList.contains('carousel')) return;

  // Table header row as specified
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    // Find image element (mandatory)
    let imgEl = item.querySelector('img');
    if (!imgEl) return;

    // Find text content (optional)
    // Instead of looking for headings/paragraphs/links, grab all text content except the image
    // We'll clone the item, remove the image, and use the remaining content
    const textCellContent = (() => {
      const clone = item.cloneNode(true);
      // Remove the image(s)
      Array.from(clone.querySelectorAll('img')).forEach(img => img.remove());
      // Remove empty divs/spans
      Array.from(clone.querySelectorAll('div:empty, span:empty')).forEach(el => el.remove());
      // Get all text and inline elements
      // If there's no text left, return empty string
      // Otherwise, return the child nodes as an array
      const children = Array.from(clone.childNodes).filter(node => {
        // Remove whitespace-only text nodes
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        // Keep elements
        return true;
      });
      if (children.length === 0) return '';
      // If only one element, return it directly
      if (children.length === 1) return children[0];
      return children;
    })();

    // Always push two columns: image and text (empty string if no text)
    rows.push([imgEl, textCellContent]);
  });

  // Ensure all data rows have exactly two columns (even if second is empty)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
