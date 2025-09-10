/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the <ul> containing the cards
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each <li> is a card
  ul.querySelectorAll(':scope > li').forEach((li) => {
    // Defensive: find image container and body container
    const imageContainer = li.querySelector('.cards-card-image');
    const bodyContainer = li.querySelector('.cards-card-body');

    // Get image (always present)
    let imageEl = null;
    if (imageContainer) {
      // Use the <picture> element directly for resiliency
      const picture = imageContainer.querySelector('picture');
      if (picture) imageEl = picture;
    }

    // Get text content (title + description)
    let textEls = [];
    if (bodyContainer) {
      // Get all children (usually <p> elements)
      textEls = Array.from(bodyContainer.children);
    }

    // Add row: [image, text]
    rows.push([
      imageEl,
      textEls
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
