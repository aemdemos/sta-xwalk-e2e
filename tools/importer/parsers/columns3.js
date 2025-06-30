/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each row is a direct child <div> of .columns.block
  const rowDivs = Array.from(columnsBlock.children).filter(row => row.tagName === 'DIV');

  // Determine the maximum number of columns in any row
  let maxCols = 0;
  const allRowCols = rowDivs.map(row => {
    const cols = Array.from(row.children).filter(col => col.tagName === 'DIV');
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });

  // Build the table cells array
  const table = [];
  // Header row: only one column with 'Columns'
  table.push(['Columns']);

  // For each row, create exactly maxCols columns (pad with '' as needed)
  allRowCols.forEach(cols => {
    const rowCells = cols.slice(0, maxCols);
    while (rowCells.length < maxCols) rowCells.push('');
    table.push(rowCells);
  });

  // Create the block table and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(blockTable);
}
