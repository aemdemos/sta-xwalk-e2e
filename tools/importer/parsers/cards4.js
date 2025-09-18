/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Header row as per requirements
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card (li)
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Defensive: find image container and body container
    const imgDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // First cell: the image (use the whole .cards-card-image div)
    let imageCell = '';
    if (imgDiv) imageCell = imgDiv;

    // Second cell: the text content (use the whole .cards-card-body div)
    let textCell = '';
    if (bodyDiv) textCell = bodyDiv;

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
