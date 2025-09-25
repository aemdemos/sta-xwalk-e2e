/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the cards block (could be the element itself or a child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
  }
  if (!cardsBlock) return;

  // Find all card list items
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  // Header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  items.forEach((li) => {
    // Defensive: find image container and body container
    const imgContainer = li.querySelector('.cards-card-image');
    const bodyContainer = li.querySelector('.cards-card-body');

    // Get the image (use <picture> if present, else <img>)
    let imageEl = null;
    if (imgContainer) {
      imageEl = imgContainer.querySelector('picture') || imgContainer.querySelector('img');
    }
    // Get the text content (body)
    let textEl = null;
    if (bodyContainer) {
      // Use the whole body container for resilience
      textEl = bodyContainer;
    }
    // Only add row if both image and text are present
    if (imageEl && textEl) {
      rows.push([imageEl, textEl]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
