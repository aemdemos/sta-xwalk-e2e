/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the innermost .cards.block within the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all card <li> elements
  const cardLis = cardsBlock.querySelectorAll('ul > li');
  // Table header as specified in the example
  const cells = [['Cards (cards4)']];

  cardLis.forEach((li) => {
    // Extract image container
    const imgDiv = li.querySelector('.cards-card-image');
    // Defensive: Use the image div if it exists, else empty string
    const imageCell = imgDiv || '';

    // Extract body container
    const bodyDiv = li.querySelector('.cards-card-body');
    // Defensive: Use the body div if it exists, else empty string
    const bodyCell = bodyDiv || '';
    
    // Add card row: [image, body]
    cells.push([imageCell, bodyCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original block wrapper with the new block
  element.replaceWith(block);
}
