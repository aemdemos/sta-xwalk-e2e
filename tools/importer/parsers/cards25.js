/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find the image (first .image img)
    const img = section.querySelector('.image img');

    // Find the name (first h3)
    const name = section.querySelector('h3');

    // Find the subtitle (first h5)
    const subtitle = section.querySelector('h5');

    // Find the social buttons (all .cmp-button inside .buildingblock)
    const btnBlock = section.querySelector('.buildingblock');
    let buttons = [];
    if (btnBlock) {
      buttons = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }

    // Find all text blocks above this section until a title block
    let description = '';
    let prev = section.previousElementSibling;
    while (prev) {
      if (prev.classList.contains('text')) {
        // Get all text content from the block
        description = prev.textContent.trim();
        break;
      }
      if (prev.classList.contains('title')) break;
      prev = prev.previousElementSibling;
    }

    // Compose the text cell: name, subtitle, description, buttons
    const textCell = document.createElement('div');
    if (name) textCell.appendChild(name.cloneNode(true));
    if (subtitle) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(subtitle.cloneNode(true));
    }
    if (description) {
      textCell.appendChild(document.createElement('br'));
      const descDiv = document.createElement('div');
      descDiv.textContent = description;
      textCell.appendChild(descDiv);
    }
    if (buttons.length > 0) {
      textCell.appendChild(document.createElement('br'));
      const btnsDiv = document.createElement('div');
      buttons.forEach(btn => btnsDiv.appendChild(btn.cloneNode(true)));
      textCell.appendChild(btnsDiv);
    }

    return [img, textCell];
  }

  // Find all contributor/guide sections
  const sections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose the table rows
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  sections.forEach(section => {
    const card = extractCard(section);
    // Defensive: Only add if image and text present
    if (card[0] && card[1]) {
      rows.push(card);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
