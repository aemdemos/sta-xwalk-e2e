/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the cards block (works for .cards-wrapper or direct .cards)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock && element.classList.contains('cards') && element.classList.contains('block')) {
    cardsBlock = element;
  }
  if (!cardsBlock) return;
  // 2. Find all <li> (cards)
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li');
  const rows = [];
  // 3. Add table header as first row (must be exactly: 'Cards')
  rows.push(['Cards']);
  // 4. Extract each card
  lis.forEach((li) => {
    // Left cell: image/icon (mandatory)
    let imageCell = '';
    const imgContainer = li.querySelector('.cards-card-image');
    if (imgContainer) {
      // Use the picture element if present, otherwise the container
      const pic = imgContainer.querySelector('picture') || imgContainer.querySelector('img');
      imageCell = pic || imgContainer;
    }
    // Right cell: card text (mandatory, includes all p, strong, etc)
    let textCell = '';
    const body = li.querySelector('.cards-card-body');
    if (body) {
      textCell = body;
    }
    rows.push([imageCell, textCell]);
  });
  // 5. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
