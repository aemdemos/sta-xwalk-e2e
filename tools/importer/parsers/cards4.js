/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the direct cards block
  const cardsBlock = element.querySelector('.cards.block');
  if (!cardsBlock) return;

  // Find all card list items
  const cards = cardsBlock.querySelectorAll('ul > li');
  const rows = [
    ['Cards (cards4)'] // Header row matches example
  ];

  cards.forEach((card) => {
    // Image cell: get the <picture> (prefer) or <img> if missing
    let imageCell = '';
    const imgDiv = card.querySelector('.cards-card-image');
    if (imgDiv) {
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Text cell: all content from .cards-card-body; always reference existing element
    let textCell = '';
    const bodyDiv = card.querySelector('.cards-card-body');
    if (bodyDiv) {
      textCell = bodyDiv;
    }

    // Only add row if at least image and text available
    if (imageCell && textCell) {
      rows.push([imageCell, textCell]);
    }
    // If only image or only text (edge case): include the present one, blank for missing
    else if (imageCell || textCell) {
      rows.push([imageCell || '', textCell || '']);
    }
    // If both missing (should not happen): skip
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
