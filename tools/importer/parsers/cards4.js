/* global WebImporter */
export default function parse(element, { document }) {
  // Find the real cards block (handles wrapper situation)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock && element.classList.contains('cards') && element.classList.contains('block')) {
    cardsBlock = element;
  }
  if (!cardsBlock) return;

  const list = cardsBlock.querySelector('ul');
  if (!list) return;

  const cardLis = Array.from(list.children).filter((li) => li.tagName === 'LI');
  const rows = [];
  // Header row: must be a single cell (not two), just ['Cards']
  rows.push(['Cards']);

  cardLis.forEach((li) => {
    // Get mandatory image/icon cell
    const imgDiv = li.querySelector(':scope > .cards-card-image') || document.createElement('div');
    // Get mandatory text cell
    const bodyDiv = li.querySelector(':scope > .cards-card-body') || document.createElement('div');
    rows.push([imgDiv, bodyDiv]);
  });

  // Use createTable, but with header row as single cell:
  // This is handled by pushing ['Cards'] as the first row, and then [imgDiv, bodyDiv] as subsequent rows
  // WebImporter.DOMUtils.createTable will create the header row as a single cell regardless of the number of columns in following rows
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
