/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .columns.block inside the .columns-wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each child of .columns.block is a row
  const blockRows = Array.from(columnsBlock.children);

  // Determine the maximum number of columns in any row
  let maxCols = 0;
  blockRows.forEach(row => {
    const colCount = Array.from(row.children).length;
    if (colCount > maxCols) maxCols = colCount;
  });
  if (maxCols === 0) return;

  // Build the table: the header row must be a single cell
  const cells = [
    ['Columns'] // Header row – single cell ONLY
  ];

  // For each row, build array of cells (pad to maxCols)
  blockRows.forEach(row => {
    const colEls = Array.from(row.children);
    const rowCells = [];
    for (let i = 0; i < maxCols; i++) {
      rowCells.push(colEls[i] || '');
    }
    cells.push(rowCells);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
