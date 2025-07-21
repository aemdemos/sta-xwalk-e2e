/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block inside the wrapper
  const block = element.querySelector('.cards.block');
  if (!block) return;

  // Find all <li> elements representing cards
  const items = block.querySelectorAll('ul > li');
  const rows = [];
  // Header must be exactly 'Cards'
  rows.push(['Cards']);

  items.forEach((li) => {
    // First cell: image or icon (picture preferred)
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        // fallback: any img in this div
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Second cell: text content (body)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Reference ALL children (to preserve <p>, <strong>, etc)
      // Don't reference the bodyDiv itself (avoid wrapping)
      const children = Array.from(bodyDiv.childNodes).filter(node => {
        // include elements and text nodes with actual text
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
      // If there's more than one child, pass as array
      // If only one, pass that element
      if (children.length === 1) {
        textCell = children[0];
      } else if (children.length > 1) {
        textCell = children;
      }
    }
    rows.push([imageCell, textCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
