/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) cardsBlock = element;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  const rows = [['Cards (cards4)']];

  lis.forEach(li => {
    // Image cell: find .cards-card-image (picture/img)
    const imgDiv = li.querySelector('.cards-card-image');
    let imageCell = null;
    if (imgDiv) {
      // Always use the <picture> if present, otherwise <img>
      imageCell = imgDiv.querySelector('picture') || imgDiv.querySelector('img');
    }

    // Text cell: use .cards-card-body
    const bodyDiv = li.querySelector('.cards-card-body');
    // Reference the actual element, not a clone
    rows.push([
      imageCell,
      bodyDiv
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
