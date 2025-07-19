/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main cards block
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;
  
  // Find the <ul> of cards
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');
  if (!lis.length) return;

  // Prepare table rows
  const rows = [];
  // Header row as in the example
  rows.push(['Cards']);

  // Each card row
  lis.forEach((li) => {
    // Image cell: get <picture> if present, else <img>
    let imageCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      imageCell = imgDiv.querySelector('picture') || imgDiv.querySelector('img');
    }

    // Text cell: capture the whole .cards-card-body
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) textCell = bodyDiv;

    // Add row if at least one cell is present
    if (imageCell || textCell) {
      rows.push([imageCell, textCell]);
    }
  });

  // Build and replace the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
