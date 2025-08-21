/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards.block (should be a child of element)
  const block = element.querySelector('.cards.block');
  if (!block) return;
  // Find all list items representing cards
  const cards = block.querySelectorAll('ul > li');
  const cells = [['Cards']]; // Table header as per spec
  // For each card, extract image/icon and text content (as elements)
  cards.forEach(card => {
    // Image/Icon cell
    const image = card.querySelector('.cards-card-image');
    // Text content cell
    const text = card.querySelector('.cards-card-body');
    // Push as a table row, referencing the actual HTML elements
    cells.push([
      image,
      text
    ]);
  });
  // Build the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original wrapper element with the table
  element.replaceWith(table);
}
