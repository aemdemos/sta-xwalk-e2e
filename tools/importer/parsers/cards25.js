/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Defensive: find the image
    const imgContainer = section.querySelector('.image .cmp-image');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // Defensive: find all titles (name, role)
    const titleEls = section.querySelectorAll('.cmp-title .cmp-title__text');
    let nameEl = null;
    let roleEl = null;
    if (titleEls.length > 0) {
      nameEl = titleEls[0];
    }
    if (titleEls.length > 1) {
      roleEl = titleEls[1];
    }

    // Defensive: find all social buttons
    const buttonContainer = section.querySelector('.buildingblock');
    let buttons = [];
    if (buttonContainer) {
      buttons = Array.from(buttonContainer.querySelectorAll('a.cmp-button'));
    }

    // Compose the text cell
    const textCell = [];
    if (nameEl) textCell.push(nameEl);
    if (roleEl) textCell.push(roleEl);
    if (buttons.length > 0) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn));
      textCell.push(btnDiv);
    }

    // Add missing text content: find all .cmp-title__text and .cmp-text inside the section
    // This ensures any extra description is included
    const extraTexts = section.querySelectorAll('.cmp-text');
    extraTexts.forEach(txt => {
      textCell.push(txt);
    });

    return [imgEl, textCell];
  }

  // Find all contributor sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build the table rows
  const rows = [];
  const headerRow = ['Cards (cards25)'];
  rows.push(headerRow);

  cardSections.forEach(section => {
    // Defensive: skip if no image found
    const card = extractCard(section);
    if (card[0]) {
      rows.push(card);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
