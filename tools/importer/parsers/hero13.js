/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image element (background image)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // Find the actual <img> inside
    imageEl = imageContainer.querySelector('img');
  }

  // Get the content block (title, description, CTA)
  const contentEl = teaser.querySelector('.cmp-teaser__content');
  let contentBlock = [];
  if (contentEl) {
    // Title
    const titleEl = contentEl.querySelector('.cmp-teaser__title');
    if (titleEl) contentBlock.push(titleEl);
    // Description
    const descEl = contentEl.querySelector('.cmp-teaser__description');
    if (descEl) contentBlock.push(descEl);
    // CTA
    const ctaContainer = contentEl.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentBlock.push(ctaLink);
    }
  }

  // Compose table rows
  const headerRow = ['Hero (hero13)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentBlock.length ? contentBlock : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
