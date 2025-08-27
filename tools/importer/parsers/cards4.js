/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards.block within the wrapper if present, else use element
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) cardsBlock = element;

  // Find the card list
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cardItems = Array.from(ul.children);

  // Prepare the table rows
  const cells = [];
  // Add the header row as in the example
  cells.push(['Cards']);

  // For each card <li>, extract its image and body
  cardItems.forEach(li => {
    // Image/Icon (first cell)
    let imgCell = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      // Use the picture element if present, else the image or div itself
      imgCell = imageDiv.querySelector('picture') || imageDiv.querySelector('img') || imageDiv;
    }
    // Text content (second cell)
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    cells.push([imgCell, textCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
