/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards.block inside the provided element
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  const ul = cardsBlock.querySelector('ul');
  if (!ul) return;

  const cards = Array.from(ul.children).filter(li => li.nodeName === 'LI');
  const rows = [];
  // Header row: block name, exactly as specified
  rows.push(['Cards (cards4)']);

  // For each card, create a row with image/icon and text
  cards.forEach((li) => {
    // First cell: image/icon (mandatory)
    let imageEl = null;
    const imgContainer = li.querySelector('.cards-card-image');
    if (imgContainer) {
      // Use the <picture> element if present, else <img>
      const picture = imgContainer.querySelector('picture');
      if (picture) {
        imageEl = picture;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) {
          imageEl = img;
        }
      }
    }
    // Second cell: text content (mandatory)
    let textEl = null;
    const bodyContainer = li.querySelector('.cards-card-body');
    if (bodyContainer) {
      textEl = bodyContainer;
    }
    // Always construct a row, even if one cell is missing (shouldn't happen but safe)
    rows.push([imageEl, textEl]);
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
