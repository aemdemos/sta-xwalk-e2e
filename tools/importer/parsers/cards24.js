/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor section
  function extractCard(section) {
    // Find the image (first .image img)
    const img = section.querySelector('.image img');
    let image = null;
    if (img) image = img;

    // Find the name (first h3)
    const nameDiv = section.querySelector('h3');
    // Find the subtitle (first h5)
    const subtitleDiv = section.querySelector('h5');

    // Find the social buttons (all .cmp-button inside .buildingblock)
    const btnBlock = section.querySelector('.buildingblock');
    let buttons = [];
    if (btnBlock) {
      buttons = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    if (nameDiv) {
      const h = document.createElement('h3');
      h.textContent = nameDiv.textContent;
      textCell.appendChild(h);
    }
    if (subtitleDiv) {
      const subtitle = document.createElement('div');
      subtitle.textContent = subtitleDiv.textContent;
      subtitle.style.fontWeight = 'bold';
      subtitle.style.fontSize = '1em';
      textCell.appendChild(subtitle);
    }
    if (buttons.length > 0) {
      const btnsDiv = document.createElement('div');
      buttons.forEach(btn => btnsDiv.appendChild(btn));
      textCell.appendChild(btnsDiv);
    }
    return [image, textCell];
  }

  // Find all contributor/guide cards (sections with .cmp-experience-fragment--contributor)
  const cardSections = element.querySelectorAll('section.cmp-experience-fragment--contributor');

  // Compose the table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);

  // For each card, extract info
  cardSections.forEach(section => {
    rows.push(extractCard(section));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
