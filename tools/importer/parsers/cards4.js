/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cards block (could be .cards.block or closest wrapper)
  let cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) {
    // fallback if the .cards.block is the element itself
    if (element.classList.contains('cards') && element.classList.contains('block')) {
      cardsBlock = element;
    } else {
      return; // cannot find block
    }
  }

  // Find all card items (li elements)
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Prepare table rows
  const rows = [];
  // Table header row
  rows.push(['Cards']);

  // For each card, collect image and text
  cardItems.forEach((li) => {
    // IMAGE: get .cards-card-image's first <picture> (or img if no picture)
    let imageCell = undefined;
    const imageWrapper = li.querySelector('.cards-card-image');
    if (imageWrapper) {
      const picture = imageWrapper.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageWrapper.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // TEXT: get .cards-card-body (include all its content)
    let textCell = undefined;
    const textWrapper = li.querySelector('.cards-card-body');
    if (textWrapper) {
      textCell = textWrapper;
    }
    // Add row only if at least one cell has content
    if (imageCell || textCell) {
      rows.push([imageCell, textCell]);
    }
  });

  // If there is at least a header and one card, replace
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
