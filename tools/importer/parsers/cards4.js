/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Get all <li> (cards)
  const cards = ul.querySelectorAll(':scope > li');
  cards.forEach((card) => {
    // Defensive: Find image container and body container
    const imageContainer = card.querySelector('.cards-card-image');
    const bodyContainer = card.querySelector('.cards-card-body');

    // Find the image (use <picture> if present, else <img>)
    let imageCell = '';
    if (imageContainer) {
      const picture = imageContainer.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imageContainer.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Defensive: For text, use the entire body container
    let textCell = '';
    if (bodyContainer) {
      textCell = bodyContainer;
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
