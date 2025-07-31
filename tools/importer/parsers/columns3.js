/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all top-level rows (immediate children of .columns.block)
  const rowDivs = Array.from(columnsBlock.children);
  if (!rowDivs.length) return;

  // Find the maximum columns in any row
  let maxCols = 0;
  rowDivs.forEach(row => {
    const n = row.querySelectorAll(':scope > div').length;
    if (n > maxCols) maxCols = n;
  });
  if (maxCols === 0) return;

  // Build the cells array
  const cells = [];
  // Header row is a single cell array, per requirements
  cells.push(['Columns']);
  // For each row, add an array of columns (one cell per column)
  rowDivs.forEach(row => {
    const colDivs = Array.from(row.querySelectorAll(':scope > div')).map(colDiv => {
      // If it's an image column (contains only a picture), use the picture
      if (
        colDiv.classList.contains('columns-img-col') &&
        colDiv.children.length === 1 &&
        colDiv.firstElementChild.tagName === 'PICTURE'
      ) {
        return colDiv.firstElementChild;
      }
      // Otherwise, just use the full colDiv
      return colDiv;
    });
    // Pad with empty strings if not enough columns in this row
    while (colDivs.length < maxCols) colDivs.push('');
    cells.push(colDivs);
  });

  // Now use createTable, and fix the first row to be a single cell
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // If there are more than 1 column, set the header cell's colspan
  if (maxCols > 1) {
    const firstTh = table.querySelector('th');
    if (firstTh) {
      firstTh.setAttribute('colspan', maxCols);
    }
  }
  element.replaceWith(table);
}
