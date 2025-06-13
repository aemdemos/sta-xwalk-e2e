/* global WebImporter */
export default function parse(element, { document }) {
  // Get the columns block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each direct child <div> of columnsBlock is a row
  const rowDivs = Array.from(columnsBlock.children);
  if (rowDivs.length === 0) return;

  // Find the maximum number of columns in any row
  let maxCols = 0;
  rowDivs.forEach(row => {
    maxCols = Math.max(maxCols, row.children.length);
  });

  // The header row must be a single column, per spec
  const headerRow = ['Columns (columns3)'];

  // For each row, fill with direct children. If fewer than maxCols, pad with empty strings
  const tableRows = rowDivs.map(rowDiv => {
    const colDivs = Array.from(rowDiv.children);
    const cells = colDivs.map(div => div);
    // pad if needed
    while (cells.length < maxCols) cells.push('');
    return cells;
  });

  // Compose the full cells array: header is always a single cell
  const cells = [headerRow, ...tableRows];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
