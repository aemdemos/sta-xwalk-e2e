/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all the <li> (cards)
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Header row must be exactly 'Cards'
  const cells = [['Cards']];

  // Each row: [image/icon, text content].
  cardItems.forEach((li) => {
    // Find image container (may be missing)
    const imgContainer = li.querySelector('.cards-card-image');
    // Find body container (may be missing)
    const bodyContainer = li.querySelector('.cards-card-body');
    // Fallbacks: if missing, use empty element
    const imgCell = imgContainer || document.createElement('div');
    const bodyCell = bodyContainer || document.createElement('div');
    cells.push([
      imgCell,
      bodyCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(block);
}
