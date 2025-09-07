/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns: image and content
  const imageCol = element.querySelector('.cmp-teaser__image');
  const contentCol = element.querySelector('.cmp-teaser__content');

  // Defensive: if either is missing, fallback to an empty cell
  const leftCell = imageCol || document.createElement('div');
  if (!imageCol) leftCell.textContent = '';
  const rightCell = contentCol || document.createElement('div');
  if (!contentCol) rightCell.textContent = '';

  // Table structure: header row, then one row with two columns
  const headerRow = ['Columns (columns40)'];
  const contentRow = [leftCell, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
