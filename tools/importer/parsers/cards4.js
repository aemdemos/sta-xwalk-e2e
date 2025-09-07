/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Header row as per block spec
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the image (first cell)
    let imageEl = li.querySelector('.cmp-image-list__item-image .cmp-image');
    // Defensive: fallback to img if needed
    if (!imageEl) {
      imageEl = li.querySelector('img');
    }
    // Find the text content (second cell)
    const textContent = document.createElement('div');
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use h3 for card title
      const h = document.createElement('h3');
      h.append(...titleLink.childNodes);
      textContent.appendChild(h);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.appendChild(p);
    }
    // No CTA in this block
    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.querySelector('.image-list').replaceWith(table);
}
