/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the expected structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header as per block guidelines
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // For each card (li)
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the article containing the card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image inside the first link
    let imageCell = '';
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the actual image element (img)
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    // Title (as heading), description, and optional CTA
    const textCellContent = [];

    // Title
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        // Create a heading element for the title
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textCellContent.push(heading);
      }
    }

    // Description
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    if (descSpan) {
      // Use a paragraph for the description
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCellContent.push(descP);
    }

    // CTA (if present, use the title link as CTA)
    // Only add CTA if it's not already used as the heading
    if (titleLink) {
      // If the heading is present, add CTA as a link below
      if (textCellContent.length > 0) {
        // Clone the link for CTA
        const cta = document.createElement('a');
        cta.href = titleLink.href;
        cta.textContent = 'Read more';
        textCellContent.push(cta);
      }
    }

    // Add the row: [image, text content]
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
