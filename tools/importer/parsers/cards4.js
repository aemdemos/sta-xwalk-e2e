/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the cards block (could be element itself or child)
  let cardsBlock = element;
  if (!cardsBlock.classList.contains('cards')) {
    cardsBlock = element.querySelector('.cards.block');
    if (!cardsBlock) return;
  }

  // Find the list of cards (ul > li)
  const list = cardsBlock.querySelector('ul');
  if (!list) return;
  const items = Array.from(list.children);

  // Table header
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // Defensive: find image container and body container
    const imageContainer = li.querySelector('.cards-card-image');
    const bodyContainer = li.querySelector('.cards-card-body');

    // Get image (picture element)
    let imageEl = null;
    if (imageContainer) {
      imageEl = imageContainer.querySelector('picture');
      // fallback to img if picture not found
      if (!imageEl) {
        imageEl = imageContainer.querySelector('img');
      }
    }

    // Get text content (body)
    let textEl = null;
    if (bodyContainer) {
      // Use the whole body container for resilience
      textEl = bodyContainer;
    }

    // Add row: [image, text]
    rows.push([imageEl, textEl]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block
  element.replaceWith(block);
}
