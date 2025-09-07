/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list container
  const imageList = element.querySelector('.image-list.list > .cmp-image-list');
  if (!imageList) return;

  // Header row as per requirements
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // For each card/item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the article containing the card content
    const article = li.querySelector(':scope > article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image inside the image-link
    let imageCell = null;
    const imageLink = article.querySelector(':scope > a.cmp-image-list__item-image-link');
    if (imageLink) {
      // The image is inside a div inside the link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- TEXT CELL ---
    // Title (as heading), description, and optional CTA
    const textCellContent = [];
    // Title
    const titleLink = article.querySelector(':scope > a.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use a heading element for semantic meaning
      const heading = document.createElement('h3');
      // The title text is inside a span
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        heading.textContent = titleSpan.textContent;
      } else {
        heading.textContent = titleLink.textContent;
      }
      textCellContent.push(heading);
    }
    // Description
    const desc = article.querySelector(':scope > .cmp-image-list__item-description');
    if (desc) {
      // Use a paragraph for description
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCellContent.push(p);
    }
    // CTA (if any): in this structure, the title link is the only CTA, so only add if not already present
    // (If there was a separate CTA, it would be handled here)

    // Add the row if both image and text are present
    if (imageCell && textCellContent.length > 0) {
      rows.push([imageCell, textCellContent]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
