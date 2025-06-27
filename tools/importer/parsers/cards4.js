/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Build rows array
  const rows = [];
  // Header row: two columns as required
  rows.push(['Cards', '']);

  // Gather all card items
  const cardItems = cardsBlock.querySelectorAll('ul > li');
  cardItems.forEach((li) => {
    // First cell: image/icon
    let imageCell = null;
    const imageDiv = li.querySelector('.cards-card-image');
    if (imageDiv) {
      const pic = imageDiv.querySelector('picture');
      if (pic) imageCell = pic;
      else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Second cell: text content
    let textCell = null;
    const bodyDiv = li.querySelector('.cards-card-body');
    if (bodyDiv) textCell = bodyDiv;
    if (imageCell && textCell) {
      rows.push([imageCell, textCell]);
    }
  });

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
