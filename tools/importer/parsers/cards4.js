/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> of cards, regardless of wrapper
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  const lis = ul.querySelectorAll(':scope > li');
  lis.forEach((li) => {
    // Find image (first cell)
    const imageDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Use the <picture> element directly if present
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        imageCell = imageDiv;
      }
    }

    // Find text content (second cell)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Defensive: collect all children (title, description, etc.)
      // We'll use all <p> elements in order
      const ps = Array.from(bodyDiv.querySelectorAll('p'));
      if (ps.length) {
        textCell = ps;
      } else {
        textCell = bodyDiv;
      }
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
