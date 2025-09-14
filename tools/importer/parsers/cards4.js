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
    // Defensive: find image container and body container
    const imgContainer = li.querySelector('.cards-card-image');
    const bodyContainer = li.querySelector('.cards-card-body');

    // Get the image (picture or img)
    let imageEl = null;
    if (imgContainer) {
      // Use the whole <picture> element if present, else <img>
      imageEl = imgContainer.querySelector('picture') || imgContainer.querySelector('img');
    }

    // Get the text content (title + description)
    let textEl = null;
    if (bodyContainer) {
      // Use the whole body container for resilience
      textEl = bodyContainer;
    }

    // Only add row if both image and text are present
    if (imageEl && textEl) {
      rows.push([imageEl, textEl]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
