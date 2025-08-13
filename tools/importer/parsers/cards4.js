/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block from within the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all card <li> items
  const cardItems = Array.from(cardsBlock.querySelectorAll('ul > li'));

  // Table header as per spec
  const tableRows = [['Cards']];

  // For each card, extract image and rich text body
  cardItems.forEach(cardEl => {
    // Image (always present)
    const imgContainer = cardEl.querySelector('.cards-card-image');
    let imageEl = null;
    if (imgContainer) {
      // Use <picture> if available, else <img>
      const pic = imgContainer.querySelector('picture');
      if (pic) {
        imageEl = pic;
      } else {
        const img = imgContainer.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Body (always present)
    const bodyContainer = cardEl.querySelector('.cards-card-body');
    let bodyEl = null;
    if (bodyContainer) {
      bodyEl = bodyContainer;
    }

    // Add row: image | body
    tableRows.push([imageEl, bodyEl]);
  });

  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original wrapper
  element.replaceWith(blockTable);
}
