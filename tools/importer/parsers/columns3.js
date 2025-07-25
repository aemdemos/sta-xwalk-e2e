/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (should be inside the passed element)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all direct child divs of .columns.block (these represent rows)
  const rowDivs = Array.from(columnsBlock.querySelectorAll(':scope > div'));
  if (rowDivs.length === 0) return;

  // For each row, get its immediate div children (columns)
  let maxCols = 0;
  const rows = rowDivs.map((rowDiv) => {
    const cols = Array.from(rowDiv.querySelectorAll(':scope > div'));
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });
  if (maxCols === 0) return;

  // Header row: must be a single cell array per requirements
  const cells = [['Columns']];

  // All content rows, each with multiple columns
  rows.forEach((cols) => {
    const rowCells = cols.map((col) => col);
    // Pad if needed for consistency (shouldn't be needed for this block, but safe)
    while (rowCells.length < maxCols) {
      rowCells.push('');
    }
    cells.push(rowCells);
  });

  // Create and replace original element with the columns block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
