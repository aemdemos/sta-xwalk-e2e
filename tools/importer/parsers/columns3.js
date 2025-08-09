/* global WebImporter */
export default function parse(element, { document }) {
  // Find all row divs (each is a group of columns)
  const rowDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Determine max number of columns in any row
  let maxCols = 0;
  const rows = rowDivs.map(rowDiv => {
    const columnDivs = Array.from(rowDiv.querySelectorAll(':scope > div'));
    if (columnDivs.length > maxCols) maxCols = columnDivs.length;
    return columnDivs;
  });
  // Header row: must be single cell: ['Columns']
  const headerRow = ['Columns'];
  // Each row is a flat array of columns; push as table row
  // Ensure each row has the same number of columns
  const tableRows = rows.map(cols => {
    // If number of columns is less than maxCols, fill with empty string
    if (cols.length < maxCols) {
      return [...cols, ...Array(maxCols - cols.length).fill('')];
    }
    return cols;
  });
  // Compose table cell array
  const tableData = [headerRow, ...tableRows];
  // Create the table block
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace old element
  element.replaceWith(blockTable);
}
