/* global WebImporter */
export default function parse(element, { document }) {
  // Select the cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all <li> items representing cards
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Prepare table rows: block header, then each card row
  const rows = [['Cards']];

  cardItems.forEach((li) => {
    // Image/icon cell
    const imageCell = li.querySelector('.cards-card-image');
    // Text body cell
    const bodyCell = li.querySelector('.cards-card-body');
    // Handle edge case if either image or body is missing
    if (!imageCell && !bodyCell) return;
    // If either is missing, include empty string for that cell
    rows.push([
      imageCell || '',
      bodyCell || ''
    ]);
  });

  // Create table for the block
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block table
  element.replaceWith(blockTable);
}
