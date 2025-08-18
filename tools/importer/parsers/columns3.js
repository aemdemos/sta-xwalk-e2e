/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs (each representing a row)
  const rows = Array.from(element.querySelectorAll(':scope > div'));
  if (!rows.length) return;

  // Find the max number of columns (for proper table structure)
  let maxCols = 0;
  const tableRows = rows.map(row => {
    const cols = Array.from(row.children);
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });

  // Build table: header row comes first and is a single column
  const table = [];
  table.push(['Columns']);

  // Each row should contain each column as a cell
  tableRows.forEach(cols => {
    const rowCells = cols.map(col => col);
    // pad with empty string if not enough columns
    while (rowCells.length < maxCols) rowCells.push('');
    table.push(rowCells);
  });

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
