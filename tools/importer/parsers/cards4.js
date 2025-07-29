/* global WebImporter */
export default function parse(element, { document }) {
  // Get the <ul> containing all the cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const cardNodes = ul.querySelectorAll(':scope > li');

  // Header row as in the specification
  const rows = [['Cards']];

  // For each card (li)
  cardNodes.forEach(card => {
    // Image cell
    let imgCell = null;
    const imgContainer = card.querySelector('.cards-card-image');
    if (imgContainer) {
      // Use the <picture> if it exists, or <img> as fallback
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imgCell = picture;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) imgCell = img;
      }
    }
    // Text cell: All content inside .cards-card-body, preserve formatting
    let textCell = null;
    const bodyContainer = card.querySelector('.cards-card-body');
    if (bodyContainer) {
      // Place all children as an array (preserve structure)
      const children = Array.from(bodyContainer.childNodes).filter(
        node => (node.nodeType !== Node.TEXT_NODE) || node.textContent.trim()
      );
      if (children.length === 1) {
        textCell = children[0];
      } else if (children.length > 1) {
        textCell = children;
      } else {
        textCell = '';
      }
    } else {
      textCell = '';
    }
    rows.push([imgCell, textCell]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
