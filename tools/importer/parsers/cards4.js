/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Defensive: find image container and body container
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Image cell: use the whole image container (usually <picture>)
    let imageCell = '';
    if (imgDiv) {
      // Prefer the <picture> element if present
      const picture = imgDiv.querySelector('picture');
      imageCell = picture ? picture : imgDiv;
    }

    // Text cell: use the whole body container
    let textCell = '';
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
