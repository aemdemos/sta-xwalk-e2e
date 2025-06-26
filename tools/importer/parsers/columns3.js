/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all rows (immediate children)
  const rowDivs = Array.from(columnsBlock.children);
  if (rowDivs.length === 0) return;

  // Build content rows and determine max number of columns
  let maxCols = 0;
  const rows = rowDivs.map((rowDiv) => {
    // Get direct child divs as columns
    const colDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    const cols = colDivs.length ? colDivs : [rowDiv];
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });

  // Header row: 'Columns' in first cell, rest empty to match maxCols
  const headerRow = Array(maxCols).fill('');
  headerRow[0] = 'Columns';

  // Pad content rows to ensure all rows are rectangular
  const normalizedRows = rows.map((cols) => {
    if (cols.length < maxCols) {
      return [...cols, ...Array(maxCols - cols.length).fill('')];
    }
    return cols;
  });

  // Build final table
  const cells = [headerRow, ...normalizedRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
