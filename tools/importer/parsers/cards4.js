/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the cards block inside the wrapper
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Get all card list items
  const cardItems = cardsBlock.querySelectorAll('ul > li');

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  cardItems.forEach((li) => {
    // Image cell: find the image inside .cards-card-image
    const imageWrapper = li.querySelector('.cards-card-image');
    let imageEl = null;
    if (imageWrapper) {
      // Use the <picture> element directly for robustness
      const picture = imageWrapper.querySelector('picture');
      if (picture) {
        imageEl = picture;
      }
    }

    // Text cell: find the body inside .cards-card-body
    const bodyWrapper = li.querySelector('.cards-card-body');
    let textEl = null;
    if (bodyWrapper) {
      // Use the whole body wrapper for resilience
      textEl = bodyWrapper;
    }

    // Only add row if both image and text exist
    if (imageEl && textEl) {
      rows.push([imageEl, textEl]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
