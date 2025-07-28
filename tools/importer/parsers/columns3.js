/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner columns block
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;
  // Get all rows in the columns block
  const rowDivs = Array.from(columnsBlock.children);
  // For each row, get all immediate columns (cells)
  const tableRows = rowDivs.map(rowDiv => Array.from(rowDiv.children));
  // Find the maximum number of columns across all rows
  const maxColumns = tableRows.reduce((max, row) => Math.max(max, row.length), 0);
  // Ensure all rows have the same number of columns (fill with empty divs if needed)
  const normalizedRows = tableRows.map(row => {
    if (row.length < maxColumns) {
      return [...row, ...Array(maxColumns - row.length).fill(document.createElement('div'))];
    }
    return row;
  });
  // Table: HEADER is a single cell, CONTENT rows match columns
  const cells = [];
  cells.push(['Columns']); // SINGLE-CELL HEADER ROW
  normalizedRows.forEach(row => cells.push(row));
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
