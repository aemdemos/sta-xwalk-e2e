/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <ul> containing all cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table rows: header and one row per card
  const rows = [['Cards']];

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Image/Icon (first cell)
    const imgDiv = li.querySelector('.cards-card-image');
    // Text content (second cell)
    const bodyDiv = li.querySelector('.cards-card-body');
    // Use existing elements directly in table cells
    rows.push([
      imgDiv || '',
      bodyDiv || ''
    ]);
  });

  // Create the Cards block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
