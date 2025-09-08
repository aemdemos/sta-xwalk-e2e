/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element contains the expected UL
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row as required
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Each LI is a card
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the image (first cell)
    let imgEl = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!imgEl) {
      // Try to find any img inside the li
      imgEl = li.querySelector('img');
    }

    // Find the title link and text
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    // Compose the title as a heading (h3) with link if present
    let titleEl;
    if (titleLink && titleSpan) {
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink.getAttribute('href');
      a.textContent = titleSpan.textContent;
      h3.appendChild(a);
      titleEl = h3;
    } else if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      titleEl = h3;
    }

    // Find the description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }

    // Compose the text cell: title + description
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    // Add row: [image, text]
    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
