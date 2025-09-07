/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the image-list block
  if (!element.classList.contains('image-list')) return;

  // Header row for the block table
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Find all cards in the image list
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');

  // If no items, do not replace
  if (!items.length) return;

  items.forEach((item) => {
    // Each card's content is inside article
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find the actual <img> element
    const img = article.querySelector('.cmp-image-list__item-image img');
    if (!img) return; // Image is mandatory

    // Text cell: title, description
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell: title (as heading), description
    const textCell = [];
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      textCell.push(h3);
    }
    if (descriptionSpan) {
      const p = document.createElement('p');
      p.textContent = descriptionSpan.textContent;
      textCell.push(p);
    }

    rows.push([img, textCell]);
  });

  // Only replace if we have at least one card row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
