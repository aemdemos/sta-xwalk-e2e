/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image element (background image)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the first <img> inside the image wrapper
    imageEl = imageWrapper.querySelector('img');
  }

  // Get the content block (title + description)
  const content = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (content) {
    // Title (h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description (div > p)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
