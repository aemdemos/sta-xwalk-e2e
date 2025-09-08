/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the expected UL structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Find image (first cell)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Defensive: find the actual <img> element inside the image link
      imageEl = imageLink.querySelector('img');
      // If imageEl exists, use the <img> element directly
    }

    // Find text content (second cell)
    const textContent = [];
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textContent.push(heading);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.push(descP);
    }
    // Call-to-action (optional, not present in this HTML, but support it)
    // If the titleLink exists, and its href is present, add as CTA if not already used
    // (In this HTML, the title is already a link, so we skip extra CTA)

    // Defensive: ensure image and textContent are present
    rows.push([
      imageEl || '',
      textContent.length ? textContent : '',
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
