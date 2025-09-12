/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Find image/icon (first cell)
    const imgDiv = li.querySelector('.cards-card-image');
    let imageCell = '';
    if (imgDiv) {
      // Use the <picture> or <img> directly
      const picture = imgDiv.querySelector('picture');
      if (picture) {
        imageCell = picture;
      } else {
        const img = imgDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // Find text content (second cell)
    const bodyDiv = li.querySelector('.cards-card-body');
    let textCell = '';
    if (bodyDiv) {
      // Use the entire bodyDiv for resilience (includes <p><strong>...</strong></p> and <p>desc</p>)
      textCell = Array.from(bodyDiv.childNodes);
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the table
  element.replaceWith(table);
}
