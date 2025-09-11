/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Get all <li> elements (each card)
  const cards = ul.querySelectorAll(':scope > li');

  cards.forEach((card) => {
    // Defensive: find image container and body container
    const imageContainer = card.querySelector('.cards-card-image');
    const bodyContainer = card.querySelector('.cards-card-body');

    // Image cell: use the whole image container (contains <picture> with <img>)
    let imageCell = imageContainer ? imageContainer : '';

    // Text cell: use the whole body container (contains <p><strong>...</strong></p> and description)
    let textCell = bodyContainer ? bodyContainer : '';

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
