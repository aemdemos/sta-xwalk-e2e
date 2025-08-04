/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (the div with `cards block` class)
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  const cells = [];
  // Header row, must be exactly 'Cards' per block
  cells.push(['Cards']);

  lis.forEach(li => {
    // Card: image/icon in first cell, text content in second
    const imgDiv = li.querySelector('.cards-card-image');
    // Prefer <picture> if available, else <img>, else null
    let imgEl = null;
    if (imgDiv) {
      imgEl = imgDiv.querySelector('picture') || imgDiv.querySelector('img') || null;
    }

    // Get the card body content (all as a block reference)
    const bodyDiv = li.querySelector('.cards-card-body');
    // Fallback if missing
    let textCell = null;
    if (bodyDiv) {
      textCell = bodyDiv;
    } else {
      // If for some reason missing, just an empty fragment
      textCell = document.createDocumentFragment();
    }

    cells.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
