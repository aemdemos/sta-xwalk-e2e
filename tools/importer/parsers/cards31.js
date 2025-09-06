/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if element contains the expected structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Find the image (first cell)
    let imgEl = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if img not found
    if (!imgEl) {
      // Try to find any img inside the li
      imgEl = li.querySelector('img');
    }

    // Find the text content (second cell)
    // We'll collect: title (as heading), description (as paragraph), and CTA (if present)
    const textContent = document.createElement('div');
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const h3 = document.createElement('h3');
      if (titleLink && titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = titleSpan.textContent;
        h3.appendChild(a);
      } else {
        h3.textContent = titleSpan.textContent;
      }
      textContent.appendChild(h3);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.appendChild(p);
    }
    // CTA: If there's a title link and it's not already used as the heading, add as CTA
    // (In this structure, the title link is the heading, so no separate CTA)

    // Add row: [image, text content]
    rows.push([
      imgEl || '',
      textContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
