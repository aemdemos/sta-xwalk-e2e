/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element contains the expected structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Find image element
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imageLink) {
      // Defensive: find the actual <img> inside the image link
      imageEl = imageLink.querySelector('img');
      // If imageEl exists, use the <img> element directly
    }

    // Compose text cell
    const textFragments = [];

    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Create heading element and append link inside
      const heading = document.createElement('h3');
      heading.appendChild(titleLink);
      textFragments.push(heading);
    }

    // Description
    const descriptionSpan = item.querySelector('.cmp-image-list__item-description');
    if (descriptionSpan) {
      // Use the span directly
      textFragments.push(descriptionSpan);
    }

    // Compose row: [image, text]
    rows.push([
      imageEl ? imageEl : '',
      textFragments
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
