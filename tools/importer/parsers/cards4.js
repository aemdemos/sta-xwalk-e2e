/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .cards.block inside the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children);
  const rows = [];
  // Header row: block name only
  rows.push(['Cards']);
  // For each card, extract image/icon and text content (reference the blocks)
  cards.forEach((li) => {
    // Image/Icon cell: reference the child .cards-card-image div (may be null, that's ok)
    const imgDiv = li.querySelector('.cards-card-image') || '';
    // Text content cell: reference the .cards-card-body div (may be null, that's ok)
    const bodyDiv = li.querySelector('.cards-card-body') || '';
    rows.push([imgDiv, bodyDiv]);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
