/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the main teaser container
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image column (left)
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  let imageCol = null;
  if (imageWrapper) {
    imageCol = imageWrapper;
  }

  // Get the content column (right)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentCol = null;
  if (contentWrapper) {
    contentCol = contentWrapper;
  }

  // Build the table rows
  const headerRow = ['Columns (columns40)'];
  const contentRow = [imageCol, contentCol];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
