/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  if (!items.length) return;

  // Build header row as required
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find the image (first image in the card)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive fallback: if not found, try any img in the item
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }

    // Build the text cell: title (heading), description, cta (if any)
    const textCellContent = [];
    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Wrap the title in a heading element (h3)
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const h3 = document.createElement('h3');
        // If the title is a link, preserve the link
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.textContent = titleSpan.textContent;
        h3.appendChild(link);
        textCellContent.push(h3);
      }
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Use a <p> for description
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCellContent.push(p);
    }
    // CTA: if the title link is not already used, or if there's another link, add it
    // (In this structure, CTA is the title link, already handled)

    // Compose the row: [image, text cell]
    const row = [imageEl, textCellContent];
    rows.push(row);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
