/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the cmp-teaser element (may be the same as 'element')
  const teaser = element;

  // Header row: Always use block name
  const headerRow = ['Hero (hero39)'];

  // Find the image (background)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // 2nd row: Background image (optional)
  const imageRow = [imageEl ? imageEl : ''];

  // 3rd row: Title, description, and any CTA (none in this example)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentWrapper) {
    // Title
    const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
    if (titleEl) contentParts.push(titleEl);
    // Description
    const descEl = contentWrapper.querySelector('.cmp-teaser__description');
    if (descEl) contentParts.push(descEl);
    // CTA: Look for a link inside content (not present in this example)
    const ctaEl = contentWrapper.querySelector('a');
    if (ctaEl) contentParts.push(ctaEl);
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Compose table rows
  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
