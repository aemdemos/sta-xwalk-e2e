/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .columns.block inside the wrapper
  const columnsBlock = element.querySelector('.columns.block');
  if (!columnsBlock) return;

  // Each direct child of columnsBlock represents a row
  const rowDivs = Array.from(columnsBlock.children);
  if (rowDivs.length === 0) return;

  // Determine the maximum number of columns in any row
  let maxCols = 0;
  rowDivs.forEach((rowDiv) => {
    maxCols = Math.max(maxCols, rowDiv.children.length);
  });

  // Build the cells array
  const cells = [];
  // Header row: always a single column with 'Columns'
  cells.push(['Columns']);

  // For each row, build the correct number of columns
  rowDivs.forEach((rowDiv) => {
    const colDivs = Array.from(rowDiv.children);
    // Pad the row if needed to match maxCols
    while (colDivs.length < maxCols) {
      colDivs.push('');
    }
    cells.push(colDivs);
  });

  // Create the table using the cells array
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
