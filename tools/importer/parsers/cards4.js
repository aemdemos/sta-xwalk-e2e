/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (it may be the element itself or a child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards');
  }
  if (!cardsBlock) return;

  // Find all card items (li elements)
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const cards = Array.from(list.children);

  // Prepare the table rows
  const rows = [];

  // Header row as per block requirements
  rows.push(['Cards (cards4)']);

  // For each card, extract image/icon and text content
  cards.forEach((li) => {
    // Defensive: find image/icon (first cell)
    let imageCell = '';
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      // Use the <picture> or <img> element directly
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Defensive: find text content (second cell)
    let textCell = '';
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) {
      // We'll use the bodyDiv's children directly, but wrap the title in <strong> if needed
      // Find the first <p><strong>...</strong></p> as title
      const paragraphs = Array.from(bodyDiv.querySelectorAll('p'));
      if (paragraphs.length > 0) {
        // Clone the nodes to avoid moving them from the DOM
        const titleP = paragraphs[0].cloneNode(true);
        // Remove extra paragraphs from the title if any
        if (titleP.childNodes.length === 1 && titleP.firstChild.nodeName === 'STRONG') {
          // Good, keep as is
        }
        // The rest are description
        const descPs = paragraphs.slice(1).map(p => p.cloneNode(true));
        textCell = [titleP, ...descPs];
      } else {
        // Fallback: use all bodyDiv content
        textCell = bodyDiv.cloneNode(true);
      }
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
