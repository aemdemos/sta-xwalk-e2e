/* global WebImporter */
export default function parse(element, { document }) {
  // Try to locate the .cards.block (main block with cards)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) {
    // fallback: find the first <ul> that has children
    const ulFallback = element.querySelector('ul');
    if (!ulFallback) return;
    cardsBlock = ulFallback.parentElement;
  }
  // Find the cards list
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  // Get all list items (cards)
  const cards = Array.from(ul.children).filter(li => li.nodeName === 'LI');
  // Table rows
  const rows = [];
  // Header row (must be exactly 'Cards')
  rows.push(['Cards']);
  // Each card is a row with two cells: image and text
  cards.forEach((li) => {
    // Find image div
    const imgDiv = li.querySelector('.cards-card-image');
    // Find body/text div
    const bodyDiv = li.querySelector('.cards-card-body');
    // Only add cards with both image and text
    if (imgDiv && bodyDiv) {
      rows.push([imgDiv, bodyDiv]);
    }
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}