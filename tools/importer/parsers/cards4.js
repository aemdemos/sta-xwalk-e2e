/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards block
  let cardsBlock = element;
  if (!element.classList.contains('cards')) {
    cardsBlock = element.querySelector(':scope > .cards');
  }
  if (!cardsBlock) return;

  const list = cardsBlock.querySelector('ul');
  if (!list) return;

  const cardItems = Array.from(list.children);
  const rows = [['Cards']]; // Header row matches example exactly

  cardItems.forEach((li) => {
    // image/icon (first cell)
    let imageCell = '';
    const imageWrapper = li.querySelector('.cards-card-image');
    if (imageWrapper) imageCell = imageWrapper;
    // text content (second cell)
    let textCell = '';
    const bodyWrapper = li.querySelector('.cards-card-body');
    if (bodyWrapper) textCell = bodyWrapper;
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
