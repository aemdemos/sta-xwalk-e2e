/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost cards block
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
  }
  if (!cardsBlock) return;

  // Get all card <li> elements
  const cardLis = cardsBlock.querySelectorAll('ul > li');
  const rows = [];
  // Header row - exactly as in the example
  rows.push(['Cards']);

  cardLis.forEach(cardLi => {
    // First cell: the image or icon (mandatory)
    const imageDiv = cardLi.querySelector('.cards-card-image');
    let imageCell = '';
    if (imageDiv) {
      // Insert the <picture> or <img> element directly (not clone)
      // prefer picture as in source
      const picture = imageDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Second cell: the card's body content
    const bodyDiv = cardLi.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the full div (so HTML structure, e.g. strong, paragraphs etc. is preserved)
      textCell = bodyDiv;
    }
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
