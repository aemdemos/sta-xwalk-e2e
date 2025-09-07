/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the cmp-teaser block root
  const teaser = element;

  // Header row: Block name only
  const headerRow = ['Hero (hero38)'];

  // Row 2: Background image (optional)
  let imageCell = '';
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the actual image element
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Row 3: Content (title, description, etc.)
  let contentCell = '';
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Gather all heading and description elements
    const contentParts = [];
    // Title (h2)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      contentParts.push(title);
    }
    // Description (div > p)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      contentParts.push(desc);
    }
    // If there are other elements (e.g., CTA), add them here
    contentCell = contentParts;
  }

  // Build the table
  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the block table
  teaser.replaceWith(block);
}
