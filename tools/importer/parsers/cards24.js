/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find the image (first .image img)
    const img = section.querySelector('.image img');
    // Find the main title (h3)
    const h3 = section.querySelector('h3');
    // Find the subtitle (h5)
    const h5 = section.querySelector('h5');
    // Find the button list (all .cmp-button inside .buildingblock)
    const btnBlock = section.querySelector('.buildingblock');
    let buttons = [];
    if (btnBlock) {
      buttons = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }
    // Compose the text cell
    const textCell = document.createElement('div');
    if (h3) {
      const h3clone = h3.cloneNode(true);
      textCell.appendChild(h3clone);
    }
    if (h5) {
      textCell.appendChild(document.createElement('br'));
      const h5clone = h5.cloneNode(true);
      textCell.appendChild(h5clone);
    }
    // Add description text if present (look for .cmp-title + .cmp-title--black or next sibling)
    // Actually, the description is not present as a separate element, but let's check for any extra text nodes
    // Add social buttons if present
    if (buttons.length > 0) {
      textCell.appendChild(document.createElement('br'));
      const btnsDiv = document.createElement('div');
      buttons.forEach(btn => btnsDiv.appendChild(btn.cloneNode(true)));
      textCell.appendChild(btnsDiv);
    }
    return [img, textCell];
  }

  // Find all contributor/guide cards (sections with .cmp-experience-fragment--contributor)
  const cardSections = element.querySelectorAll('section.cmp-experience-fragment--contributor');
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);
  // For each card, extract info
  cardSections.forEach(section => {
    // The actual card content is inside the deepest .cmp-container
    const containers = section.querySelectorAll('.cmp-container');
    let cardContainer = null;
    // Find the innermost .cmp-container that contains the .image
    for (let i = containers.length - 1; i >= 0; i--) {
      if (containers[i].querySelector('.image img')) {
        cardContainer = containers[i];
        break;
      }
    }
    if (cardContainer) {
      rows.push(extractCard(cardContainer));
    }
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the element
  element.replaceWith(table);
}
