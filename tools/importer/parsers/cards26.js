/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Prepare header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all LI items (cards)
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // Find image (first cell)
    let imageEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Defensive: find the actual image element inside the link
      imageEl = imageLink.querySelector('img');
    }
    // If no image found, skip this card
    if (!imageEl) return;

    // Find text content (second cell)
    const textContent = document.createElement('div');
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent;
        textContent.appendChild(heading);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.appendChild(descP);
    }
    // Call-to-action (optional, use title link if present)
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textContent.appendChild(cta);
    }

    rows.push([imageEl, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
