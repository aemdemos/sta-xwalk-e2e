/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the image (background image)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Find the content (title and description)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentWrapper) {
    // Title (usually h2)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description (usually a div with a p)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
