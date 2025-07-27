/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual block: may be on input 'element' or its child
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards') || !cardsBlock.classList.contains('block')) {
    cardsBlock = element.querySelector('.cards.block');
  }
  if (!cardsBlock) return;

  const list = cardsBlock.querySelector('ul');
  if (!list) return;

  const cards = Array.from(list.children);
  const cells = [['Cards']]; // Header row -- must match example and spec

  cards.forEach((li) => {
    // 1st cell: image/icon (picture element), required
    const imageDiv = li.querySelector('.cards-card-image');
    let imageContent = '';
    if (imageDiv) {
      // Use the <picture> element if present
      imageContent = imageDiv.querySelector('picture') || imageDiv.firstElementChild;
    }
    // 2nd cell: text content (body div), required
    const bodyDiv = li.querySelector('.cards-card-body');
    // Insert [image, text] as per block table rules
    cells.push([imageContent, bodyDiv]);
  });

  // Build and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
