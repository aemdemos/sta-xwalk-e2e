/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards.block element
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all <li> card elements
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children);

  // Compose the table rows: first row is header
  const rows = [['Cards']];

  // Each subsequent row: [image/icon, text content]
  lis.forEach((li) => {
    // Find the image div (first cell)
    const imgDiv = li.querySelector('.cards-card-image');
    // Find the body div (second cell)
    const bodyDiv = li.querySelector('.cards-card-body');
    // If either is missing, insert null to maintain column count
    rows.push([
      imgDiv || document.createTextNode(''),
      bodyDiv || document.createTextNode('')
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
