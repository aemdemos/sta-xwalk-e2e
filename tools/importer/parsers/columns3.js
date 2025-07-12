/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all top-level column rows (children of .columns.block)
  const columnRows = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  if (!columnRows.length) return;

  // Determine the max number of columns in any row
  let maxCols = 0;
  const colsPerRow = columnRows.map(row => {
    const cols = Array.from(row.children);
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });
  if (maxCols < 1) maxCols = 1;

  // Header row: 'Columns' in the first cell, then empty string for each remaining column
  const headerRow = Array.from({length: maxCols}, (_, i) => i === 0 ? 'Columns' : '');

  // Prepare the table rows
  const tableRows = [headerRow];
  colsPerRow.forEach(cols => {
    const rowCells = cols.slice();
    while (rowCells.length < maxCols) rowCells.push('');
    tableRows.push(rowCells);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
