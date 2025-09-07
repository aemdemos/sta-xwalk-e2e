/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block (could be the element itself)
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Get the image element (background image)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Get the content (title, description, etc.)
  const content = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (content) {
    // Get title (as heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Get description (as paragraph)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
  }

  // Compose table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
