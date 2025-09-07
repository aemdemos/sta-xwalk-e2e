/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Cards (cards32)'];

  // Find all card items (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  // Prepare rows for each card
  const rows = Array.from(items).map((item) => {
    // Defensive: find the article containing the card content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return null;

    // --- IMAGE CELL ---
    // Find the image element
    let imgEl = article.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!imgEl) {
      // Try to find any img inside the article
      imgEl = article.querySelector('img');
    }

    // --- TEXT CELL ---
    // Title (as heading)
    let titleSpan = article.querySelector('.cmp-image-list__item-title');
    let titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleEl;
    if (titleSpan) {
      // Create heading element
      titleEl = document.createElement('h3');
      if (titleLink) {
        // Wrap heading in link if available
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.append(titleSpan.textContent);
        titleEl.append(link);
      } else {
        titleEl.textContent = titleSpan.textContent;
      }
    }

    // Description
    let descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }

    // Compose text cell content
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);

    // Each row: [image, text]
    return [imgEl, textCellContent];
  }).filter(Boolean); // Remove any nulls from defensive parsing

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
