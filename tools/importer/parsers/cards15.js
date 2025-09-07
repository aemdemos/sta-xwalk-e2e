/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the <ul> with class 'cmp-image-list' inside the given element
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Get all <li> items (cards)
  const items = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Prepare the header row as required
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  items.forEach((li) => {
    // Defensive: Find the content container
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image inside the image link
    let imageEl = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the <img> inside the link
      imageEl = imageLink.querySelector('img');
    }

    // --- Text cell ---
    // Title (as heading)
    let titleEl = null;
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap the title in a <strong> (for heading effect, as in markdown example)
        titleEl = document.createElement('strong');
        titleEl.textContent = titleSpan.textContent;
      }
    }

    // Description
    let descEl = null;
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent;
    }

    // Compose the text cell contents
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);

    // Add the row: [image, text]
    rows.push([
      imageEl || '',
      textCellContent.length ? textCellContent : '',
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
