/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find the image
    const img = section.querySelector('.image img');

    // Find all titles (name, role)
    const titleEls = section.querySelectorAll('.title .cmp-title__text');
    let name = null;
    let role = null;
    if (titleEls.length > 0) {
      name = titleEls[0].cloneNode(true);
      if (titleEls.length > 1) {
        role = titleEls[1].cloneNode(true);
      }
    }

    // Find all buttons (social links)
    const buttonContainer = section.querySelector('.buildingblock');
    let buttons = [];
    if (buttonContainer) {
      buttons = Array.from(buttonContainer.querySelectorAll('a.cmp-button'));
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    if (name) textCell.appendChild(name);
    if (role) textCell.appendChild(role);
    if (buttons.length > 0) {
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      textCell.appendChild(btnDiv);
    }

    return [img ? img.cloneNode(true) : '', textCell.childNodes.length ? Array.from(textCell.childNodes) : ''];
  }

  // Find all contributor cards (sections)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose table rows
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  cardSections.forEach(section => {
    const card = extractCard(section);
    if (card[0] && card[1] && card[1].length > 0) {
      rows.push(card);
    }
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
