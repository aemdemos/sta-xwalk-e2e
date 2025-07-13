/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the correct cards block
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock && element.classList.contains('cards') && element.classList.contains('block')) {
    cardsBlock = element;
  }
  if (!cardsBlock) {
    // Try :scope for immediate child
    cardsBlock = element.querySelector(':scope > .cards.block');
  }
  if (!cardsBlock) {
    cardsBlock = element; // fallback
  }

  // Find the list of cards
  const cardsList = cardsBlock.querySelector('ul');
  const cardItems = cardsList ? Array.from(cardsList.children) : [];

  // Start with the header row
  const rows = [['Cards']];

  // Process each card
  cardItems.forEach((li) => {
    // Image/Icon cell: take .cards-card-image
    const imageCell = li.querySelector('.cards-card-image');
    // Text cell: take .cards-card-body
    const textCell = li.querySelector('.cards-card-body');

    // Always reference existing elements directly (never clone)
    rows.push([
      imageCell || '',
      textCell || ''
    ]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
