/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists and is a container for cards
  if (!element || !document) return;

  // Table header row as specified
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Find all card items (li elements)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((li) => {
    // Defensive: find the content article
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image inside the image link
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }
    // Fallback: if no image found, use empty string
    if (!imageCell) imageCell = '';

    // --- TEXT CELL ---
    const textCellContent = [];
    // Title (as heading, wrapped in <strong> for semantic match)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap title in <strong> for heading effect
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCellContent.push(strong);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use a <p> for description
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textCellContent.push(p);
    }
    // Call-to-action: use the title link if present
    if (titleLink && titleLink.href) {
      // Only add CTA if the link is not already used for the title
      // (In this structure, the title itself is the link, so skip duplicate)
    }

    // Defensive: if no text content, use empty string
    const textCell = textCellContent.length ? textCellContent : [''];

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
