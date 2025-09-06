/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Header row: block name
  const headerRow = ['Hero (hero27)'];

  // --- Row 2: Background Image ---
  // Find the image container
  let imageCell = '';
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // Find the actual <img> element
    const img = imageContainer.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // --- Row 3: Content (Title, Description, CTA) ---
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentContainer) {
    // Gather title, description, and CTA
    const parts = [];
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) parts.push(title);
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) parts.push(desc);
    const ctaContainer = contentContainer.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const cta = ctaContainer.querySelector('.cmp-teaser__action-link');
      if (cta) parts.push(cta);
    }
    if (parts.length) contentCell = parts;
  }

  // Compose table rows
  const cells = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
