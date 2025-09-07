/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Table header row as required
  const headerRow = ['Carousel (carousel40)'];

  // Find image (mandatory)
  let imageCell = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      // Clone to detach from DOM
      imageCell = img.cloneNode(true);
    }
  }

  // Find text content (optional)
  let textCellContent = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Featured Article pretitle
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textCellContent.push(pretitle.cloneNode(true));

    // Title (as heading)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) textCellContent.push(title.cloneNode(true));

    // Description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) textCellContent.push(desc.cloneNode(true));

    // CTA link
    const actionContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) textCellContent.push(cta.cloneNode(true));
    }
  }

  // Defensive fallback: If no image, skip block creation
  if (!imageCell) return;

  // Build table rows
  const rows = [headerRow];
  rows.push([
    imageCell,
    textCellContent.length ? textCellContent : ''
  ]);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
