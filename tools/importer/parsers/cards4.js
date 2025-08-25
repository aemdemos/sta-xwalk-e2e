/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards block (it may be element or a descendant)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) {
    // fallback: maybe the element itself is the block
    cardsBlock = element;
  }
  // Find the <ul> with <li>s representing cards
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);

  const rows = [];
  // Header row: must match the block name exactly as 'Cards'
  rows.push(['Cards']);

  // Each card is a <li> with .cards-card-image (image/icon) and .cards-card-body (text)
  lis.forEach(li => {
    // image/icon cell (can include <picture> with <img>)
    const imageDiv = li.querySelector('.cards-card-image');
    // text content cell (may include heading, description, etc.)
    const bodyDiv = li.querySelector('.cards-card-body');
    // Only add row if both cells are present
    if (imageDiv && bodyDiv) {
      rows.push([imageDiv, bodyDiv]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}