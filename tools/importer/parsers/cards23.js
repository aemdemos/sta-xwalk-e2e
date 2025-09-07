/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment section
  function extractCard(section) {
    // Find the image (first .image img)
    const img = section.querySelector('.image img');

    // Find the name (first h3)
    const name = section.querySelector('h3');

    // Find the subtitle (first h5)
    const subtitle = section.querySelector('h5');

    // Find the button block (social links)
    const buttonBlock = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
    let buttons = null;
    if (buttonBlock) {
      // Only keep the links (a elements)
      const links = buttonBlock.querySelectorAll('a.cmp-button');
      if (links.length) {
        // Clone the links so we don't move them from the DOM
        buttons = document.createElement('div');
        links.forEach((a) => buttons.appendChild(a.cloneNode(true)));
      }
    }

    // Compose text cell: name, subtitle, buttons
    const textCell = document.createElement('div');
    if (name) textCell.appendChild(name.cloneNode(true));
    if (subtitle) textCell.appendChild(subtitle.cloneNode(true));
    if (buttons) textCell.appendChild(buttons);

    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all contributor/guide cards (sections with .cmp-experience-fragment--contributor)
  const cards = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Defensive: skip if no cards found
  if (!cards.length) return;

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards23)'];
  rows.push(headerRow);
  // Card rows
  cards.forEach((section) => {
    rows.push(extractCard(section));
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
