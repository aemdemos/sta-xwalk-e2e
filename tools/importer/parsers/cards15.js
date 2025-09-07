/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll('li.cmp-image-list__item'));
  if (!items.length) return;

  // Table header
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image (first cell)
    let imageCell = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Use the image element directly for semantic value
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Find text content (second cell)
    const textCell = document.createElement('div');
    // Title (as heading)
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent;
      textCell.appendChild(heading);
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.appendChild(descP);
    }
    // Call-to-action (use title link if present and meaningful)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink && titleLink.href) {
      // Only add CTA if the link is not just for the image
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textCell.appendChild(cta);
    }

    // Compose row: [image, textContent]
    rows.push([
      imageCell,
      textCell
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
