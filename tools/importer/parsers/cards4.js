/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row as required
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Find image container and body container
    const imageDiv = li.querySelector('.cards-card-image');
    const bodyDiv = li.querySelector('.cards-card-body');

    // Defensive: ensure both exist
    if (!imageDiv || !bodyDiv) return;

    // Find the <picture> (image)
    const picture = imageDiv.querySelector('picture');
    // Defensive: fallback to imageDiv if no <picture>
    const imageCell = picture || imageDiv;

    // For text cell, include all children of bodyDiv
    // This will include <p><strong>...</strong></p> and description <p>
    const textCell = Array.from(bodyDiv.childNodes);

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
