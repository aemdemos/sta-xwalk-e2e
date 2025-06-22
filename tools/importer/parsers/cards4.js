/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cards.block (cards4) inside the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;
  // Get all card <li> elements
  const cards = cardsBlock.querySelectorAll('ul > li');
  const rows = [];
  // Header row
  rows.push(['Cards (cards4)']);
  cards.forEach((card) => {
    // Image/Icon (mandatory, first cell)
    let imageEl = null;
    const imageContainer = card.querySelector('.cards-card-image');
    if (imageContainer) {
      const pic = imageContainer.querySelector('picture');
      if (pic) {
        imageEl = pic;
      } else {
        const img = imageContainer.querySelector('img');
        if (img) imageEl = img;
      }
    }
    // Text content (mandatory, second cell)
    let textEl = null;
    const body = card.querySelector('.cards-card-body');
    // Ensure all text content is included (including headings, descriptions, etc.)
    if (body) {
      textEl = body;
    }
    rows.push([imageEl, textEl]);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the wrapper with the table
  element.replaceWith(table);
}
