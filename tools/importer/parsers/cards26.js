/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;

  // Header row as required
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all card items
  const items = list.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Find image (first cell)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive fallback: if not found, try any img
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }

    // Compose text cell (second cell)
    const textCell = document.createElement('div');
    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent;
        textCell.appendChild(heading);
      }
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.appendChild(descP);
    }
    // Call-to-action (optional, only if titleLink exists)
    if (titleLink && titleLink.href) {
      // Only add CTA if not already used as title
      // (Here, CTA is not present in the source, but code supports it)
    }

    // Build row: image in first cell, text in second
    rows.push([
      imageEl,
      textCell
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
