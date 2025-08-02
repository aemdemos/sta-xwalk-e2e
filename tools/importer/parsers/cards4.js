/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cards block (could be the element itself or a descendant)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) cardsBlock = element;

  // Find all card list items
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  const rows = [['Cards']]; // Header row

  cardItems.forEach((li) => {
    // First cell: image/icon
    let imgCell = null;
    const imgDiv = li.querySelector('.cards-card-image');
    if (imgDiv) {
      imgCell = imgDiv.querySelector('picture') || imgDiv.querySelector('img');
    }
    // Second cell: text content
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }
    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
