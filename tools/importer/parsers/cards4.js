/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual cards block (could be the wrapper or the .cards block itself)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) {
    // fallback: maybe element itself is the .cards.block
    if (element.classList.contains('cards') && element.classList.contains('block')) {
      cardsBlock = element;
    } else {
      return;
    }
  }
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;
  const cards = ul.querySelectorAll(':scope > li');
  const rows = [];
  // Header row: block name as a single cell
  rows.push(['Cards']);
  // For each card
  cards.forEach(card => {
    let imgEl = null;
    const imgDiv = card.querySelector('.cards-card-image');
    if (imgDiv) {
      // Reference the <picture> if present, else <img>
      imgEl = imgDiv.querySelector('picture') || imgDiv.querySelector('img');
    }
    // Get the body (text content)
    let textEl = null;
    const bodyDiv = card.querySelector('.cards-card-body');
    if (bodyDiv) {
      textEl = bodyDiv;
    }
    // Add row only if at least one of image or text exists
    if (imgEl || textEl) {
      rows.push([
        imgEl,
        textEl
      ]);
    }
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
