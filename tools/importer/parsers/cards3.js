/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Defensive: find the image
    const imgWrap = section.querySelector('.image .cmp-image');
    let img = null;
    if (imgWrap) {
      img = imgWrap.querySelector('img');
    }

    // Defensive: find the name/title (h3)
    let name = section.querySelector('.title .cmp-title__text, .cmp-title h3');
    if (!name) {
      // fallback: any h3 inside
      name = section.querySelector('h3');
    }

    // Defensive: find the role/subtitle (h5)
    let subtitle = section.querySelector('.cmp-title--black .cmp-title__text, .cmp-title h5');
    if (!subtitle) {
      subtitle = section.querySelector('h5');
    }

    // Defensive: find the buttons (social links)
    const btnBlock = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
    let buttons = [];
    if (btnBlock) {
      // Find all <a> inside button blocks
      buttons = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }

    // Compose the text cell: name, subtitle, buttons
    const textCell = [];
    if (name) {
      textCell.push(name.cloneNode(true));
    }
    if (subtitle) {
      textCell.push(subtitle.cloneNode(true));
    }
    if (buttons.length > 0) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      textCell.push(btnDiv);
    }

    return [img ? img.cloneNode(true) : null, textCell];
  }

  // Find all contributor sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose table rows
  const rows = [];
  const headerRow = ['Cards (cards3)'];
  rows.push(headerRow);

  cardSections.forEach(section => {
    const [img, textCell] = extractCard(section);
    // Only add if image and text are present
    if (img && textCell.length > 0) {
      rows.push([img, textCell]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
