/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image column (left)
  const imageCol = element.querySelector('.cmp-teaser__image');
  // Find the content column (right)
  const contentCol = element.querySelector('.cmp-teaser__content');

  // Defensive: Only proceed if at least one column exists
  if (!imageCol && !contentCol) return;

  // Table header must match the block name exactly
  const headerRow = ['Columns (columns21)'];
  // Table row: always two columns, even if one is empty
  const contentRow = [imageCol || '', contentCol || ''];

  // Create the columns table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
