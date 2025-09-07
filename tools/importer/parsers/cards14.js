/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if the element contains the expected UL
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Each card's content is inside <article>
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image element
    let imgEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        imgEl = imageDiv.querySelector('img');
      }
    }

    // --- Text cell ---
    // Title (as heading)
    let titleEl = article.querySelector('.cmp-image-list__item-title');
    if (titleEl) {
      // Wrap title in <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      titleEl = strong;
    }

    // Description
    const descEl = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(document.createElement('br'), descEl);

    // Add row: [image, text]
    rows.push([
      imgEl || '',
      textCellContent.filter(Boolean)
    ]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
