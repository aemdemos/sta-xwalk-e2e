/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero teaser block
  const teaser = element.querySelector('.teaser.cmp-teaser--hero .cmp-teaser');
  if (!teaser) return;

  // Get the image element (background image)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Get the title (headline), subheading, and CTA (if present)
  const contentCell = document.createElement('div');
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    // Title
    const titleEl = content.querySelector('.cmp-teaser__title');
    if (titleEl) contentCell.appendChild(titleEl.cloneNode(true));
    // Subheading (not present in sample, but for future-proofing)
    const subheadingEl = content.querySelector('.cmp-teaser__subtitle');
    if (subheadingEl) contentCell.appendChild(subheadingEl.cloneNode(true));
    // CTA (not present in sample, but for future-proofing)
    const ctaEl = content.querySelector('a');
    if (ctaEl) contentCell.appendChild(ctaEl.cloneNode(true));
  }

  // Build the table rows
  const headerRow = ['Hero (hero11)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
