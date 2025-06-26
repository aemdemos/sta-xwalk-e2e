/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block (should be direct child)
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Get all rows in the columns block (should be divs)
  const rows = Array.from(columnsBlock.children).filter((row) => row.tagName === 'DIV');
  if (!rows.length) return;

  // For each row, get its direct column divs as elements
  const rowCells = rows.map((row) => {
    return Array.from(row.children).filter((col) => col.tagName === 'DIV');
  });

  // Find the maximum number of columns in any row
  const maxCols = rowCells.reduce((max, cols) => Math.max(max, cols.length), 0);

  // Header: Exactly ONE column with 'Columns'
  const tableRows = [['Columns']];

  // Table rows: Pad each row to match maxCols, as required
  rowCells.forEach(cols => {
    const cells = [...cols];
    while (cells.length < maxCols) {
      cells.push('');
    }
    tableRows.push(cells);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
