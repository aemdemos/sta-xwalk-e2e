/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards block (could be passed the wrapper)
  let cardsBlock = element;
  if (!element.classList.contains('cards') && element.querySelector('.cards.block')) {
    cardsBlock = element.querySelector('.cards.block');
  }
  if (!cardsBlock) return;

  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cards = Array.from(ul.children).filter(li => li.tagName === 'LI');

  const headerRow = ['Cards'];
  const rows = [headerRow];

  cards.forEach((li) => {
    // Image/Icon: .cards-card-image (may not exist)
    const imgDiv = li.querySelector('.cards-card-image');
    // Text: .cards-card-body (should always exist)
    const bodyDiv = li.querySelector('.cards-card-body');
    rows.push([
      imgDiv || '',
      bodyDiv || ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
