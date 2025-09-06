/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  const cards = ul.querySelectorAll(':scope > li');
  cards.forEach((card) => {
    // Find image container and body container
    const imageDiv = card.querySelector('.cards-card-image');
    const bodyDiv = card.querySelector('.cards-card-body');

    // Defensive: Ensure both exist
    if (!imageDiv || !bodyDiv) return;

    // Get the image element (use <picture> if present, else <img>)
    let imageCell;
    const picture = imageDiv.querySelector('picture');
    if (picture) {
      imageCell = picture;
    } else {
      const img = imageDiv.querySelector('img');
      imageCell = img || '';
    }

    // For the text cell, use the entire bodyDiv (preserves heading and description)
    const textCell = bodyDiv;

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
