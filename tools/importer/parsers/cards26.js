/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the UL containing all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Each LI is a card
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // Find the article containing card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // IMAGE CELL: Find the image element (img inside .cmp-image-list__item-image)
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const cmpImage = imageDiv.querySelector('.cmp-image');
        if (cmpImage) {
          const img = cmpImage.querySelector('img');
          if (img) {
            imageCell = img;
          }
        }
      }
    }
    // Defensive fallback: if no image found, skip this card
    if (!imageCell) return;

    // TEXT CELL: Title, Description, and CTA (if present)
    const textContent = [];
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element (h3)
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textContent.push(heading);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use a paragraph for description
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.push(descP);
    }
    // CTA: If the title is a link, add it as a CTA at the bottom (but only if not already used as heading)
    if (titleLink && titleLink.href) {
      // Only add CTA if not already used as heading
      // (In this structure, heading is not a link, so add CTA)
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textContent.push(cta);
    }

    // Add the card row: [image, text]
    rows.push([imageCell, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
