/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block
  let columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) columnsBlock = element;

  // Get each row (each child div of the columns block)
  const rowDivs = Array.from(columnsBlock.children);
  if (!rowDivs.length) return;

  // Find the maximum number of columns in any row
  let maxCols = 0;
  const allRowCols = rowDivs.map(rowDiv => {
    const cols = Array.from(rowDiv.children);
    if (cols.length > maxCols) maxCols = cols.length;
    return cols;
  });

  // Header row: one cell with block name 'Columns'
  const tableRows = [];
  tableRows.push(['Columns']);

  // For each row, pad with empty strings if less than maxCols
  allRowCols.forEach(cols => {
    const row = [];
    for (let i = 0; i < maxCols; i++) {
      row.push(cols[i] || '');
    }
    tableRows.push(row);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  // Make sure the header row's single th spans all columns (colspan)
  const th = table.querySelector('th');
  if (th && maxCols > 1) {
    th.setAttribute('colspan', maxCols);
  }
  element.replaceWith(table);
}
