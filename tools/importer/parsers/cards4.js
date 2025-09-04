/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing all cards
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

    // Find the image (use <picture> if present, else <img>)
    let imageEl = imageDiv.querySelector('picture');
    if (!imageEl) {
      imageEl = imageDiv.querySelector('img');
    }
    // Defensive: if neither, skip
    if (!imageEl) return;

    // The text cell: use the entire bodyDiv (contains <p><strong>Title</strong></p> and <p>Description</p>)
    // This preserves formatting and is robust to variations
    rows.push([imageEl, bodyDiv]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
